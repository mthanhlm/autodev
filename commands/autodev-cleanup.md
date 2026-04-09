---
name: autodev:cleanup
description: Clean up entire scope - removes all .autodev files and directories
argument-hint: "[--force]"
allowed-tools:
  - Read
  - Bash
  - Glob
  - AskUserQuestion
---

<objective>
Clean up and remove the entire .autodev directory and all scope files. Use when scope is complete and you want to clean up, or to start fresh.
</objective>

<process>

<step name="check_scope">
Check if `.autodev/` directory exists:
```bash
[ -d ".autodev" ] && echo "exists" || echo "missing"
```

If missing:
```
No autodev scope found. Nothing to clean up.
```
Exit.
</step>

<step name="confirm">
**If `--force` flag NOT present:**

Ask for confirmation:
```
⚠ This will delete the entire scope:

.delime .autodev/ directory
.delime .autodev/SCOPE.md
.delime .autodev/PHASES.md
.delime .autodev/STATE.md
.delime .autodev/phases/ (all phase files)

This cannot be undone. Are you sure?
1. Yes, delete everything
2. No, keep the scope
```

If user says "No", exit with:
```
Cleanup cancelled. Scope preserved.
```
</step>

<step name="remove_scope">
Remove the entire .autodev directory:

```bash
rm -rf .autodev
```

Verify removal:
```bash
[ -d ".autodev" ] && echo "failed" || echo "success"
```
</step>

<step name="done">
Report:
```
✅ Scope cleaned up

All .autodev files and directories removed.
Run /autodev-scope to start a new scope.
```
</step>

</process>

<guardrails>
- **Always confirm** unless `--force` flag is used
- Only removes `.autodev/` directory (scope files)
- Does NOT touch any source code or project files
- User should commit any changes before cleanup
</guardrails>

<success_criteria>
- [ ] .autodev directory removed
- [ ] All scope files deleted
- [ ] No source code touched
- [ ] Confirmation required (unless --force)
</success_criteria>
