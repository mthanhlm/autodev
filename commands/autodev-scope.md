---
name: autodev:scope
description: Create a new scope from an existing repo
argument-hint: "<scope name> [--add-phase] [--from-codebase]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
---

<objective>
Create a new scope definition for working in an existing repository. Asks about what needs to be built, breaks it into phases, creates SCOPE.md and PHASES.md.
</objective>

<process>

<step name="parse_args">
Parse `$ARGUMENTS` for scope name.

If empty, use AskUserQuestion:
```
What is this scope about? (brief description of what you're building)
```
</step>

<step name="check_existing">
Check if `.autodev/` directory already exists:
```bash
[ -d ".autodev" ] && echo "exists" || echo "new"
```

If exists, use AskUserQuestion to confirm:
```
Existing autodev project found. Create a new scope anyway, or abort?
```
Options: [Create new scope] [Abort]

If user says abort, exit.
</step>

<step name="discover_context">
Scout the existing codebase for context:

1. Read `CLAUDE.md` or `CONTEXT.md` if exists (project conventions)
2. Check `package.json`, `Cargo.toml`, `go.mod`, etc. (tech stack)
3. List source directories to understand structure
4. Check existing tests to understand testing approach

Present a brief summary:
```
**Tech stack detected:** {stack}
**Source structure:** {dirs}
```
</step>

<step name="gather_requirements">
Use AskUserQuestion tool to ask each question SEPARATELY:

Question 1 - use AskUserQuestion:
```
What are you building? (one paragraph describing the goal)
```

Question 2 - use AskUserQuestion:
```
What must be true for this to be done? (list the must-have requirements)
```

Question 3 - use AskUserQuestion:
```
What's out of scope? (what should NOT be included)
```

Question 4 - use AskUserQuestion:
```
Any constraints? (tech preferences, performance, license, etc.)
```
</step>

<step name="break_into_phases">
Based on the gathered requirements, propose 2-4 phases as vertical slices.

Use AskUserQuestion to confirm/adjust:
```
## Proposed Phases

1. **Phase name** — what it delivers
2. **Phase name** — what it delivers
...

Add, remove, or reorder phases as needed.
```
Options: [Accept these phases] [Modify]

If user says modify, ask what to change.
</step>

<step name="create_structure">
Create `.autodev/` directory structure:

```bash
mkdir -p .autodev/phases
```

Create SCOPE.md with the user's actual answers:
```markdown
# Scope: {scope_name}

**Created:** {date}
**Status:** active

## Goal
{user's goal description}

## Must-Haves
{user's must-haves as bullet list}

## Out of Scope
{user's out-of-scope items}

## Constraints
{user's constraints}
```

Create PHASES.md:
```markdown
# Phases

## Phase 1: {name}
Status: pending

## Phase 2: {name}
Status: pending

... (for each phase)
```

Create STATE.md:
```markdown
# State

**Current Phase:** 1
**Status:** planning

## Decisions
- {key decisions made during scope creation}

## Notes
- {additional notes}
```
</step>

<step name="done">
Report:
```
✅ Scope created: {name}
📁 .autodev/SCOPE.md
📁 .autodev/PHASES.md
📁 .autodev/STATE.md

⚠ Clear context before planning: /clear
Then run: /autodev-plan 1
```
</step>

</process>

<success_criteria>
- [ ] SCOPE.md created with goal, must-haves, out-of-scope
- [ ] PHASES.md created with phase breakdown
- [ ] STATE.md created with initial state
- [ ] User understands next step
</success_criteria>
