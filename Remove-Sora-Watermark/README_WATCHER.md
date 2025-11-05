# Sora Watermark Remover - File Watcher

This script automatically monitors the "Big Downloads" folder for new MP4 files matching the pattern `YYYYMMDD_TIME_*.mp4` and removes watermarks from them.

## Setup

### 1. Install Dependencies

If you have `uv` installed:
```bash
uv sync
source .venv/bin/activate
```

Otherwise, install dependencies using pip:
```bash
pip install watchdog loguru
# And all other dependencies from pyproject.toml
```

Or install the package:
```bash
pip install -e .
```

### 2. Verify FFmpeg is Installed

The watermark remover requires FFmpeg:
```bash
ffmpeg -version
```

If not installed, install it:
- macOS: `brew install ffmpeg`
- Linux: `sudo apt install ffmpeg` or `sudo yum install ffmpeg`
- Windows: Download from https://ffmpeg.org/download.html

## Usage

### Starting the Watcher

**Option 1: Using the shell script**
```bash
./start_watcher.sh
```

**Option 2: Direct Python execution**
```bash
python watcher.py
```

**Option 3: For Keyboard Maestro**
Use this command in Keyboard Maestro:
```bash
cd "/Users/blakeyoung/Library/Mobile Documents/com~apple~CloudDocs/Coding/Remove-Sora-Watermark" && python watcher.py
```

Or with the shell script:
```bash
"/Users/blakeyoung/Library/Mobile Documents/com~apple~CloudDocs/Coding/Remove-Sora-Watermark/start_watcher.sh"
```

### Running in Background

To run as a background service:

**Using nohup:**
```bash
nohup python watcher.py > watcher_output.log 2>&1 &
```

**Using tmux/screen:**
```bash
tmux new-session -d -s watermark-watcher 'python watcher.py'
```

**Using launchd (macOS):**
Create a plist file at `~/Library/LaunchAgents/com.watermarkwatcher.plist`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.watermarkwatcher</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/python3</string>
        <string>/Users/blakeyoung/Library/Mobile Documents/com~apple~CloudDocs/Coding/Remove-Sora-Watermark/watcher.py</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/Users/blakeyoung/Library/Mobile Documents/com~apple~CloudDocs/Streaming/Removed Watermark/watcher.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/blakeyoung/Library/Mobile Documents/com~apple~CloudDocs/Streaming/Removed Watermark/watcher_error.log</string>
</dict>
</plist>
```

Then load it:
```bash
launchctl load ~/Library/LaunchAgents/com.watermarkwatcher.plist
```

## How It Works

1. **Monitors**: `/Users/blakeyoung/Library/Mobile Documents/com~apple~CloudDocs/Big Downloads/`
2. **Pattern**: Files matching `YYYYMMDD_TIME_*.mp4` (e.g., `20251104_1209_01k97zny35f599pp7dpv6tk1wc.mp4`)
3. **Output**: Processed videos saved to `/Users/blakeyoung/Library/Mobile Documents/com~apple~CloudDocs/Streaming/Removed Watermark/`
4. **Naming**: Output files are renamed to `wr_YYYYMMDD_TIME.mp4` (e.g., `wr_20251104_1209.mp4`)

## Features

- Automatic detection of new MP4 files matching the pattern
- Skips already processed files
- Logs all activity to `watcher.log` in the output folder
- Processes existing files on startup
- Handles file writing completion detection
- Error handling and retry capability

## Stopping the Watcher

Press `Ctrl+C` to stop the watcher gracefully.

If running in background, find the process:
```bash
ps aux | grep watcher.py
```

Then kill it:
```bash
kill <PID>
```

---

## Manual Batch Processing

If you want to manually process all existing Sora shorts at once (instead of waiting for the watcher), use the `process_sora_shorts.py` script:

### Usage

**Basic usage** (uses default folders):
```bash
python process_sora_shorts.py
```

**Custom input/output folders**:
```bash
python process_sora_shorts.py /path/to/input/folder /path/to/output/folder
```

### Features

- Finds all MP4 files matching `YYYYMMDD_TIME_*.mp4` pattern recursively
- Automatically skips files that have already been processed
- Shows progress bar and detailed logging
- Processes files in batch with confirmation prompt

### Example

```bash
cd "/Users/blakeyoung/Library/Mobile Documents/com~apple~CloudDocs/Coding/Remove-Sora-Watermark"
python process_sora_shorts.py
```

The script will:
1. Search for all matching Sora shorts in the Big Downloads folder
2. Check which ones haven't been processed yet
3. Show you a list of files to process
4. Ask for confirmation
5. Process all files with progress updates
6. Show a summary of successful/failed processing

**Note**: This script is separate from the automatic watcher - use it when you want to batch process existing files that may have been downloaded before the watcher was running.




