---
name: autodev-fast
description: Execute a trivial task inline — no planning, no subagents, just do it
argument-hint: "<task description>"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - AskUserQuestion
---

<objective>
Execute a trivial task directly in the current context without spawning subagents or generating TASK.md files. For tasks too small to justify planning overhead: typo fixes, config changes, small refactors, simple additions.
</objective>

<process>

<step name="parse_task"
Parse `$ARGUMENTS` for the task description.

If empty, use AskUserQuestion:
```
What's the quick fix? (one sentence)
```
</step>

<step name="scope_check"
**Before doing anything, verify this is actually trivial.**

A task is trivial if it can be completed in:
- ≤ 3 file edits
- ≤ 1 minute of work
- No new dependencies or architecture changes
- No research needed

If the task seems non-trivial:
```
This looks like it needs planning. Use `/autodev-plan` instead.
```
And stop.
</step>

<step name="execute_inline"
Do the work directly:

1. Read the relevant file(s)
2. Make the change(s)
3. Verify the change works (run existing tests if applicable, or quick sanity check)

**No TASK.md.** Just do it.
</step>

<step name="log_to_state"
If `.autodev/STATE.md` exists, append to the "Quick Tasks" section.
If the section doesn't exist, skip silently.
</step>

<step name="done"
Report completion:

```
✅ Done: {what was changed}
   Files: {list of changed files}
```

No next-step suggestions. No workflow routing. Just done.
</step>

</process>

<guardrails>
- NEVER spawn a Task/subagent — this runs inline
- NEVER create TASK.md or SUMMARY.md files
- NEVER run research or plan-checking
- If the task takes more than 3 file edits, STOP and redirect to `/autodev-plan`
</guardrails>

<success_criteria>
- [ ] Task completed in current context (no subagents)
- [ ] No git commit (manual commit only per company policy)
- [ ] STATE.md updated if it exists
- [ ] Total operation under 2 minutes wall time
</success_criteria>
