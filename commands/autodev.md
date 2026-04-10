---
name: autodev
description: Universal autodev entry point — creates epic, advances workflow, or routes requests
argument-hint: "<what you want to do (optional)>"
allowed-tools:
  - Read
  - Bash
  - AskUserQuestion
  - Glob
---

<objective>
Single entry point for everything autodev. When called:
- **No arguments + no epic** → Creates a new epic
- **No arguments + has epic** → Detects current state and advances to the next logical step
- **With arguments** → Analyzes intent and routes to the appropriate command

This is the only autodev command most users need.
</objective>

<process>

<step name="check_scope">
Check if `.autodev/` directory exists:
```bash
[ -d ".autodev" ] && echo "exists" || echo "missing"
```

If missing:
AskUserQuestion({
  questions: [{
    question: "No autodev project found. Create a new epic to get started?",
    header: "New Epic",
    options: [
      { label: "Create epic", description: "Set up autodev epic for this project" },
      { label: "Abort", description: "Cancel and do nothing" }
    ]
  }]
})

If user confirms "Create epic" → Invoke `/autodev-epic` and exit.
If user "Abort" → exit.

If exists, proceed to step: check_input
</step>

<step name="check_input">
If `$ARGUMENTS` is empty:
→ Proceed to step: auto_advance

If `$ARGUMENTS` is provided:
→ Proceed to step: route_request
</step>

<step name="auto_advance">
Read project state:
- `.autodev/EPIC.md` — epic definition
- `.autodev/STORIES.md` — story breakdown
- `.autodev/STATE.md` — current state

**Safety gates:**
- If `.autodev/.continue-here.md` exists → Hard stop. Show message to resolve first.
- If STATE.md has `status: error` or `status: failed` → Hard stop with clear error display.

**Determine next action:**

| State | Next Action |
|-------|-------------|
| No stories defined | `/autodev-story` |
| Stories exist, no current story | `/autodev-plan 1` |
| Current story, no plans | `/autodev-plan <story_number>` |
| Tasks exist, not all executed | `/autodev-execute <story_number>` |
| All tasks executed | `/autodev-verify <story_number>` |
| Story complete, more stories | `/autodev-plan <next_story>` |
| Epic complete | Show completion summary |

**Ask for confirmation:**
AskUserQuestion({
  questions: [{
    question: "Proceed with /autodev-{command} {args}?",
    header: "Autodev",
    options: [
      { label: "Yes", description: "Run the next step" },
      { label: "Show details", description: "Preview what will happen" },
      { label: "Abort", description: "Cancel and do nothing" }
    ]
  }]
})

If user confirms "Yes" → SlashCommand to invoke.
If user asks for "Show details" → invoke command with `--discuss` flag to preview.
If user "Abort" → exit.
</step>

<step name="route_request">
Analyze `$ARGUMENTS` against these routing rules. Apply the **first matching** rule:

| If the text describes... | Route to | Why |
|--------------------------|----------|-----|
| Starting fresh, new project, setup | `/autodev-epic` | Needs epic creation |
| Small trivial task: typo, config, simple fix | `/autodev-fast` | No planning needed |
| Progress check, "where am I", status | `/autodev-progress` | Status inquiry |
| Complex task: refactor, multi-file, architecture | `/autodev-plan` | Needs planning cycle |
| Planning a specific story | `/autodev-plan <story>` | Direct planning |
| Executing a story | `/autodev-execute <story>` | Direct execution |
| Review, verification, testing | `/autodev-verify` | Needs verification |
| Health check, diagnose | `/autodev-health` | Diagnostics |
| Anything else | Use the most fitting above | Best effort routing |

**Ambiguity:** If could match multiple routes, use AskUserQuestion:
AskUserQuestion({
  questions: [{
    question: "{description} could be /autodev-fast (quick) or /autodev-plan (full planning). Which?",
    header: "Route?",
    options: [
      { label: "/autodev-fast", description: "Quick inline execution" },
      { label: "/autodev-plan", description: "Full planning cycle" }
    ]
  }]
})

**Ask for confirmation:**
AskUserQuestion({
  questions: [{
    question: "Input: {first 80 chars of $ARGUMENTS}\nRouting to: /autodev-{command}\nReason: {one-line}",
    header: "Confirm",
    options: [
      { label: "Yes", description: "Run the routed command" },
      { label: "Abort", description: "Cancel" }
    ]
  }]
})

If user confirms "Yes" → SlashCommand to invoke.
If user "Abort" → exit.
</step>

</process>

<success_criteria>
- [ ] No epic → creates epic
- [ ] Has epic, no args → auto-detects and advances
- [ ] Has args → routes to appropriate command
- [ ] Confirmation before executing
- [ ] Single command for everything
</success_criteria>
