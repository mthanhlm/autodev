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

If empty, ask:
```
What is this scope about? (brief description of what you're building)
```
Store as `$SCOPE_NAME`.
</step>

<step name="check_existing">
Check if `.autodev/` directory already exists:
```bash
[ -d ".autodev" ] && echo "exists" || echo "new"
```

If exists, ask:
```
Existing autodev project found. Create a new scope anyway, or abort?
```
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
Ask until scope is clear:

1. **What are you building?** (one paragraph describing the goal)
2. **What must be true for this to be done?** (list must-haves)
3. **What's out of scope?** (explicitly not included)
4. **Any constraints?** (tech preferences, performance, etc.)

Store answers in `$SCOPE_GOAL`, `$MUST_HAVES`, `$OUT_OF_SCOPE`, `$CONSTRAINTS`.
</step>

<step name="break_into_phases">
Break the scope into phases. Guidelines:
- Each phase should be a vertical slice (model + API + UI if applicable)
- 2-4 phases is typical for a scope
- Each phase should be independently testable

Ask user to review and adjust:
```
## Proposed Phases

1. **Phase name** — what it delivers
2. **Phase name** — what it delivers
...

Add, remove, or reorder phases as needed.
```

Store final phase list.
</step>

<step name="create_structure">
Create `.autodev/` directory structure:

```bash
mkdir -p .autodev/phases
```

Create SCOPE.md:
```markdown
# Scope: {name}

**Created:** {date}
**Status:** active

## Goal
{goal description}

## Must-Haves
- {must-have 1}
- {must-have 2}

## Out of Scope
- {out of scope 1}
- {out of scope 2}

## Constraints
- {constraint 1}
- {constraint 2}

## Tech Stack
{tech stack}
```

Create PHASES.md:
```markdown
# Phases

## Phase 1: {name}
- [ ] Planned
- [ ] Executed
- [ ] Verified

## Phase 2: {name}
- [ ] Planned
- [ ] Executed
- [ ] Verified

... (for each phase)
```

Create STATE.md:
```markdown
# State

**Scope:** {name}
**Current Phase:** {first phase}
**Status:** planning
**Last Activity:** {date}

## Quick Tasks
| Date | Type | Description | Status |
|------|------|-------------|--------|
```

Update ROADMAP.md if it exists, or create as summary.
</step>

<step name="done">
Report:
```
✅ Scope created: {name}
📁 .autodev/SCOPE.md
📁 .autodev/PHASES.md
📁 .autodev/STATE.md

Next: `/autodev-plan 1` to plan the first phase
```
</step>

</process>

<success_criteria>
- [ ] SCOPE.md created with goal, must-haves, out-of-scope
- [ ] PHASES.md created with phase breakdown
- [ ] STATE.md created with initial state
- [ ] User understands next step
</success_criteria>
