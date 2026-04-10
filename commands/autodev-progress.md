---
name: autodev-progress
description: Show current project state, story progress, and next steps
allowed-tools:
  - Read
  - Bash
  - Glob
---

<objective>
Show where the project currently stands: epic status, story progress, and recommended next action.
</objective>

<process>

<step name="check_project"
Check if `.autodev/` directory exists:
```bash
[ -d ".autodev" ] && echo "exists" || echo "missing"
```

If missing:
```
No autodev project found. Run `/autodev-epic` to get started.
```
Exit.
</step>

<step name="read_state"
Read:
- `.autodev/EPIC.md` — epic definition
- `.autodev/STORIES.md` — story status
- `.autodev/STATE.md` — current state
</step>

<step name="display_progress"
```markdown
## Autodev Progress

**Epic:** {epic name}
**Status:** {status}

### Stories

| Story | Status | Tasks | Summary |
|-------|--------|-------|---------|
| 1 | [x] planned | 2/2 | ✓ |
| 2 | [ ] executing | 0/2 | - |
| 3 | [ ] planned | - | - |

### Current State
- **Current Story:** {N}
- **Status:** {active/executing/verifying}
- **Last Activity:** {date}
```

If `.autodev/.continue-here.md` exists:
```
⚠ Unresolved checkpoint found
  Run /autodev to resume
```
</step>

<step name="suggest_next"
Based on state, suggest next command:

- No stories → `/autodev-epic`
- Story exists, no tasks → `/autodev-plan {N}`
- Tasks exist, no execution → `/autodev-execute {N}`
- Story executing → `/autodev-execute {N}` (continue)
- Story complete, more stories → `/autodev-plan {next}`
- Epic complete → `/autodev-cleanup` (cleanup option)
</step>

</process>

<success_criteria>
- [ ] Epic state correctly displayed
- [ ] Story progress shown
- [ ] Next action suggested
</success_criteria>
