#!/bin/bash
set -euo pipefail

STATE_FILE="$CLAUDE_PROJECT_DIR/STATE.md"

# Warn if SCREEPS_TOKEN is missing
if [ -z "${SCREEPS_TOKEN:-}" ]; then
  echo "WARNING: SCREEPS_TOKEN is not set. Screeps MCP tools will fail." >&2
fi

# Surface current state in the session context
if [ -f "$STATE_FILE" ]; then
  echo "Current agent state (STATE.md):"
  cat "$STATE_FILE"
else
  echo "STATE.md not found. This may be the first run."
fi
