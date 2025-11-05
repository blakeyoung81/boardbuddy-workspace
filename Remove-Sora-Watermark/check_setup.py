#!/usr/bin/env python3
"""Check if setup is complete and dependencies are installed."""

import sys
from pathlib import Path

def check_python_version():
    """Check Python version."""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 12):
        print(f"❌ Python 3.12+ required, found {version.major}.{version.minor}")
        return False
    print(f"✓ Python {version.major}.{version.minor}.{version.micro}")
    return True

def check_import(module_name, package_name=None):
    """Check if a module can be imported."""
    try:
        __import__(module_name)
        print(f"✓ {package_name or module_name} installed")
        return True
    except ImportError:
        print(f"❌ {package_name or module_name} not installed")
        return False

def check_ffmpeg():
    """Check if ffmpeg is available."""
    import subprocess
    try:
        result = subprocess.run(['ffmpeg', '-version'], 
                               capture_output=True, 
                               timeout=5)
        if result.returncode == 0:
            print("✓ FFmpeg installed")
            return True
        else:
            print("❌ FFmpeg not found")
            return False
    except (FileNotFoundError, subprocess.TimeoutExpired):
        print("❌ FFmpeg not found")
        return False

def check_folders():
    """Check if required folders exist."""
    input_folder = Path("/Users/blakeyoung/Library/Mobile Documents/com~apple~CloudDocs/Big Downloads")
    output_folder = Path("/Users/blakeyoung/Library/Mobile Documents/com~apple~CloudDocs/Streaming/Removed Watermark")
    
    if input_folder.exists():
        print(f"✓ Input folder exists: {input_folder}")
    else:
        print(f"⚠ Input folder does not exist: {input_folder}")
        print("  (Will be created when watcher starts)")
    
    if output_folder.exists():
        print(f"✓ Output folder exists: {output_folder}")
    else:
        print(f"⚠ Output folder does not exist: {output_folder}")
        print("  (Will be created automatically)")
    
    return True

def main():
    """Run all checks."""
    print("Checking setup...")
    print("-" * 60)
    
    checks = [
        check_python_version(),
        check_import("watchdog", "watchdog"),
        check_import("loguru", "loguru"),
        check_import("sorawm", "sorawm (local package)"),
        check_ffmpeg(),
        check_folders(),
    ]
    
    print("-" * 60)
    if all(checks):
        print("✓ All checks passed! Ready to run watcher.")
        return 0
    else:
        print("❌ Some checks failed. Please install missing dependencies.")
        print("\nTo install dependencies:")
        print("  pip install watchdog loguru")
        print("  pip install -e .")
        return 1

if __name__ == "__main__":
    sys.exit(main())




