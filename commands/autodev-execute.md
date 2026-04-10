---
name: autodev-execute
description: Execute all tasks in a story with wave-based parallelization
argument-hint: "<story-number> [--wave N] [--interactive]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - Task
  - TodoWrite
  - AskUserQuestion
---

<objective>
Execute all tasks in a story using wave-based parallel execution. Each subagent gets fresh context for execution.
</objective>

<process>

<step name="parse_args">
Parse `$ARGUMENTS` for story number.

Optional flags:
- `--wave N` — Execute only Wave N
- `--interactive` — Execute inline with user checkpoints between tasks
</step>

<step name="discover_tasks">
Find all TASK.md files for the story:

```bash
ls .autodev/stories/{story}-*/{story}-*-TASK.md 2>/dev/null
```

Skip tasks that already have SUMMARY.md.

Group tasks by wave number from frontmatter.
</step>

<step name="update_state">
Update STATE.md for story start:
- Set **Status:** to "executing"
- Set **Current Story:** to story number if not set
- Record start time
</step>

<step name="execute_waves>
For each wave:

1. **Show what's being built:**
   ```
   ## Wave {N}

   **{Task ID}: {Task Name}**
   {what this builds}
   ```

2. **If `--interactive` flag present:**
   Execute tasks sequentially inline with user checkpoints.

   For each task:
   a. Show task to user: Execute / Review / Skip
   b. If "Review first": Show subtask breakdown
   c. If "Execute": Read TASK.md and execute subtasks inline
   d. After each subtask: Brief pause for user intervention

3. **If normal mode:**
   Execute tasks **sequentially** (not in parallel). Each Task() call blocks until complete:

   - Spawn executor for Task A, wait for completion
   - Spawn executor for Task B, wait for completion
   - Etc.

   **Why sequential blocking:** Keeps main context synchronized, prevents user from typing mid-execution, ensures clean state for each task.

   **Wave grouping still applies:** Wave 1 tasks run first, then Wave 2, etc. Only the **within-wave** execution is sequential.
</step>

<step name="handle_results>
After each task completes:
- Check SUMMARY.md exists
- Spot-check git status for modified files
- Report completion with file summary

If any task failed, offer specific recovery options:
```
⚠ Task {id} failed

This task failed. Here's what to do:

1. **Retry** — Run this task again (might succeed if it was a transient issue)
2. **Skip** — Mark as skipped, continue with remaining tasks
3. **Debug** — Exit execution and investigate

To retry: /autodev-execute {story} --wave {current_wave}
To skip: Say "skip" and I'll continue
To debug: Say "debug" and I'll show you the error details
```

For each option, be specific about what will happen.
</step>

<step name="aggregate_results">
After all waves complete:

```markdown
## Story {X} Execution Complete

**Waves:** {N} | **Tasks:** {M}/{total} complete

| Wave | Tasks | Status |
|------|-------|--------|
| 1 | task-01, task-02 | ✓ |
| 2 | task-03 | ✓ |
```
</step>

<step name="done">
Report completion:
```
✅ Story {n} executed

Tasks completed: {count}/{total}

Next: /autodev-verify {n}

Tip: Run /clear before verifying to start fresh.
```
</step>

</process>

<guardrails>
- **NO auto-commit** — All commits are manual per company policy
- If code changes are ready for commit, report what needs committing
- Do not run `git commit` — user commits manually
</guardrails>

<success_criteria>
- [ ] All tasks executed (or all incomplete tasks)
- [ ] SUMMARY.md created for each task
- [ ] STATE.md updated with execution results
- [ ] No auto-commits (manual commit only reported)
</success_criteria>
