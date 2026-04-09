---
name: autodev:health
description: Validate .autodev directory integrity and auto-repair
argument-hint: "[--repair]"
allowed-tools:
  - Read
  - Bash
  - Glob
---

<objective>
Validate `.autodev/` directory integrity. Check all required files exist, report issues, optionally auto-repair.
</objective>

<process>

<step name="check_structure">
Check required files exist:
- `.autodev/SCOPE.md`
- `.autodev/PHASES.md`
- `.autodev/STATE.md`

Report missing files.
</step>

<step name="validate_content">
For each file:

**SCOPE.md:** Check required sections:
- [ ] Goal defined
- [ ] Must-haves listed
- [ ] Out of scope listed

**PHASES.md:** Check:
- [ ] At least one phase defined
- [ ] Each phase has name

**STATE.md:** Check:
- [ ] Has scope reference
- [ ] Has current phase
- [ ] Status is valid value
</step>

<step name="check_phase_consistency">
For each phase directory in `.autodev/phases/`:
- Check phase number matches directory name
- Check for orphaned files (no matching entry in PHASES.md)
- Check for missing summaries (plan exists but no summary)
</step>

<step name="display_results">
```markdown
## Autodev Health Check

### Structure
✅ SCOPE.md present
✅ PHASES.md present
✅ STATE.md present

### Content
✅ Scope has goal
✅ Scope has must-haves
✅ Phases defined

### Phase Consistency
✅ Phase 1: consistent
⚠ Phase 3: missing summary for plan 03-02

### Issues Found
{list of issues}
```

If `--repair` flag present:
- Auto-repair trivial issues (missing optional sections, formatting)
- Report repairs made
</step>

<step name="done">
If all checks pass:
```
✅ Autodev health check passed

.no issues found.
```

If issues found:
```
⚠ {count} issues found

Run `/autodev-health --repair` to auto-repair.
```
</step>

</process>

<success_criteria>
- [ ] All required files present
- [ ] Content validated
- [ ] Phase consistency verified
- [ ] Issues reported clearly
</success_criteria>
