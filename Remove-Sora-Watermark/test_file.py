#!/usr/bin/env python3
"""Test script to process a single file."""

import sys
import re
from pathlib import Path

# Python 3.13 compatibility shim for imghdr
if sys.version_info >= (3, 13):
    try:
        import imghdr_compat
    except ImportError:
        pass

from sorawm.core import SoraWM

def extract_prefix(filename: str) -> str | None:
    """Extract prefix up to second underscore."""
    pattern = re.compile(r'^(\d{8})_(\d+)_')
    match = pattern.match(filename)
    if match:
        year_month_day = match.group(1)
        time_part = match.group(2)
        return f"{year_month_day}_{time_part}"
    return None

def generate_output_filename(input_filename: str) -> str:
    """Generate output filename with wr_ prefix."""
    prefix = extract_prefix(input_filename)
    if prefix:
        return f"wr_{prefix}.mp4"
    return f"wr_{input_filename}"

if __name__ == "__main__":
    # Test file
    input_file = Path("/Users/blakeyoung/Library/Mobile Documents/com~apple~CloudDocs/Big Downloads/20251104_1209_01k97zny35f599pp7dpv6tk1wc.mp4")
    output_folder = Path("/Users/blakeyoung/Library/Mobile Documents/com~apple~CloudDocs/Streaming/Removed Watermark")
    
    if not input_file.exists():
        print(f"Error: Input file not found: {input_file}")
        exit(1)
    
    output_folder.mkdir(parents=True, exist_ok=True)
    
    # Generate output filename
    output_filename = generate_output_filename(input_file.name)
    output_path = output_folder / output_filename
    
    print(f"Input: {input_file}")
    print(f"Output: {output_path}")
    print(f"Processing...")
    
    try:
        sora_wm = SoraWM()
        sora_wm.run(input_file, output_path)
        print(f"Success! Output saved to: {output_path}")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

