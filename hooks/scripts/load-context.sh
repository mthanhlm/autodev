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
  # Extract scope name from "# Scope: name" header
  SCOPE_NAME=$(grep -m1 '^# Scope:' "$SCOPE_FILE" | sed 's/^# Scope: //' | tr -d '\r')
  if [ -n "$SCOPE_NAME" ]; then
    echo "export AUTODEV_SCOPE=\"$SCOPE_NAME\"" >> "${CLAUDE_ENV_FILE:-/dev/null}"
  fi

  # Extract must-haves if present
  MUST_HAVES=$(awk '/^## Must-haves$/,/^## / {if (!/^## / && !/^## Must-haves$/) print}' "$SCOPE_FILE" | head -5 | tr '\n' ' ' | sed 's/"/\\"/g')
  if [ -n "$MUST_HAVES" ]; then
    echo "export AUTODEV_MUST_HAVES=\"$MUST_HAVES\"" >> "${CLAUDE_ENV_FILE:-/dev/null}"
  fi
fi

# Load current phase from STATE.md
STATE_FILE="$AUTODEV_DIR/STATE.md"
if [ -f "$STATE_FILE" ]; then
  CURRENT_PHASE=$(grep -m1 '\*\*Current Phase:\*\*' "$STATE_FILE" | sed 's/\*\*Current Phase:\*\* //' | tr -d '\r')
  if [ -n "$CURRENT_PHASE" ]; then
    echo "export AUTODEV_CURRENT_PHASE=\"$CURRENT_PHASE\"" >> "${CLAUDE_ENV_FILE:-/dev/null}"
  fi

  STATUS=$(grep -m1 '\*\*Status:\*\*' "$STATE_FILE" | sed 's/\*\*Status:\*\* //' | tr -d '\r')
  if [ -n "$STATUS" ]; then
    echo "export AUTODEV_STATUS=\"$STATUS\"" >> "${CLAUDE_ENV_FILE:-/dev/null}"
  fi
fi

# Load phase progress from PHASES.md
PHASES_FILE="$AUTODEV_DIR/PHASES.md"
if [ -f "$PHASES_FILE" ]; then
  TOTAL_PHASES=$(grep -c '^## Phase ' "$PHASES_FILE" || echo "0")
  COMPLETED_PHASES=$(grep -c '^\- \[x\] ' "$PHASES_FILE" || echo "0")
  echo "export AUTODEV_TOTAL_PHASES=\"$TOTAL_PHASES\"" >> "${CLAUDE_ENV_FILE:-/dev/null}"
  echo "export AUTODEV_COMPLETED_PHASES=\"$COMPLETED_PHASES\"" >> "${CLAUDE_ENV_FILE:-/dev/null}"
fi

exit 0
