---
name: autodev:plan
description: Create detailed phase plan with verification
argument-hint: "<phase-number> [--discuss]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - Task
  - AskUserQuestion
---

<objective>
Create executable phase plans (PLAN.md files) for a phase. Does inline discussion + planning in one flow for speed.
</objective>

<process>

<step name="parse_args">
Parse `$ARGUMENTS` for phase number.

If empty, ask:
```
Which phase to plan? (1, 2, 3...)
```
</step>

<step name="load_context">
Read all context for this phase:

- `.autodev/SCOPE.md` — scope definition
- `.autodev/PHASES.md` — phase breakdown
- `.autodev/STATE.md` — current state
- `.autodev/phases/{n}-*/` — existing phase files

Verify phase exists.
</step>

<step name="discuss_inline">
**If `--discuss` flag present (or if phase has no CONTEXT.md):**

Quick discussion to lock key decisions:

Ask about each gray area:
1. **Visual features** → Any specific UI requirements?
2. **APIs/CLIs** → Response format, error handling preferences?
3. **Data model** → Any specific field requirements?
4. **Edge cases** → Known scenarios to handle?

For each area, only ask if not already determined from scope.

Create `{n}-CONTEXT.md` with locked decisions.
</step>

<step name="create_plans">
Create 2-4 plans for the phase based on:
- Phase goal from PHASES.md
- Context from discuss step
- Vertical slice pattern (each plan is a complete feature slice)

For each plan, create `{phase}-{n}-PLAN.md`:

```markdown
---
phase: {phase-name}
plan: {n}
type: execute
wave: {wave-number}
depends_on: []
files_modified: []
autonomous: true
requirements: []
---

<objective>
[What this plan accomplishes]
Purpose: [Why this matters]
Output: [What artifacts will be created]
</objective>

<context>
@.autodev/SCOPE.md
@.autodev/STATE.md
@{n}-CONTEXT.md
[relevant source files]
</context>

<tasks>

<task type="auto">
  <name>Task 1: [name]</name>
  <files>path/to/file.ext</files>
  <action>[Specific implementation with concrete values]</action>
  <verify>[Command to prove it worked]</verify>
  <done>[Measurable criteria]</done>
</task>

... more tasks

</tasks>

<verification>
- [ ] [Specific check]
- [ ] [Build passes]
</verification>

<success_criteria>
- [ ] All tasks completed
- [ ] Verification checks pass
- [ ] No errors introduced
</success_criteria>
```
</step>

<step name="update_state">
Update STATE.md:
- Set **Status:** to "planning"
- Record phase start time

Update PHASES.md:
- Set phase status to "planned"
</step>

<step name="done">
Report:
```
✅ Phase {n} planned: {plan_count} plans created

## Plans

| Plan | Wave | Files | Purpose |
|------|------|-------|---------|
| {n}-01 | 1 | ... | ... |
| {n}-02 | 1 | ... | ... |

⚠ Clear context before execute: /clear
Then run: /autodev-execute {n}
```
</step>

</process>

<success_criteria>
- [ ] Phase context captured in {n}-CONTEXT.md
- [ ] 2-4 PLAN.md files created
- [ ] Plans have wave assignments for parallel execution
- [ ] STATE.md updated
</success_criteria>
