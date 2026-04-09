#!/usr/bin/env node
// Autodev Statusline - PreToolUse hook
// Reads .autodev files directly for live updates on each tool use

const fs = require('fs');
const path = require('path');

function getStatuslineOutput() {
  const AUTO_COMPACT_BUFFER_PCT = 16.5;

  // Get project dir from env or cwd
  const dir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const scopeDir = path.join(dir, '.autodev');

  let scopeName = '';
  let currentPhase = '';
  let totalPhases = 0;
  let completedPhases = 0;
  let remaining = null;

  try {
    const scopeFile = path.join(scopeDir, 'SCOPE.md');
    const stateFile = path.join(scopeDir, 'STATE.md');
    const phasesFile = path.join(scopeDir, 'PHASES.md');

    // Parse scope name
    if (fs.existsSync(scopeFile)) {
      const content = fs.readFileSync(scopeFile, 'utf8');
      const match = content.match(/^# Scope: (.+)$/m);
      if (match) scopeName = match[1].trim();
    }

    // Parse current phase
    if (fs.existsSync(stateFile)) {
      const content = fs.readFileSync(stateFile, 'utf8');
      const match = content.match(/\*\*Current Phase:\*\* (.+)/);
      if (match) currentPhase = match[1].trim();
    }

    // Parse phases progress
    if (fs.existsSync(phasesFile)) {
      const content = fs.readFileSync(phasesFile, 'utf8');
      const phaseLines = content.match(/^## Phase \d+: .+/gm) || [];
      totalPhases = phaseLines.length;
      const completed = content.match(/^Status: complete$/gm) || [];
      completedPhases = completed.length;
    }

    // Get context remaining from env if available
    if (process.env.AUTODEV_CTX_REMAINING) {
      remaining = parseFloat(process.env.AUTODEV_CTX_REMAINING);
    }
  } catch (e) {
    return '';
  }

  if (!scopeName) {
    return '';
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

  // Calculate progress
  let phaseProgress = 0;
  if (totalPhases > 0) {
    phaseProgress = Math.round((completedPhases / totalPhases) * 100);
  }

  const filled = Math.floor(phaseProgress / 10);
  const progressBar = '█'.repeat(filled) + '░'.repeat(10 - filled);

  const scopeInfo = `\x1b[1m${scopeName}\x1b[0m │ Phase ${currentPhase}: \x1b[32m${progressBar} ${phaseProgress}%\x1b[0m`;

  return `\x1b[2m${scopeInfo}${ctx}`;
}

const output = getStatuslineOutput();
if (output) {
  process.stdout.write(output);
}
