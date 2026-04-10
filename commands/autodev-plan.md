---
name: autodev-plan
description: Create detailed story plans with task breakdown
argument-hint: "<story-number> [--discuss]"
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
Create executable task plans for a story. Each story is broken into 2-4 tasks (vertical slices), and each task contains 2-4 subtasks. Uses inline discussion for gray areas.
</objective>

<process>

<step name="parse_args">
Parse `$ARGUMENTS` for story number.

If empty, ask:
```
Which story to plan? (1, 2, 3...)
```
</step>

<step name="load_context">
Read all context for this story:

- `.autodev/EPIC.md` — epic definition
- `.autodev/STORIES.md` — story breakdown
- `.autodev/STATE.md` — current state
- `.autodev/stories/{n}-*/` — existing story files

Verify story exists.
</step>

<step name="discuss_inline">
**Only if `--discuss` flag is explicitly passed:**

Use AskUserQuestion for each gray area - ask SEPARATELY:

Question 1:
```
Any specific UI/visual requirements?
```

Question 2:
```
Any API/CLI preferences? (response format, error handling)
```

Question 3:
```
Any specific data model requirements?
```

Question 4:
```
Any edge cases or known scenarios to handle?
```

For each question, only ask if not already determined from epic. Create `{n}-CONTEXT.md` with locked decisions.

**If `--discuss` not passed:** Skip this step. Context from EPIC.md and STORIES.md is sufficient. Proceed directly to create_tasks.
</step>

<step name="create_tasks"
Create 2-4 tasks for the story based on:
- Story goal from STORIES.md
- Context from discuss step
- Vertical slice pattern (each task is a complete feature slice)

For each task, create `{story}-{n}-TASK.md`:

```markdown
---
story: {story-name}
task: {n}
type: execute
wave: {wave-number}
depends_on: []
files_modified: []
autonomous: true
requirements: []
---

<objective>
[What this task accomplishes]
Purpose: [Why this matters for the story]
Output: [What artifacts will be created]
</objective>

<context>
@.autodev/EPIC.md
@.autodev/STATE.md
@{n}-CONTEXT.md
[relevant source files]
</context>

<subtasks>

<subtask type="auto">
  <name>Subtask 1: [name]</name>
  <files>path/to/file.ext</files>
  <action>[Specific implementation with concrete values]</action>
  <verify>[Command to prove it worked]</verify>
  <done>[Measurable criteria]</done>
</subtask>

... more subtasks

</subtasks>

<verification>
- [ ] [Specific check]
- [ ] [Build passes]
</verification>

<success_criteria>
- [ ] All subtasks completed
- [ ] Verification checks pass
- [ ] No errors introduced
</success_criteria>
```
</step>

<step name="update_state">
Update STATE.md:
- Set **Status:** to "planning"
- Record story start time

Update STORIES.md:
- Set story status to "planned"
</step>

<step name="done">
Report:
```
✅ Story {n} planned: {task_count} tasks created

## Tasks

| Task | Wave | Files | Purpose |
|------|------|-------|---------|
| {n}-01 | 1 | ... | ... |
| {n}-02 | 1 | ... | ... |

Next: /autodev-execute {n}

Tip: Run /clear before executing to start fresh.
```
</step>

</process>

<success_criteria>
- [ ] Story context captured in {n}-CONTEXT.md
- [ ] 2-4 TASK.md files created
- [ ] Tasks have wave assignments for parallel execution
- [ ] Each task contains 2-4 subtasks
- [ ] STATE.md updated
</success_criteria>
