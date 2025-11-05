# Quick Start Guide

## One-Time Setup

1. **Install dependencies:**
   ```bash
   cd "/Users/blakeyoung/Library/Mobile Documents/com~apple~CloudDocs/Coding/Remove-Sora-Watermark"
   pip3 install watchdog loguru
   pip3 install -e .
   ```

2. **Verify setup:**
   ```bash
   python3 check_setup.py
   ```

## Starting the Watcher

### For Keyboard Maestro

Use this command:
```bash
cd "/Users/blakeyoung/Library/Mobile Documents/com~apple~CloudDocs/Coding/Remove-Sora-Watermark" && python3 watcher.py
```

Or use the shell script:
```bash
"/Users/blakeyoung/Library/Mobile Documents/com~apple~CloudDocs/Coding/Remove-Sora-Watermark/start_watcher.sh"
```

### To Run in Background

```bash
nohup python3 watcher.py > /dev/null 2>&1 &
```

## How It Works

1. Watches: `Big Downloads` folder
2. Pattern: Files like `20251104_1209_*.mp4`
3. Output: `Streaming/Removed Watermark/wr_20251104_1209.mp4`
4. Logs: Saved to `Streaming/Removed Watermark/watcher.log`

## Test It

Test with the provided file:
```bash
python3 test_file.py
```

## Stop the Watcher

Press `Ctrl+C` or find and kill the process:
```bash
ps aux | grep watcher.py
kill <PID>
```




