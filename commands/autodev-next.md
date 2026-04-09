---
name: autodev:next
description: Auto-detect project state and advance to the next logical workflow step
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
---

<objective>
Detect current project state and automatically invoke the next logical autodev workflow step. Reads scope and phase state to determine: scope → plan → execute → verify progression.
</objective>

<process>

<step name="detect_state">
Read project state to determine current position:

- `.autodev/SCOPE.md` — scope definition
- `.autodev/PHASES.md` — phase breakdown
- `.autodev/STATE.md` — current state, decisions, blockers

Extract:
- current_phase — which phase is active
- status — active, paused, etc.

If no `.autodev/` directory exists:
```
No autodev project detected. Run `/autodev-scope` to get started.
```
Exit.
</step>

<step name="safety_gates">
Run hard-stop checks before routing. Exit on first hit.

**Gate 1: Unresolved checkpoint**
Check if `.autodev/.continue-here.md` exists:
If found:
```
⛔ Hard stop: Unresolved checkpoint

`.autodev/.continue-here.md` exists — a previous session left unfinished work.
Read the file, resolve the issue, then delete it to continue.
```
Exit.

**Gate 2: Error state**
Check if STATE.md contains `status: error` or `status: failed`:
If found:
```
⛔ Hard stop: Project in error state

Resolve the error before advancing. Run `/autodev-health` to diagnose.
```
Exit.
</step>

<step name="determine_next_action">
Apply routing rules based on state:

**Route 1: No phases yet → scope**
If SCOPE.md exists but no phases defined:
→ Next action: `/autodev-scope --add-phase`

**Route 2: Phases exist but no current phase → set first phase**
If PHASES.md has phases but no current phase set:
→ Next action: `/autodev-plan 1`

**Route 3: Current phase has no plans → plan**
If current phase exists but has no PLAN.md files:
→ Next action: `/autodev-plan <current_phase>`

**Route 4: Phase has plans but no summaries → execute**
If plans exist but not all have matching summaries:
→ Next action: `/autodev-execute <current_phase>`

**Route 5: All plans have summaries → verify**
If all plans in the current phase have summaries:
→ Next action: `/autodev-verify <current_phase>`

**Route 6: Phase complete, next phase exists → advance**
If current phase is complete and next phase exists:
→ Next action: `/autodev-plan <next_phase>`
</step>

<step name="show_and_execute">
**Important:** Recommend `/clear` before advancing to keep context fresh:

```
⚠ Clear context before proceeding: /clear
```

Display the determination:

```
## Autodev Next

**Current:** Phase [N] | [status]
**Next step:** `/autodev-[command] [args]`
  [One-line explanation]

```

Then immediately invoke the determined command via SlashCommand.
No confirmation — the whole point is zero-friction advancement.
</step>

</process>

<success_criteria>
- [ ] Project state correctly detected
- [ ] Next action correctly determined from routing rules
- [ ] Command invoked immediately without user confirmation
- [ ] Clear status shown before invoking
</success_criteria>
