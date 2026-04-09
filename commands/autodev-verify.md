---
name: autodev:verify
description: Manual user acceptance testing after phase execution
argument-hint: "<phase-number>"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---

<objective>
Present phase verification items for human testing. After execution, all automated checks pass but only humans can verify the feature actually works as expected.
</objective>

<process>

<step name="parse_args">
Parse `$ARGUMENTS` for phase number.
</step>

<step name="load_verification_data">
Read from phase directory:
- All PLAN.md files (understand what was promised)
- All SUMMARY.md files (what was delivered)
- SCOPE.md (original must-haves)

Extract must_haves from plans.
</step>

<step name="present_testable_deliverables">
For each plan, extract testable items:

```markdown
## Phase {N}: {Name}

### Testable Deliverables

1. **{Deliverable name}**
   - **What should work:** {description}
   - **How to test:** {steps}
   
2. ...
```

Group by functional area.
</step>

<step name="human_verification_loop">
For each item, present to user:

```
## {Deliverable}

**Expected:** {behavior}
**Test:** {steps}

Result: [ ] PASS | [ ] FAIL | [ ] SKIP

Notes:
```

User marks pass/fail/skip.

If FAIL, capture issue description.
</step>

<step name="create_uat_report">
Create `{phase}-UAT.md`:

```markdown
---
phase: {N}-{name}
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
If all pass → Mark phase complete in PHASES.md, report success.

If some fail:
```
⚠ {count} items failed verification

Options:
1. Fix and re-verify (runs inline fix)
2. Create gap plans for /autodev-plan
3. Skip (mark as known issues)
```
</step>

<step name="done">
⚠ **Clear context before verification: `/clear`**

Report final status:

```
✅ Phase {n} verified and complete
   UAT: {passed}/{total} passed

Next: `/autodev-next` for next step
```
</step>

</process>

<success_criteria>
- [ ] All testable items presented for human testing
- [ ] User marked each item pass/fail
- [ ] UAT.md created with results
- [ ] Failed items handled appropriately
</success_criteria>
