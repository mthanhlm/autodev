---
name: autodev-verify
description: Manual user acceptance testing after story execution
argument-hint: "<story-number>"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---

<objective>
Present story verification items for human testing. After execution, all automated checks pass but only humans can verify the feature actually works as expected.
</objective>

<process>

<step name="parse_args"
Parse `$ARGUMENTS` for story number.
</step>

<step name="load_verification_data"
Read from story directory:
- All TASK.md files (understand what was promised)
- All SUMMARY.md files (what was delivered)
- EPIC.md (original must-haves)

Extract must_haves from tasks.
</step>

<step name="present_testable_deliverables"
For each task, extract testable items:

```markdown
## Story {N}: {Name}

### Testable Deliverables

1. **{Deliverable name}**
   - **What should work:** {description}
   - **How to test:** {steps}

2. ...
```

Group by functional area.
</step>

<step name="human_verification_loop"
For each item, use AskUserQuestion SEPARATELY:

```
## {Deliverable}

**Expected:** {behavior}
**Test:** {steps}
```

Options: [PASS] [FAIL] [SKIP]

If FAIL, use AskUserQuestion:
```
Describe the issue:
```

Capture issue description.
</step>

<step name="create_uat_report"
Create `{story}-UAT.md`:

```markdown
---
story: {N}-{name}
status: {passed|partial|failed}
started: {date}
updated: {date}
---

## User Acceptance Testing

### Summary
- Total items: {count}
- Passed: {count}
- Failed: {count}
- Skipped: {count}

### Test Results

| Item | Result | Notes |
|------|--------|-------|
| ... | ... | ... |

### Issues Found
{list of failed items with descriptions}

### Resolution
{failed items that were fixed during UAT}
```
</step>

<step name="handle_results">
If all pass → Set story status to "complete" in STORIES.md, report success.

If some fail:
```
⚠ {count} items failed verification

Options:
1. Fix and re-verify (runs inline fix)
2. Create gap tasks for /autodev-plan
3. Skip (mark as known issues)
```
</step>

<step name="done">
Report final status:

```
✅ Story {n} verified and complete

UAT Results: {passed}/{total} passed

Next: /autodev (to advance to next story)

If all stories complete, run /autodev-cleanup when ready.
```
</step>

</process>

<success_criteria>
- [ ] All testable items presented for human testing
- [ ] User marked each item pass/fail
- [ ] UAT.md created with results
- [ ] Failed items handled appropriately
</success_criteria>
