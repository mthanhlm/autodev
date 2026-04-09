---
name: autodev:execute
description: Execute all plans in a phase with wave-based parallelization
argument-hint: "<phase-number> [--wave N] [--interactive]"
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
Execute all plans in a phase using wave-based parallel execution. Each subagent gets fresh context for execution.
</objective>

<process>

<step name="parse_args">
Parse `$ARGUMENTS` for phase number.

Optional flags:
- `--wave N` — Execute only Wave N
- `--interactive` — Execute inline with user checkpoints between tasks
</step>

<step name="discover_plans">
Find all PLAN.md files for the phase:

```bash
ls .autodev/phases/{phase}-*/{phase}-*-PLAN.md 2>/dev/null
```

Skip plans that already have SUMMARY.md.

Group plans by wave number from frontmatter.
</step>

<step name="update_state">
Update STATE.md for phase start:
- Set status to "executing"
- Record start time
</step>

<step name="execute_waves">
For each wave:

1. **Show what's being built:**
   ```
   ## Wave {N}
   
   **{Plan ID}: {Plan Name}**
   {what this builds}
   ```

2. **If `--interactive` flag present:**
   Execute plans sequentially inline with user checkpoints.
   
   For each plan:
   a. Show plan to user: Execute / Review / Skip
   b. If "Review first": Show task breakdown
   c. If "Execute": Read PLAN.md and execute tasks inline
   d. After each task: Brief pause for user intervention

3. **If normal mode:**
   Spawn Task(subagent_type="autodev-executor") for each plan in the wave in parallel.

   Wait for all agents in wave to complete before proceeding to next wave.
</step>

<step name="handle_results">
After each plan completes:
- Check SUMMARY.md exists
- Spot-check git commits (if any)
- Report completion

If any plan failed:
```
⚠ Plan {id} failed

Options:
1. Retry plan
2. Continue with remaining plans
3. Stop and investigate
```
</step>

<step name="aggregate_results">
After all waves complete:

```markdown
## Phase {X} Execution Complete

**Waves:** {N} | **Plans:** {M}/{total} complete

| Wave | Plans | Status |
|------|-------|--------|
| 1 | plan-01, plan-02 | ✓ |
| 2 | plan-03 | ✓ |
```
</step>

<step name="done">
⚠ **Clear context before execution: `/clear`**

Report completion:
```
✅ Phase {n} executed

Plans completed: {count}/{total}
Next: `/autodev-verify {n}` for verification
```
</step>

</process>

<guardrails>
- **NO auto-commit** — All commits are manual per company policy
- If code changes are ready for commit, report what needs committing
- Do not run `git commit` — user commits manually
</guardrails>

<success_criteria>
- [ ] All plans executed (or all incomplete plans)
- [ ] SUMMARY.md created for each plan
- [ ] STATE.md updated with execution results
- [ ] No auto-commits (manual commit only reported)
</success_criteria>
