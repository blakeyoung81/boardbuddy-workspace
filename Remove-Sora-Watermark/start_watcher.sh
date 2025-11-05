#!/bin/bash
# Simple script to start the watermark removal watcher
# Can be used with Keyboard Maestro or run directly
# Automatically installs missing dependencies

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Kill ALL existing watchers before starting a new one
echo "Checking for existing watchers..."
EXISTING_WATCHERS=$(pgrep -f "python.*watcher.py" | grep -v "$$")
if [ ! -z "$EXISTING_WATCHERS" ]; then
    echo "Found existing watcher(s), killing them..."
    for PID in $EXISTING_WATCHERS; do
        echo "  Killing watcher PID: $PID"
        kill -9 $PID 2>/dev/null || true
    done
    # Wait a moment for processes to terminate
    sleep 1
    # Verify they're gone
    REMAINING=$(pgrep -f "python.*watcher.py" | grep -v "$$")
    if [ ! -z "$REMAINING" ]; then
        echo "⚠️  Warning: Some watchers may still be running. Attempting force kill..."
        for PID in $REMAINING; do
            kill -9 $PID 2>/dev/null || true
        done
        sleep 1
    fi
    echo "✅ All existing watchers terminated"
fi

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate

# Check and install missing dependencies
echo "Checking dependencies..."

# Check if watchdog is installed
python -c "import watchdog" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Installing watchdog..."
    pip install watchdog > /dev/null 2>&1
fi

# Check if loguru is installed
python -c "import loguru" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Installing loguru..."
    pip install loguru > /dev/null 2>&1
fi

# Check if essential sorawm dependencies are installed
python -c "import numpy, cv2, torch" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Installing core dependencies (numpy, opencv-python, torch)..."
    pip install numpy opencv-python torch torchvision > /dev/null 2>&1
fi

python -c "import ultralytics" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Installing ultralytics..."
    pip install ultralytics > /dev/null 2>&1
fi

python -c "import diffusers" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Installing additional dependencies..."
    pip install diffusers einops omegaconf ruptures scikit-learn transformers ffmpeg-python tqdm pydantic pandas > /dev/null 2>&1
fi

# Check if sorawm can be imported (it's a local package, should work if we're in the right directory)
python -c "import sorawm" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Warning: sorawm package not found. Make sure you're running from the correct directory."
fi

# Set up log file for background execution
LOG_FILE="$SCRIPT_DIR/watcher_startup.log"
OUTPUT_FOLDER="/Users/blakeyoung/Library/Mobile Documents/com~apple~CloudDocs/Streaming/Removed Watermark"

# Determine if running in background (check if output is redirected or if running from terminal)
if [ -t 0 ] && [ -t 1 ] && [ -t 2 ]; then
    # Running in foreground (interactive terminal)
    echo "Starting watcher in foreground mode..."
    echo "Press Ctrl+C to stop"
    python watcher.py
else
    # Running in background or from Keyboard Maestro
    echo "Starting watcher in background mode..." >> "$LOG_FILE" 2>&1
    
    # Send startup notification
    osascript -e "display notification \"Watcher is starting...\" with title \"Watermark Remover\" subtitle \"Monitoring Big Downloads folder\"" 2>/dev/null || true
    
    # Start watcher in background with logging
    nohup python watcher.py >> "$OUTPUT_FOLDER/watcher_stdout.log" 2>> "$OUTPUT_FOLDER/watcher_stderr.log" &
    WATCHER_PID=$!
    
    # Wait a moment to see if it started successfully
    sleep 2
    
    # Check if process is still running
    if ps -p $WATCHER_PID > /dev/null 2>&1; then
        echo "Watcher started successfully with PID: $WATCHER_PID" >> "$LOG_FILE" 2>&1
        echo "Watcher started with PID: $WATCHER_PID"
        echo "Logs: $OUTPUT_FOLDER/watcher.log"
        echo "To stop: kill $WATCHER_PID"
    else
        echo "ERROR: Watcher failed to start. Check logs: $OUTPUT_FOLDER/watcher_stderr.log" >> "$LOG_FILE" 2>&1
        echo "ERROR: Watcher failed to start. Check: $OUTPUT_FOLDER/watcher_stderr.log"
        exit 1
    fi
fi

