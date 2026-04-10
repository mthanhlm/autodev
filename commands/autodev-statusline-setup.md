---
name: autodev-statusline-setup
description: Configure the autodev statusline in Claude Code settings
allowed-tools:
  - Read
  - Write
  - Bash
---

<objective>
Register the autodev statusline hook in Claude Code settings.json so it displays epic, story, and progress information in the status bar. Always uses the latest version from the global plugin installation.
</objective>

<process>

<step name="detect_global_plugin_path"
The global plugin is always at `~/.claude/plugins/cache/autodev/autodev/<version>/`. Find the latest version directory.

```bash
ls -d ~/.claude/plugins/cache/autodev/autodev/*/ 2>/dev/null | sort -V | tail -1
```
</step>

<step name="build_statusline_command"
Use the global plugin path (latest version):
```bash
AUTODEV_PLUGIN_DIR="$(ls -d ~/.claude/plugins/cache/autodev/autodev/*/ 2>/dev/null | sort -V | tail -1 | tr -d '/')"
STATUSLINE_PATH="$AUTODEV_PLUGIN_DIR/hooks/autodev-statusline.js"
STATUSLINE_CMD="node $(eval echo $STATUSLINE_PATH)"
```
</step>

<step name="read_settings"
Read the current Claude Code settings:
```bash
cat ~/.claude/settings.json
```
</step>

<step name="update_settings"
If statusLine already exists in settings.json:
- Replace the existing `command` value with the new statusline path from the global plugin

If statusLine does not exist:
- Add it to the settings.json

Use Read → Edit to preserve all other settings.
</step>

<step name="verify"
Find latest version and verify syntax:
```bash
AUTODEV_PLUGIN_DIR="$(ls -d ~/.claude/plugins/cache/autodev/autodev/*/ 2>/dev/null | sort -V | tail -1 | tr -d '/')"
node -c "$AUTODEV_PLUGIN_DIR/hooks/autodev-statusline.js" && echo "✓ Syntax OK"
```
</step>

<step name="done"
Report:
```
✅ Statusline configured

The statusline shows context window usage and current directory.
Restart Claude Code to see changes.
```
</step>

</process>

<success_criteria>
- [ ] Uses global plugin path (~/.claude/plugins/cache/autodev/autodev/)
- [ ] Always updates to latest version (overwrites existing)
- [ ] statusLine entry correctly added to settings.json
- [ ] Syntax verification passes
</success_criteria>
