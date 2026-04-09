#!/usr/bin/env node
// Autodev Statusline
// Shows: model | scope:phase | progress | context usage

const fs = require('fs');
const path = require('path');
const os = require('os');

let input = '';
const stdinTimeout = setTimeout(() => process.exit(0), 3000);
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  clearTimeout(stdinTimeout);
  try {
    const data = JSON.parse(input);
    const model = data.model?.display_name || 'Claude';
    const dir = data.workspace?.current_dir || process.cwd();
    const remaining = data.context_window?.remaining_percentage;

    // Context window display
    const AUTO_COMPACT_BUFFER_PCT = 16.5;
    let ctx = '';
    if (remaining != null) {
      const usableRemaining = Math.max(0, ((remaining - AUTO_COMPACT_BUFFER_PCT) / (100 - AUTO_COMPACT_BUFFER_PCT)) * 100);
      const used = Math.max(0, Math.min(100, Math.round(100 - usableRemaining)));

      const filled = Math.floor(used / 10);
      const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);

      if (used < 50) {
        ctx = ` \x1b[32m${bar} ${used}%\x1b[0m`;
      } else if (used < 65) {
        ctx = ` \x1b[33m${bar} ${used}%\x1b[0m`;
      } else if (used < 80) {
        ctx = ` \x1b[38;5;208m${bar} ${used}%\x1b[0m`;
      } else {
        ctx = ` \x1b[5;31m💀 ${bar} ${used}%\x1b[0m`;
      }
    }

    // Autodev progress
    let scopeInfo = '';
    const scopeDir = path.join(dir, '.autodev');
    const scopeFile = path.join(scopeDir, 'SCOPE.md');
    const phasesFile = path.join(scopeDir, 'PHASES.md');
    const stateFile = path.join(scopeDir, 'STATE.md');

    if (fs.existsSync(scopeFile) && fs.existsSync(phasesFile) && fs.existsSync(stateFile)) {
      try {
        // Parse scope name from SCOPE.md
        let scopeName = 'unknown';
        const scopeContent = fs.readFileSync(scopeFile, 'utf8');
        const scopeMatch = scopeContent.match(/^# Scope: (.+)$/m);
        if (scopeMatch) scopeName = scopeMatch[1].trim();

        // Parse current phase from STATE.md
        let currentPhase = '?';
        let phaseProgress = 0;
        const stateContent = fs.readFileSync(stateFile, 'utf8');
        const phaseMatch = stateContent.match(/\*\*Current Phase:\*\* (.+)/);
        if (phaseMatch) currentPhase = phaseMatch[1].trim();

        // Parse phases from PHASES.md and calculate progress
        const phasesContent = fs.readFileSync(phasesFile, 'utf8');
        const phaseLines = phasesContent.match(/^## Phase \d+: .+/gm) || [];
        const totalPhases = phaseLines.length;

        // Count completed phases
        let completedPhases = 0;
        const completedMatches = phasesContent.match(/^\- \[x\] /gm) || [];
        completedPhases = completedMatches.length;

        // Calculate overall progress
        if (totalPhases > 0) {
          phaseProgress = Math.round((completedPhases / totalPhases) * 100);
        }

        // Build progress bar
        const filled = Math.floor(phaseProgress / 10);
        const progressBar = '█'.repeat(filled) + '░'.repeat(10 - filled);

        // Format: scope | phase N | ████░░░░░░ 40%
        scopeInfo = `\x1b[1m${scopeName}\x1b[0m │ Phase ${currentPhase} │ \x1b[32m${progressBar} ${phaseProgress}%\x1b[0m`;
      } catch (e) {
        // Silently fail - don't break statusline
      }
    }

    // Output
    const dirname = path.basename(dir);
    if (scopeInfo) {
      process.stdout.write(`\x1b[2m${model}\x1b[0m │ ${scopeInfo} │ \x1b[2m${dirname}\x1b[0m${ctx}`);
    } else {
      process.stdout.write(`\x1b[2m${model}\x1b[0m │ \x1b[2m${dirname}\x1b[0m${ctx}`);
    }
  } catch (e) {
    // Silent fail
  }
});
