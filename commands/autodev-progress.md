---
name: autodev:progress
description: Show current project state, phase progress, and next steps
allowed-tools:
  - Read
  - Bash
  - Glob
---

<objective>
Show where the project currently stands: scope status, phase progress, and recommended next action.
</objective>

<process>

<step name="check_project">
Check if `.autodev/` directory exists:
```bash
[ -d ".autodev" ] && echo "exists" || echo "missing"
```

If missing:
```
No autodev project found. Run `/autodev-scope` to get started.
```
Exit.
</step>

<step name="read_state">
Read:
- `.autodev/SCOPE.md` — scope definition
- `.autodev/PHASES.md` — phase status
- `.autodev/STATE.md` — current state
</step>

<step name="display_progress">
```markdown
## Autodev Progress

**Scope:** {scope name}
**Status:** {status}

### Phases

| Phase | Status | Plans | Summary |
|-------|--------|-------|---------|
| 1 | [x] planned | 2/2 | ✓ |
| 2 | [ ] executing | 0/2 | - |
| 3 | [ ] planned | - | - |

### Current State
- **Current Phase:** {N}
- **Status:** {active/executing/verifying}
- **Last Activity:** {date}
```

If `.autodev/.continue-here.md` exists:
```
⚠ Unresolved checkpoint found
  Run `/autodev-next` to resume
```
</step>

<step name="suggest_next">
Based on state, suggest next command:

- No phases → `/autodev-scope`
- Phase exists, no plans → `/autodev-plan {N}`
- Plans exist, no execution → `/autodev-execute {N}`
- Phase executing → `/autodev-execute {N}` (continue)
- Phase complete → `/autodev-next`
</step>

</process>

<success_criteria>
- [ ] Project state correctly displayed
- [ ] Phase progress shown
- [ ] Next action suggested
</success_criteria>
