---
name: autodev:statusline-setup
description: Configure the autodev statusline in Claude Code settings
allowed-tools:
  - Read
  - Write
  - Bash
---

<objective>
Register the autodev statusline hook in Claude Code settings.json so it displays scope, phase, and progress information in the status bar. Always uses the latest version from the global plugin installation.
</objective>

<process>

<step name="detect_global_plugin_path">
The global plugin is always at `~/.claude/plugins/autodev@autodev/`. This is the source of truth for the latest version.

Verify it exists:
```bash
[ -d ~/.claude/plugins/autodev@autodev ] && echo "global" || echo "not-found"
```
</step>

<step name="build_statusline_command">
Use the global plugin path:
```bash
STATUSLINE_PATH="~/.claude/plugins/autodev@autodev/hooks/autodev-statusline.js"
# Expand ~ to home directory
STATUSLINE_CMD="node $(eval echo $STATUSLINE_PATH)"
```
</step>

<step name="read_settings">
Read the current Claude Code settings:
```bash
cat ~/.claude/settings.json
```
</step>

<step name="update_settings">
If statusLine already exists in settings.json:
- Replace the existing `command` value with the new statusline path from the global plugin

If statusLine does not exist:
- Add it to the settings.json

Use Read → Edit to preserve all other settings.
</step>

<step name="verify">
Verify the statusline hook exists and has valid syntax:
```bash
node -c ~/.claude/plugins/autodev@autodev/hooks/autodev-statusline.js && echo "✓ Syntax OK"
```
</step>

</process>

<success_criteria>
- [ ] Uses global plugin path (~/.claude/plugins/autodev@autodev/)
- [ ] Always updates to latest version (overwrites existing)
- [ ] statusLine entry correctly added to settings.json
- [ ] Syntax verification passes
</success_criteria>
