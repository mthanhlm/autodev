---
name: autodev-health
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

<step name="check_structure"
Check required files exist:
- `.autodev/EPIC.md`
- `.autodev/STORIES.md`
- `.autodev/STATE.md`

Report missing files.
</step>

<step name="validate_content"
For each file:

**EPIC.md:** Check required sections:
- [ ] Goal defined
- [ ] Must-haves listed
- [ ] Out of scope listed

**STORIES.md:** Check:
- [ ] At least one story defined
- [ ] Each story has name

**STATE.md:** Check:
- [ ] Has epic reference
- [ ] Has current story
- [ ] Status is valid value
</step>

<step name="check_story_consistency"
For each story directory in `.autodev/stories/`:
- Check story number matches directory name
- Check for orphaned files (no matching entry in STORIES.md)
- Check for missing summaries (task exists but no summary)
</step>

<step name="display_results"
```markdown
## Autodev Health Check

### Structure
✅ EPIC.md present
✅ STORIES.md present
✅ STATE.md present

### Content
✅ Epic has goal
✅ Epic has must-haves
✅ Stories defined

### Story Consistency
✅ Story 1: consistent
⚠ Story 3: missing summary for task 03-02

### Issues Found
{list of issues}
```

If `--repair` flag present:
- Auto-repair trivial issues (missing optional sections, formatting)
- Report repairs made
</step>

<step name="done"
If all checks pass:
```
✅ Autodev health check passed

No issues found.
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
- [ ] Story consistency verified
- [ ] Issues reported clearly
</success_criteria>
