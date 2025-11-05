#!/usr/bin/env python3
"""
File watcher for automatic Sora watermark removal.
Monitors the Big Downloads folder for new MP4 files matching the pattern
YYYYMMDD_TIME_*.mp4 and automatically processes them.
"""

import re
import subprocess
import sys
import time
from pathlib import Path
from typing import Set

# Python 3.13 compatibility shim for imghdr
if sys.version_info >= (3, 13):
    try:
        import imghdr_compat
    except ImportError:
        pass

from loguru import logger
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

from sorawm.core import SoraWM


def send_macos_notification(title: str, message: str, subtitle: str = ""):
    """
    Send a macOS system notification using osascript.
    
    Args:
        title: Notification title
        message: Notification message body
        subtitle: Optional subtitle
    """
    try:
        # Escape special characters for AppleScript
        title_escaped = title.replace('"', '\\"')
        message_escaped = message.replace('"', '\\"')
        subtitle_escaped = subtitle.replace('"', '\\"') if subtitle else ""
        
        # Build AppleScript command
        if subtitle:
            script = f'display notification "{message_escaped}" with title "{title_escaped}" subtitle "{subtitle_escaped}"'
        else:
            script = f'display notification "{message_escaped}" with title "{title_escaped}"'
        
        # Execute osascript
        result = subprocess.run(
            ["osascript", "-e", script],
            check=False,
            capture_output=True,
            timeout=5
        )
        
        # Log notification attempts
        if result.returncode == 0:
            logger.debug(f"Notification sent: {title} - {message}")
        else:
            logger.warning(f"Notification failed (code {result.returncode}): {result.stderr.decode()}")
    except Exception as e:
        # Don't fail if notifications don't work, just log it
        logger.error(f"Failed to send notification: {e}")


class VideoProcessor(FileSystemEventHandler):
    """Handler for file system events that processes matching MP4 files."""
    
    def __init__(self, input_folder: Path, output_folder: Path):
        """
        Initialize the video processor.
        
        Args:
            input_folder: Folder to watch for new MP4 files
            output_folder: Folder to save processed videos
        """
        self.input_folder = Path(input_folder)
        self.output_folder = Path(output_folder)
        self.output_folder.mkdir(parents=True, exist_ok=True)
        self.processed_files: Set[str] = set()
        self.sora_wm = SoraWM()
        
        # Pattern: YYYYMMDD_TIME_*.mp4 (8 digits, underscore, time, underscore, anything, .mp4)
        self.pattern = re.compile(r'^(\d{8})_(\d+)_')
        
        # Persistent tracking file to remember processed files across restarts
        self.tracking_file = self.output_folder / ".processed_files.txt"
        self._load_processed_files()
        
        logger.info(f"Watching folder: {self.input_folder}")
        logger.info(f"Output folder: {self.output_folder}")
        logger.info(f"Loaded {len(self.processed_files)} previously processed files")
    
    def _load_processed_files(self):
        """Load previously processed files from tracking file."""
        if self.tracking_file.exists():
            try:
                with open(self.tracking_file, 'r') as f:
                    for line in f:
                        file_path = line.strip()
                        if file_path:
                            self.processed_files.add(file_path)
                logger.info(f"Loaded {len(self.processed_files)} processed files from tracking")
            except Exception as e:
                logger.warning(f"Failed to load processed files tracking: {e}")
    
    def _save_processed_file(self, file_path: str):
        """Save processed file to tracking file."""
        try:
            with open(self.tracking_file, 'a') as f:
                f.write(f"{file_path}\n")
        except Exception as e:
            logger.warning(f"Failed to save processed file to tracking: {e}")
        
    def _extract_filename_prefix(self, filename: str) -> str | None:
        """
        Extract the prefix up to the second underscore for renaming.
        
        Example: '20251104_1209_01k97zny35f599pp7dpv6tk1wc.mp4' -> '20251104_1209'
        
        Args:
            filename: The input filename
            
        Returns:
            Prefix string up to second underscore, or None if pattern doesn't match
        """
        match = self.pattern.match(filename)
        if match:
            year_month_day = match.group(1)
            time_part = match.group(2)
            return f"{year_month_day}_{time_part}"
        return None
    
    def _generate_output_filename(self, input_filename: str) -> str:
        """
        Generate output filename with wr_ prefix.
        
        Args:
            input_filename: Original filename
            
        Returns:
            New filename: wr_YYYYMMDD_TIME.mp4
        """
        prefix = self._extract_filename_prefix(input_filename)
        if prefix:
            return f"wr_{prefix}.mp4"
        # Fallback: add wr_ prefix to original name
        return f"wr_{input_filename}"
    
    def _process_video(self, file_path: Path):
        """
        Process a video file to remove watermark.
        
        Args:
            file_path: Path to the video file to process
        """
        file_path_str = str(file_path)
        
        # Skip if already processed
        if file_path_str in self.processed_files:
            logger.debug(f"Skipping already processed file: {file_path.name}")
            return
        
        # Check if file matches pattern
        if not self.pattern.match(file_path.name):
            logger.debug(f"File doesn't match pattern: {file_path.name}")
            return
        
        # Generate output filename
        output_filename = self._generate_output_filename(file_path.name)
        output_path = self.output_folder / output_filename
        
        # Check if this is a new file (not already processed)
        is_new_file = file_path_str not in self.processed_files
        
        # Send notification that file was detected (always notify for new matching files)
        if is_new_file:
            send_macos_notification(
                title="Watermark Remover",
                message=f"New video detected: {file_path.name}",
                subtitle="Starting watermark removal..."
            )
            logger.info(f"New video detected: {file_path.name}")
        
        # Skip if output already exists OR if already processed
        if output_path.exists():
            logger.info(f"Output already exists, skipping: {output_filename}")
            if file_path_str not in self.processed_files:
                self.processed_files.add(file_path_str)
                self._save_processed_file(file_path_str)
            return
        
        # Also check if we've already processed this file (even if output was deleted)
        if file_path_str in self.processed_files:
            logger.debug(f"File already processed (tracked), skipping: {file_path.name}")
            return
        
        logger.info(f"Processing video: {file_path.name}")
        logger.info(f"Output will be saved as: {output_filename}")
        
        try:
            # Process the video
            self.sora_wm.run(file_path, output_path)
            logger.success(f"Successfully processed: {file_path.name} -> {output_filename}")
            self.processed_files.add(file_path_str)
            self._save_processed_file(file_path_str)  # Persist to disk
            
            # Send success notification
            send_macos_notification(
                title="Watermark Remover",
                message=f"Watermark removed: {output_filename}",
                subtitle="Processing complete"
            )
        except Exception as e:
            logger.error(f"Error processing {file_path.name}: {e}")
            # Send error notification
            send_macos_notification(
                title="Watermark Remover",
                message=f"Error processing: {file_path.name}",
                subtitle=str(e)[:100]  # Truncate long error messages
            )
            # Don't add to processed_files so it can be retried
    
    def on_created(self, event):
        """Called when a file is created."""
        if event.is_directory:
            return
        
        file_path = Path(event.src_path)
        
        # Only process MP4 files
        if file_path.suffix.lower() != '.mp4':
            return
        
        # Wait a moment for file to be fully written
        time.sleep(2)
        
        # Verify file exists and is readable
        if not file_path.exists():
            logger.warning(f"File disappeared: {file_path.name}")
            return
        
        # Check file size to ensure it's not empty or still being written
        initial_size = file_path.stat().st_size
        time.sleep(1)
        if file_path.stat().st_size != initial_size:
            logger.debug(f"File still being written, waiting: {file_path.name}")
            # Wait a bit more
            time.sleep(3)
        
        self._process_video(file_path)
    
    def on_moved(self, event):
        """Called when a file is moved/renamed."""
        if event.is_directory:
            return
        
        dest_path = Path(event.dest_path)
        
        # Only process MP4 files
        if dest_path.suffix.lower() != '.mp4':
            return
        
        # Only process if file was moved INTO the watched folder (not out of it)
        if not dest_path.parent.samefile(self.input_folder):
            return
        
        # Wait a moment for file to be fully written
        time.sleep(2)
        
        # Verify file exists
        if not dest_path.exists():
            return
        
        # Check file size to ensure it's not empty or still being written
        initial_size = dest_path.stat().st_size
        time.sleep(1)
        if dest_path.stat().st_size != initial_size:
            logger.debug(f"File still being written, waiting: {dest_path.name}")
            time.sleep(3)
        
        self._process_video(dest_path)


def main():
    """Main function to start the file watcher."""
    # Configuration
    input_folder = Path("/Users/blakeyoung/Library/Mobile Documents/com~apple~CloudDocs/Big Downloads")
    output_folder = Path("/Users/blakeyoung/Library/Mobile Documents/com~apple~CloudDocs/Streaming/Removed Watermark")
    
    # Ensure input folder exists
    if not input_folder.exists():
        logger.error(f"Input folder does not exist: {input_folder}")
        return
    
    # Create output folder if it doesn't exist
    output_folder.mkdir(parents=True, exist_ok=True)
    
    # Set up logging
    logger.add(
        output_folder / "watcher.log",
        rotation="10 MB",
        retention="7 days",
        level="INFO"
    )
    
    # Initialize processor
    event_handler = VideoProcessor(input_folder, output_folder)
    
    # Set up observer
    observer = Observer()
    observer.schedule(event_handler, str(input_folder), recursive=False)
    
    logger.info("Starting file watcher...")
    logger.info(f"Watching: {input_folder}")
    logger.info(f"Output: {output_folder}")
    logger.info("Press Ctrl+C to stop")
    
    # Send startup notification
    send_macos_notification(
        title="Watermark Remover",
        message="Watcher started successfully",
        subtitle=f"Monitoring: {input_folder.name}"
    )
    
    try:
        observer.start()
        
        # On startup, check for files that need processing (haven't been processed yet)
        # This handles files that arrived while watcher was down
        logger.info("Checking for unprocessed files...")
        existing_files = list(input_folder.glob("*.mp4"))
        matching_files = [f for f in existing_files if event_handler.pattern.match(f.name)]
        
        unprocessed_count = 0
        for mp4_file in matching_files:
            # Check if output already exists - if so, skip (already processed)
            output_filename = event_handler._generate_output_filename(mp4_file.name)
            output_path = event_handler.output_folder / output_filename
            
            # Skip if already processed (output exists OR tracked)
            file_path_str = str(mp4_file)
            if output_path.exists() or file_path_str in event_handler.processed_files:
                logger.debug(f"Skipping already processed: {mp4_file.name}")
                continue
            
            # This file needs processing - process it now
            logger.info(f"Found unprocessed file on startup: {mp4_file.name}")
            event_handler._process_video(mp4_file)
            unprocessed_count += 1
        
        if unprocessed_count > 0:
            logger.info(f"Processed {unprocessed_count} unprocessed file(s) on startup")
        else:
            logger.info("No unprocessed files found - all existing files already processed")
        
        logger.info("Watcher started - monitoring for NEW files")
        
        # Keep running
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        logger.info("Stopping file watcher...")
        observer.stop()
    
    observer.join()
    logger.info("File watcher stopped.")


if __name__ == "__main__":
    main()

