#!/usr/bin/env python3
"""Test script to verify pattern matching and filename generation."""

import re

# Pattern: YYYYMMDD_TIME_*.mp4
pattern = re.compile(r'^(\d{8})_(\d+)_')

def extract_prefix(filename: str) -> str | None:
    """Extract prefix up to second underscore."""
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

# Test cases
test_files = [
    "20251104_1209_01k97zny35f599pp7dpv6tk1wc.mp4",
    "20251005_172.mp4",
    "20251015_0121.mp4",
    "20251028_1448.mp4",
    "20251101_1513_.mp4",
]

print("Testing pattern matching and filename generation:")
print("-" * 60)
for filename in test_files:
    prefix = extract_prefix(filename)
    output = generate_output_filename(filename)
    matches = "✓" if pattern.match(filename) else "✗"
    print(f"{matches} {filename}")
    if prefix:
        print(f"  → Prefix: {prefix}")
        print(f"  → Output: {output}")
    print()




