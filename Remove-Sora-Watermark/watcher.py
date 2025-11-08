#!/usr/bin/env python3
"""
File watcher for automatic Sora watermark removal.
Monitors the Big Downloads folder for new MP4 files matching the pattern
YYYYMMDD_TIME_*.mp4 and automatically processes them.
"""

import os
import re
import subprocess
import sys
import time
import json
import threading
from pathlib import Path
from typing import Set

# Set PATH to include Homebrew binaries (needed for ffmpeg/ffprobe)
os.environ['PATH'] = '/opt/homebrew/bin:/usr/local/bin:' + os.environ.get('PATH', '')

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
    
    def _write_progress(self, progress: int, filename: str = None):
        """Write progress to a file that the dev server can read"""
        try:
            progress_file = self.output_folder / ".watermark_progress.json"
            progress_data = {
                "progress": progress,
                "timestamp": time.time(),
                "is_processing": progress > 0 and progress < 100
            }
            if filename:
                progress_data["filename"] = filename
            with open(progress_file, 'w') as f:
                json.dump(progress_data, f)
        except Exception as e:
            logger.debug(f"Could not write progress: {e}")
    
    def _clear_progress(self):
        """Clear progress file when done"""
        try:
            progress_file = self.output_folder / ".watermark_progress.json"
            if progress_file.exists():
                progress_file.unlink()
        except Exception as e:
            logger.debug(f"Could not clear progress: {e}")
    
    def _process_video(self, file_path: Path):
        """
        Process a video file to remove watermark.
        Simple: if file matches pattern and is new, process it.
        
        Args:
            file_path: Path to the video file to process
        """
        file_path_str = str(file_path)
        
        logger.info(f"🔍 _process_video() called for: {file_path.name}")
        logger.info(f"   Full path: {file_path_str}")
        logger.info(f"   Input folder: {self.input_folder}")
        logger.info(f"   Output folder: {self.output_folder}")
        
        # Check if file matches pattern (YYYYMMDD_TIME_*.mp4)
        pattern_match = self.pattern.match(file_path.name)
        logger.info(f"   Pattern match result: {pattern_match}")
        if not pattern_match:
            logger.warning(f"⚠️ File doesn't match pattern: {file_path.name}")
            logger.info(f"   Pattern: {self.pattern.pattern}")
            return
        
        # Check if already processing/processed (prevent duplicates)
        logger.info(f"   Checking processed files set (size: {len(self.processed_files)})")
        if file_path_str in self.processed_files:
            logger.warning(f"⚠️ File already processed, skipping: {file_path.name}")
            return
        
        logger.info(f"✅ File is new and matches pattern, proceeding with processing")
        
        # Mark as processing NOW to prevent duplicate processing
        self.processed_files.add(file_path_str)
        self._save_processed_file(file_path_str)
        logger.info(f"✅ File marked as processing in tracking")
        
        # Generate output filename
        output_filename = self._generate_output_filename(file_path.name)
        output_path = self.output_folder / output_filename
        logger.info(f"   Output filename: {output_filename}")
        logger.info(f"   Output path: {output_path}")
        
        # Send notification
        send_macos_notification(
            title="Watermark Remover",
            message=f"New video detected: {file_path.name}",
            subtitle="Starting watermark removal..."
        )
        logger.info(f"🆕 Processing NEW video: {file_path.name} -> {output_filename}")
        logger.info(f"📊 Starting watermark removal process...")
        
        try:
            # Write initial progress with filename
            self._write_progress(1, file_path.name)
            
            # Progress callback to update progress file
            def progress_callback(progress: int):
                logger.debug(f"📊 Progress update: {progress}%")
                self._write_progress(progress, file_path.name)
            
            logger.info(f"🚀 Calling sora_wm.run() with progress callback...")
            logger.info(f"   Input: {file_path}")
            logger.info(f"   Output: {output_path}")
            
            # Process the video with progress callback
            self.sora_wm.run(file_path, output_path, progress_callback=progress_callback)
            logger.success(f"✅ Successfully processed: {file_path.name} -> {output_filename}")
            
            # Clear progress when done
            self._clear_progress()
            logger.info(f"✅ Progress file cleared")
            
            # KEEP original file in Big Downloads folder (user requested - for verification)
            # Previously deleted here, but keeping files so user can verify latest processing
            logger.info(f"📁 Keeping original file in Big Downloads: {file_path.name}")
            
            # Send success notification
            send_macos_notification(
                title="Watermark Remover",
                message=f"Watermark removed: {output_filename}",
                subtitle="Processing complete"
            )
        except Exception as e:
            logger.error(f"Error processing {file_path.name}: {e}")
            # Clear progress on error
            self._clear_progress()
            # Send error notification
            send_macos_notification(
                title="Watermark Remover",
                message=f"Error processing: {file_path.name}",
                subtitle=str(e)[:100]  # Truncate long error messages
            )
            # Remove from processed_files so it can be retried
            self.processed_files.discard(file_path_str)
            # Remove from tracking file
            try:
                if self.tracking_file.exists():
                    lines = []
                    with open(self.tracking_file, 'r') as f:
                        for line in f:
                            if line.strip() != file_path_str:
                                lines.append(line)
                    with open(self.tracking_file, 'w') as f:
                        f.writelines(lines)
            except Exception:
                pass  # Ignore tracking file errors
    
    def on_created(self, event):
        """Called when a NEW file is created - only process NEW files, not existing ones."""
        logger.info(f"📁 FILE CREATED EVENT: {event.src_path}")
        
        if event.is_directory:
            logger.debug(f"   Skipping directory: {event.src_path}")
            return
        
        file_path = Path(event.src_path)
        logger.info(f"   File path: {file_path}")
        logger.info(f"   File name: {file_path.name}")
        logger.info(f"   File suffix: {file_path.suffix}")
        
        # Only process MP4 files
        if file_path.suffix.lower() != '.mp4':
            logger.debug(f"   Skipping non-MP4 file: {file_path.name}")
            return
        
        logger.info(f"✅ MP4 file detected: {file_path.name}")
        
        # Check if file matches pattern (YYYYMMDD_TIME_*.mp4)
        pattern_match = self.pattern.match(file_path.name)
        logger.info(f"   Pattern check: {pattern_match}")
        if not pattern_match:
            logger.warning(f"⚠️ File doesn't match pattern (YYYYMMDD_TIME_*.mp4): {file_path.name}")
            logger.info(f"   Expected pattern: YYYYMMDD_TIME_*.mp4")
            logger.info(f"   Actual filename: {file_path.name}")
            return
        
        logger.info(f"✅ Pattern matched!")
        
        # Check if already processed (prevent duplicates)
        file_path_str = str(file_path)
        logger.info(f"   Checking if already processed...")
        logger.info(f"   Processed files count: {len(self.processed_files)}")
        if file_path_str in self.processed_files:
            logger.warning(f"⚠️ File already processed, skipping: {file_path.name}")
            return
        
        logger.info(f"✅ New file, not yet processed")
        
        # Wait a moment for file to be fully written
        logger.info(f"   Waiting 2 seconds for file to stabilize...")
        time.sleep(2)
        
        # Verify file exists and is readable
        if not file_path.exists():
            logger.error(f"❌ File disappeared: {file_path.name}")
            return
        
        logger.info(f"✅ File still exists after wait")
        
        # Check file size to ensure it's not empty or still being written
        try:
            initial_size = file_path.stat().st_size
            logger.info(f"   Initial file size: {initial_size} bytes ({initial_size/1024/1024:.2f} MB)")
            time.sleep(1)
            current_size = file_path.stat().st_size
            logger.info(f"   Current file size: {current_size} bytes ({current_size/1024/1024:.2f} MB)")
            
            if current_size != initial_size:
                logger.warning(f"⚠️ File still being written (size changed), waiting 3 more seconds...")
                logger.info(f"   Size changed: {initial_size} -> {current_size}")
                time.sleep(3)
                final_size = file_path.stat().st_size
                logger.info(f"   Final file size: {final_size} bytes ({final_size/1024/1024:.2f} MB)")
            else:
                logger.info(f"✅ File size stable, ready to process")
        except Exception as e:
            logger.error(f"❌ Error checking file size: {e}")
            return
        
        # Process the NEW file
        logger.info(f"🚀 Starting watermark removal process for: {file_path.name}")
        self._process_video(file_path)
    
    def on_moved(self, event):
        """Called when a file is moved/renamed - only process NEW files moved INTO the folder."""
        logger.info(f"📁 FILE MOVED EVENT: {event.src_path} -> {event.dest_path}")
        
        if event.is_directory:
            logger.debug(f"   Skipping directory move")
            return
        
        dest_path = Path(event.dest_path)
        logger.info(f"   Destination: {dest_path}")
        logger.info(f"   File name: {dest_path.name}")
        
        # Only process MP4 files
        if dest_path.suffix.lower() != '.mp4':
            logger.debug(f"   Skipping non-MP4 file: {dest_path.name}")
            return
        
        logger.info(f"✅ MP4 file moved: {dest_path.name}")
        
        # Check if file matches pattern (YYYYMMDD_TIME_*.mp4)
        pattern_match = self.pattern.match(dest_path.name)
        logger.info(f"   Pattern check: {pattern_match}")
        if not pattern_match:
            logger.warning(f"⚠️ File doesn't match pattern: {dest_path.name}")
            return
        
        # Only process if file was moved INTO the watched folder or any subfolder (not out of it)
        # Check if the destination is within the input folder (supports nested folders)
        try:
            dest_resolved = dest_path.resolve()
            input_resolved = self.input_folder.resolve()
            is_inside = str(dest_resolved).startswith(str(input_resolved) + '/')
            logger.info(f"   File moved inside watched folder: {is_inside}")
            if not is_inside:
                logger.debug(f"   File moved outside watched folder, skipping")
                return  # File moved outside watched folder
        except Exception as e:
            logger.warning(f"   Error checking path: {e}")
            # Fallback to samefile check for direct children
            try:
                is_same = dest_path.parent.samefile(self.input_folder)
                logger.info(f"   Fallback check (samefile): {is_same}")
                if not is_same:
                    return
            except Exception as e2:
                logger.error(f"   Fallback check failed: {e2}")
                return
        
        # Check if already processed (prevent duplicates)
        file_path_str = str(dest_path)
        if file_path_str in self.processed_files:
            logger.warning(f"⚠️ File already processed, skipping: {dest_path.name}")
            return
        
        logger.info(f"✅ New file moved in, not yet processed")
        
        # Wait a moment for file to be fully written
        logger.info(f"   Waiting 2 seconds for file to stabilize...")
        time.sleep(2)
        
        # Verify file exists
        if not dest_path.exists():
            logger.error(f"❌ File doesn't exist: {dest_path.name}")
            return
        
        logger.info(f"✅ File exists after wait")
        
        # Check file size to ensure it's not empty or still being written
        try:
            initial_size = dest_path.stat().st_size
            logger.info(f"   Initial file size: {initial_size} bytes")
            time.sleep(1)
            current_size = dest_path.stat().st_size
            if current_size != initial_size:
                logger.warning(f"⚠️ File still being written, waiting 3 more seconds...")
                time.sleep(3)
        except Exception as e:
            logger.error(f"❌ Error checking file size: {e}")
            return
        
        # Process the NEW file
        logger.info(f"🚀 Starting watermark removal process for moved file: {dest_path.name}")
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
    observer.schedule(event_handler, str(input_folder), recursive=True)  # Recursive to catch nested folders like "Big Downloads/Big Downloads"
    
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
        
        # On startup, ONLY process the NEWEST file that hasn't been processed yet
        # Simple: find newest unprocessed file and process it
        logger.info("Checking for newest unprocessed file...")
        existing_files = list(input_folder.rglob("*.mp4"))  # Recursive glob to find files in nested folders
        matching_files = [f for f in existing_files if event_handler.pattern.match(f.name)]
        
        # Filter to only unprocessed files (not in tracking)
        unprocessed_files = []
        for mp4_file in matching_files:
            file_path_str = str(mp4_file)
            # Skip if already processed (tracked)
            if file_path_str in event_handler.processed_files:
                logger.debug(f"Skipping already processed: {mp4_file.name}")
                continue
            unprocessed_files.append(mp4_file)
        
        if unprocessed_files:
            # Sort by filename timestamp (download time) - newest first
            def get_timestamp(file_path):
                match = event_handler.pattern.match(file_path.name)
                if match:
                    date_str = match.group(1)  # YYYYMMDD
                    time_str = match.group(2)  # HHMM
                    return int(date_str + time_str)  # YYYYMMDDHHMM
                return 0
            
            unprocessed_files.sort(key=get_timestamp, reverse=True)  # Newest download first
            
            # ONLY process the NEWEST unprocessed file
            newest_file = unprocessed_files[0]
            logger.info(f"Found {len(unprocessed_files)} unprocessed file(s), processing NEWEST: {newest_file.name}")
            event_handler._process_video(newest_file)
            
            if len(unprocessed_files) > 1:
                logger.info(f"Skipping {len(unprocessed_files) - 1} older unprocessed file(s) - only processing newest")
        else:
            logger.info("No unprocessed files found - all existing files already processed")
        
        logger.info("Watcher started - monitoring for NEW files")
        
        # Periodically check for files that might have been missed by file system events
        # Also verify that processed files actually have output files (in case processing failed)
        def periodic_check():
            while True:
                time.sleep(30)  # Check every 30 seconds
                try:
                    logger.debug("🔄 Periodic check for missed/unprocessed files...")
                    existing_files = list(input_folder.rglob("*.mp4"))
                    matching_files = [f for f in existing_files if event_handler.pattern.match(f.name)]
                    
                    new_unprocessed = []
                    for mp4_file in matching_files:
                        file_path_str = str(mp4_file)
                        output_filename = event_handler._generate_output_filename(mp4_file.name)
                        output_path = output_folder / output_filename
                        
                        # If file is marked as processed but output doesn't exist, it wasn't actually processed
                        if file_path_str in event_handler.processed_files:
                            if not output_path.exists():
                                logger.warning(f"⚠️ File marked as processed but output missing: {mp4_file.name}")
                                logger.info(f"   Removing from processed list and will reprocess")
                                event_handler.processed_files.discard(file_path_str)
                                # Also remove from tracking file
                                try:
                                    if event_handler.tracking_file.exists():
                                        lines = []
                                        with open(event_handler.tracking_file, 'r') as f:
                                            for line in f:
                                                if line.strip() != file_path_str:
                                                    lines.append(line)
                                        with open(event_handler.tracking_file, 'w') as f:
                                            f.writelines(lines)
                                except Exception as e:
                                    logger.error(f"Error updating tracking file: {e}")
                                new_unprocessed.append(mp4_file)
                        elif file_path_str not in event_handler.processed_files:
                            # File not in processed list - check if output exists
                            if not output_path.exists():
                                logger.info(f"🔍 Found unprocessed file: {mp4_file.name}")
                                new_unprocessed.append(mp4_file)
                    
                    if new_unprocessed:
                        # Sort by timestamp, newest first
                        def get_timestamp(file_path):
                            match = event_handler.pattern.match(file_path.name)
                            if match:
                                date_str = match.group(1)
                                time_str = match.group(2)
                                return int(date_str + time_str)
                            return 0
                        new_unprocessed.sort(key=get_timestamp, reverse=True)
                        newest = new_unprocessed[0]
                        logger.info(f"🚀 Processing missed/unprocessed file: {newest.name}")
                        event_handler._process_video(newest)
                except Exception as e:
                    logger.error(f"Error in periodic check: {e}")
        
        check_thread = threading.Thread(target=periodic_check, daemon=True)
        check_thread.start()
        logger.info("✅ Periodic check thread started (every 30 seconds)")
        
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

