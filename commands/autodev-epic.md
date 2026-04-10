---
name: autodev-epic
description: Create a new epic from an existing repo
argument-hint: "<epic name> [--add-story] [--from-codebase]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
---

<objective>
Create a new epic definition for working in an existing repository. An epic is the overall goal — what we're building. Ask what needs to be built, break it into stories (vertical slices), create EPIC.md and STORIES.md.
</objective>

<process>

<step name="parse_args">
Parse `$ARGUMENTS` for epic name.

If empty, use AskUserQuestion:
```
What is this epic about? (brief description of what you're building)
```
</step>

<step name="check_existing">
Check if `.autodev/` directory already exists:
```bash
[ -d ".autodev" ] && echo "exists" || echo "new"
```

If exists, use AskUserQuestion to confirm:
```
Existing autodev project found. Create a new epic anyway, or abort?
```
Options: [Create new epic] [Abort]

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

<step name="break_into_stories">
Based on the gathered requirements, propose 2-4 stories as vertical slices.

**Vertical slice pattern:** Each story is a complete feature including model + API + UI where applicable.

Use AskUserQuestion to confirm/adjust:
```
## Proposed Stories

1. **Story name** — what it delivers (vertical slice)
2. **Story name** — what it delivers
...

Stories are vertical slices. Each should be independently testable and deliver user value.

Add, remove, or reorder stories as needed.
```
Options: [Accept these stories] [Modify]

If user says modify, ask what to change.
</step>

<step name="create_structure">
Create `.autodev/` directory structure:

```bash
mkdir -p .autodev/stories
```

Create EPIC.md with the user's actual answers:
```markdown
# Epic: {epic_name}

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

Create STORIES.md:
```markdown
# Stories

## Story 1: {name}
Status: pending
What it delivers: {brief description of vertical slice}

## Story 2: {name}
Status: pending
What it delivers: {brief description}

... (for each story)
```

Create STATE.md:
```markdown
# State

**Current Story:** 1
**Status:** planning

## Decisions
- {key decisions made during epic creation}

## Notes
- {additional notes}
```
</step>

<step name="done">
Report:
```
✅ Epic created: {name}

📁 .autodev/EPIC.md       — Epic definition
📁 .autodev/STORIES.md    — Story breakdown
📁 .autodev/STATE.md       — Current state

Next: /autodev-plan 1

Tip: Run /clear before planning to start fresh.
```
</step>

</process>

<success_criteria>
- [ ] EPIC.md created with goal, must-haves, out-of-scope
- [ ] STORIES.md created with story breakdown (vertical slices)
- [ ] STATE.md created with initial state
- [ ] User understands next step is /autodev-plan 1
</success_criteria>
