---
name: autodev:statusline-setup
description: Configure the autodev statusline in Claude Code settings
allowed-tools:
  - Read
  - Write
  - Bash
---

<objective>
Register the autodev statusline hook in Claude Code settings.json so it displays scope, phase, and progress information in the status bar.
</objective>

<process>

<step name="check_existing">
Read the current Claude Code settings to check if statusline is already configured:

```bash
cat ~/.claude/settings.json 2>/dev/null || echo "{}"
```

Parse the JSON to check if `statusLine` already exists with an autodev reference.
</step>

<step name="detect_plugin_path">
Find the autodev plugin path. Check common locations:
- `~/.claude/plugins/autodev@autodev/`
- `~/autodev/autodev/`
- The repo containing this command file

Use the first valid path found.
</step>

<step name="build_statusline_command">
Construct the statusline command:
- If using global plugin: `node ~/.claude/plugins/autodev@autodev/hooks/autodev-statusline.js`
- If using local repo: `node /path/to/repo/hooks/autodev-statusline.js`
</step>

<step name="update_settings">
Update `~/.claude/settings.json` to add or replace the statusLine entry:

```json
"statusLine": {
  "type": "command",
  "command": "node /path/to/autodev-statusline.js"
}
```

Use Read → Edit pattern to preserve existing settings.
</step>

<step name="verify">
Verify the statusline works by checking the hook script exists and is valid JavaScript:

```bash
node -c /path/to/autodev-statusline.js && echo "✓ Syntax OK"
```
</step>

</process>

<success_criteria>
- [ ] statusLine entry added to settings.json
- [ ] Points to correct autodev-statusline.js path
- [ ] Syntax verification passes
</success_criteria>
