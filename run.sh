#!/bin/bash

export PATH=$HOME/.nvm/versions/node/v24.14.0/bin:$PATH

# Create necessary directories if they don't exist
mkdir -p sandbox/

NOW=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
SESSION_ID=$(cat .session_id 2>/dev/null || echo "")

echo "--- Starting Run: $NOW ---"

# If session ID exists, use it; otherwise, start a new session
if [ -n "$SESSION_ID" ]; then
  echo "--- Resuming previous session with ID: $SESSION_ID ---
  "

  gemini --approval-mode=yolo "Current date: $NOW. Resume." --resume $SESSION_ID
else
  echo "--- No previous session found. Starting a new session. ---
  "

  SYSTEM_INSTRUCTIONS=$(cat system_instructions.md)
  gemini --approval-mode=yolo "$SYSTEM_INSTRUCTIONS
  
  Current date: $NOW"

  echo "--- First run complete. Saving session ID for future runs. ---"
  gemini --list-sessions 2>/dev/null | grep -oP '\[[0-9a-f-]{36}\]' | tail -1 | tr -d '[]' > .session_id
fi

echo "--- Run Complete ---
"