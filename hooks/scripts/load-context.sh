#!/bin/bash
# Autodev SessionStart Hook
# Loads .autodev context files for the statusline and environment

set -euo pipefail

# Use CLAUDE_PROJECT_DIR (set by Claude Code) or fall back to current directory
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
AUTODEV_DIR="$PROJECT_DIR/.autodev"

# Skip if no .autodev directory exists
if [ ! -d "$AUTODEV_DIR" ]; then
  exit 0
fi

# Load scope info
SCOPE_FILE="$AUTODEV_DIR/SCOPE.md"
if [ -f "$SCOPE_FILE" ]; then
  SCOPE_NAME=$(grep -m1 '^# Scope:' "$SCOPE_FILE" | sed 's/^# Scope: //' | tr -d '\r')
  if [ -n "$SCOPE_NAME" ]; then
    echo "export AUTODEV_SCOPE=\"$SCOPE_NAME\"" >> "${CLAUDE_ENV_FILE:-/dev/null}"
  fi
fi

# Load current phase from STATE.md
STATE_FILE="$AUTODEV_DIR/STATE.md"
if [ -f "$STATE_FILE" ]; then
  CURRENT_PHASE=$(grep -m1 '^\*\*Current Phase:\*\*' "$STATE_FILE" | sed 's/\*\*Current Phase:\*\* //' | tr -d '\r')
  if [ -n "$CURRENT_PHASE" ]; then
    echo "export AUTODEV_CURRENT_PHASE=\"$CURRENT_PHASE\"" >> "${CLAUDE_ENV_FILE:-/dev/null}"
  fi

  STATUS=$(grep -m1 '^\*\*Status:\*\*' "$STATE_FILE" | sed 's/\*\*Status:\*\* //' | tr -d '\r')
  if [ -n "$STATUS" ]; then
    echo "export AUTODEV_STATUS=\"$STATUS\"" >> "${CLAUDE_ENV_FILE:-/dev/null}"
  fi
fi

# Load phase progress from PHASES.md
PHASES_FILE="$AUTODEV_DIR/PHASES.md"
if [ -f "$PHASES_FILE" ]; then
  TOTAL_PHASES=$(grep -c '^## Phase ' "$PHASES_FILE" 2>/dev/null || echo "0")
  COMPLETED_PHASES=$(grep -c 'Status: complete' "$PHASES_FILE" 2>/dev/null || echo "0")

  if [ -n "$CURRENT_PHASE" ]; then
    # Extract phase name - handle spaces in phase names
    PHASE_NAME=$(grep "^## Phase $CURRENT_PHASE:" "$PHASES_FILE" | sed 's/^## Phase [0-9]*: //' | tr -d '\r')
    if [ -n "$PHASE_NAME" ]; then
      echo "export AUTODEV_PHASE_NAME=\"$PHASE_NAME\"" >> "${CLAUDE_ENV_FILE:-/dev/null}"
    fi
  fi

  echo "export AUTODEV_TOTAL_PHASES=\"$TOTAL_PHASES\"" >> "${CLAUDE_ENV_FILE:-/dev/null}"
  echo "export AUTODEV_COMPLETED_PHASES=\"$COMPLETED_PHASES\"" >> "${CLAUDE_ENV_FILE:-/dev/null}"
fi

exit 0
