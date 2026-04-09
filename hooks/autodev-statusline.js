#!/usr/bin/env node
// Autodev Statusline
// Shows: context window usage and current working directory

const fs = require('fs');
const path = require('path');

function getStatuslineOutput() {
  const AUTO_COMPACT_BUFFER_PCT = 16.5;

  // Get project dir from env or cwd
  const dir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const cwd = path.basename(dir) || dir;

  let remaining = null;

  // Get context remaining from env if available
  if (process.env.AUTODEV_CTX_REMAINING) {
    remaining = parseFloat(process.env.AUTODEV_CTX_REMAINING);
  }

  // Context window display
  let ctx = '';
  if (remaining != null && !isNaN(remaining)) {
    const usableRemaining = Math.max(0, ((remaining - AUTO_COMPACT_BUFFER_PCT) / (100 - AUTO_COMPACT_BUFFER_PCT)) * 100);
    const used = Math.max(0, Math.min(100, Math.round(100 - usableRemaining)));

    const filled = Math.floor(used / 10);
    const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);

    if (used < 50) {
      ctx = ` \x1b[2m│ ctx:\x1b[0m \x1b[32m${bar} ${used}%\x1b[0m`;
    } else if (used < 65) {
      ctx = ` \x1b[2m│ ctx:\x1b[0m \x1b[33m${bar} ${used}%\x1b[0m`;
    } else if (used < 80) {
      ctx = ` \x1b[2m│ ctx:\x1b[0m \x1b[38;5;208m${bar} ${used}%\x1b[0m`;
    } else {
      ctx = ` \x1b[2m│ ctx:\x1b[0m \x1b[5;31m💀 ${bar} ${used}%\x1b[0m`;
    }
  }

  return `\x1b[2m${cwd}\x1b[0m${ctx}`;
}

const output = getStatuslineOutput();
if (output) {
  process.stdout.write(output);
}
