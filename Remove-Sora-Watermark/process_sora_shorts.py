#!/usr/bin/env python3
"""
Manual script to find and process all Sora shorts in YYYYMMDD_TIME format.
This is separate from the automatic watcher - run this when you want to batch process existing files.
"""

import re
import sys
from pathlib import Path
from typing import List

# Python 3.13 compatibility shim for imghdr
if sys.version_info >= (3, 13):
    try:
        import imghdr_compat
    except ImportError:
        pass

from loguru import logger
from tqdm import tqdm

from sorawm.core import SoraWM


# Pattern: YYYYMMDD_TIME_*.mp4 (8 digits, underscore, time, underscore, anything, .mp4)
PATTERN = re.compile(r'^(\d{8})_(\d+)_')


def extract_filename_prefix(filename: str) -> str | None:
    """
    Extract the prefix up to the second underscore for renaming.
    
    Example: '20251104_1209_01k97zny35f599pp7dpv6tk1wc.mp4' -> '20251104_1209'
    
    Args:
        filename: The input filename
        
    Returns:
        Prefix string up to second underscore, or None if pattern doesn't match
    """
    match = PATTERN.match(filename)
    if match:
        year_month_day = match.group(1)
        time_part = match.group(2)
        return f"{year_month_day}_{time_part}"
    return None


def generate_output_filename(input_filename: str) -> str:
    """
    Generate output filename with wr_ prefix.
    
    Args:
        input_filename: Original filename
        
    Returns:
        New filename: wr_YYYYMMDD_TIME.mp4
    """
    prefix = extract_filename_prefix(input_filename)
    if prefix:
        return f"wr_{prefix}.mp4"
    # Fallback: add wr_ prefix to original name
    return f"wr_{input_filename}"


def find_sora_shorts(search_folder: Path) -> List[Path]:
    """
    Find all MP4 files matching the YYYYMMDD_TIME pattern.
    
    Args:
        search_folder: Folder to search recursively
        
    Returns:
        List of matching video file paths
    """
    matching_files = []
    
    logger.info(f"Searching for Sora shorts in: {search_folder}")
    
    # Search recursively for all MP4 files
    for mp4_file in search_folder.rglob("*.mp4"):
        if PATTERN.match(mp4_file.name):
            matching_files.append(mp4_file)
    
    logger.info(f"Found {len(matching_files)} matching Sora short(s)")
    return matching_files


def filter_unprocessed(files: List[Path], output_folder: Path) -> List[Path]:
    """
    Filter out files that have already been processed.
    
    Args:
        files: List of input video files
        output_folder: Folder where processed videos are saved
        
    Returns:
        List of files that need processing
    """
    unprocessed = []
    
    for video_file in files:
        output_filename = generate_output_filename(video_file.name)
        output_path = output_folder / output_filename
        
        if not output_path.exists():
            unprocessed.append(video_file)
        else:
            logger.debug(f"Skipping already processed: {video_file.name}")
    
    return unprocessed


def process_videos(
    input_files: List[Path],
    output_folder: Path,
    sora_wm: SoraWM
) -> tuple[int, int]:
    """
    Process all video files.
    
    Args:
        input_files: List of video files to process
        output_folder: Folder to save processed videos
        sora_wm: SoraWM instance
        
    Returns:
        Tuple of (successful_count, failed_count)
    """
    output_folder.mkdir(parents=True, exist_ok=True)
    
    successful = 0
    failed = 0
    
    if not input_files:
        logger.info("No files to process!")
        return 0, 0
    
    logger.info(f"Processing {len(input_files)} video(s)...")
    
    for video_file in tqdm(input_files, desc="Processing videos"):
        try:
            output_filename = generate_output_filename(video_file.name)
            output_path = output_folder / output_filename
            
            logger.info(f"Processing: {video_file.name} -> {output_filename}")
            
            # Process the video
            sora_wm.run(video_file, output_path)
            
            logger.success(f"✓ Successfully processed: {output_filename}")
            successful += 1
            
        except Exception as e:
            logger.error(f"✗ Error processing {video_file.name}: {e}")
            failed += 1
    
    return successful, failed


def main():
    """Main function."""
    # Configuration - matches watcher.py paths
    input_folder = Path("/Users/blakeyoung/Library/Mobile Documents/com~apple~CloudDocs/Big Downloads")
    output_folder = Path("/Users/blakeyoung/Library/Mobile Documents/com~apple~CloudDocs/Streaming/Removed Watermark")
    
    # Allow override via command line arguments
    if len(sys.argv) > 1:
        input_folder = Path(sys.argv[1])
    if len(sys.argv) > 2:
        output_folder = Path(sys.argv[2])
    
    # Validate input folder
    if not input_folder.exists():
        logger.error(f"Input folder does not exist: {input_folder}")
        logger.info("Usage: python process_sora_shorts.py [input_folder] [output_folder]")
        return 1
    
    # Set up logging
    logger.add(
        output_folder / "process_sora_shorts.log",
        rotation="10 MB",
        retention="7 days",
        level="INFO"
    )
    
    logger.info("=" * 60)
    logger.info("Sora Shorts Batch Processor")
    logger.info("=" * 60)
    logger.info(f"Input folder: {input_folder}")
    logger.info(f"Output folder: {output_folder}")
    
    # Initialize SoraWM
    logger.info("Initializing watermark remover...")
    try:
        sora_wm = SoraWM()
        logger.info("✓ Watermark remover initialized")
    except Exception as e:
        logger.error(f"Failed to initialize watermark remover: {e}")
        return 1
    
    # Find all matching files
    all_files = find_sora_shorts(input_folder)
    
    if not all_files:
        logger.warning("No matching Sora shorts found!")
        return 0
    
    # Filter out already processed files
    unprocessed_files = filter_unprocessed(all_files, output_folder)
    
    already_processed_count = len(all_files) - len(unprocessed_files)
    if already_processed_count > 0:
        logger.info(f"Found {already_processed_count} already processed file(s)")
    
    if not unprocessed_files:
        logger.info("All files have already been processed!")
        return 0
    
    logger.info(f"Found {len(unprocessed_files)} file(s) to process")
    
    # Show list of files to be processed
    logger.info("\nFiles to process:")
    for i, video_file in enumerate(unprocessed_files, 1):
        output_filename = generate_output_filename(video_file.name)
        logger.info(f"  {i}. {video_file.name} -> {output_filename}")
    
    # Ask for confirmation (optional - you can remove this if you want it to run automatically)
    try:
        response = input(f"\nProcess {len(unprocessed_files)} video(s)? [y/N]: ").strip().lower()
        if response not in ['y', 'yes']:
            logger.info("Cancelled by user")
            return 0
    except KeyboardInterrupt:
        logger.info("\nCancelled by user")
        return 0
    
    # Process videos
    logger.info("\nStarting processing...")
    successful, failed = process_videos(unprocessed_files, output_folder, sora_wm)
    
    # Summary
    logger.info("\n" + "=" * 60)
    logger.info("Processing Complete!")
    logger.info(f"✓ Successful: {successful}")
    if failed > 0:
        logger.warning(f"✗ Failed: {failed}")
    logger.info("=" * 60)
    
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())

