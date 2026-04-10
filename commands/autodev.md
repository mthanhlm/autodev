---
name: autodev
description: Universal autodev entry point — creates scope, advances workflow, or routes requests
argument-hint: "<description of what you want to do (optional)>"
allowed-tools:
  - Read
  - Bash
  - AskUserQuestion
  - Glob
  - SlashCommand
---

<objective>
Single entry point for everything autodev. When called:
- **No arguments + no scope** → Creates a new scope
- **No arguments + has scope** → Detects current state and advances to the next logical step
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
    question: "No autodev project found. Create a new scope to get started?",
    header: "New Project",
    options: [
      { label: "Create scope", description: "Set up autodev scope for this project" },
      { label: "Abort", description: "Cancel and do nothing" }
    ]
  }]
})

If user confirms "Create scope" → Invoke `/autodev-scope` and exit.
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
- `.autodev/SCOPE.md` — scope definition
- `.autodev/PHASES.md` — phase breakdown
- `.autodev/STATE.md` — current state

**Safety gates:**
- If `.autodev/.continue-here.md` exists → Hard stop. Show message to resolve first.
- If STATE.md has `status: error` or `status: failed` → Hard stop. Show message to resolve.

**Determine next action:**

| State | Next Action |
|-------|-------------|
| No phases defined | `/autodev-scope --add-phase` |
| Phases exist, no current phase | `/autodev-plan 1` |
| Current phase, no plans | `/autodev-plan <current_phase>` |
| Plans exist, not all executed | `/autodev-execute <current_phase>` |
| All plans executed | `/autodev-verify <current_phase>` |
| Phase complete, more phases | `/autodev-plan <next_phase>` |
| Project complete | Show completion summary |

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
| Starting fresh, new project, setup | `/autodev-scope` | Needs scope creation |
| Small trivial task: typo, config, simple fix | `/autodev-fast` | No planning needed |
| Progress check, "where am I", status | `/autodev-progress` | Status inquiry |
| Complex task: refactor, multi-file, architecture | `/autodev-plan` | Needs planning cycle |
| Planning a specific phase | `/autodev-plan <phase>` | Direct planning |
| Executing a phase | `/autodev-execute <phase>` | Direct execution |
| Review, verification | `/autodev-verify` | Needs verification |
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
- [ ] No scope → creates scope
- [ ] Has scope, no args → auto-detects and advances
- [ ] Has args → routes to appropriate command
- [ ] Confirmation before executing
- [ ] Single command for everything
</success_criteria>
