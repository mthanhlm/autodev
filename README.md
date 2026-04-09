# Autodev

Lean workflow plugin for scope-driven development. Plan, execute, and verify without the overhead.

## What's Different from GSD

| GSD | Autodev |
|-----|---------|
| Project → Milestone → Phase | Scope → Phase only |
| Auto-commit by AI | Manual commit only (company policy) |
| 25+ agents | 3 essential agents |
| Heavy discuss-phase flow | Inline discuss in plan |
| Complex multi-tool dependency | Simple command-based workflow |
| Workstreams, workspaces | Single scope |

## Installation

### From GitHub (Recommended)

```bash
# Clone to Claude Code plugins directory
git clone https://github.com/autonxt/autodev.git ~/.claude/plugins/autodev
```

### From Local Copy

```bash
# Copy to Claude Code plugins directory
cp -r /path/to/autodev ~/.claude/plugins/
```

## Commands

| Command | Purpose |
|---------|---------|
| `/autodev-scope` | Create scope from existing repo |
| `/autodev-next` | Auto-advance to next logical step |
| `/autodev-plan <phase>` | Create detailed phase plans |
| `/autodev-execute <phase>` | Execute plans in waves |
| `/autodev-verify <phase>` | Manual UAT after execution |
| `/autodev-fast <task>` | Inline trivial tasks, no planning |
| `/autodev-do <text>` | Smart dispatch to right command |
| `/autodev-progress` | Show current state and next steps |
| `/autodev-health` | Validate project integrity |

## Workflow

```
/autodev-scope          → Create scope (SCOPE.md, PHASES.md, STATE.md)
     ↓
/autodev-next           → Auto-detects state
     ↓
/autodev-plan 1         → Creates PLAN.md files with waves
     ↓
/autodev-execute 1      → Execute plans in parallel waves
     ↓
/autodev-verify 1       → Manual user acceptance testing
     ↓
/autodev-next           → Advance to next phase or suggest next command
```

## State Files

| File | Purpose |
|------|---------|
| `.autodev/SCOPE.md` | Scope definition with goal and must-haves |
| `.autodev/PHASES.md` | Phase breakdown with status |
| `.autodev/STATE.md` | Current state and decisions |
| `.autodev/phases/N-*/{N}-{M}-PLAN.md` | Atomic task plans |
| `.autodev/phases/N-*/{N}-{M}-SUMMARY.md` | Execution summaries |

## Usage Example

```bash
# Start a new scope
/autodev-scope "User authentication feature"

/autodev-next
# → Shows: /autodev-plan 1

/autodev-plan 1
# → Asks questions about implementation
# → Creates {1}-CONTEXT.md and {1}-{01,02}-PLAN.md

/autodev-execute 1
# → Executes plans in waves
# → Reports manual commit needed

/autodev-verify 1
# → Presents UAT items
# → User marks pass/fail

/autodev-next
# → Advances to next phase or suggests next command
```

## Statusline

The statusline shows real-time context window usage and scope progress:

```
model │ scope │ Phase N │ ████░░░░░░ 40% │ context ████████░░ 62% │ dirname
```

**What it shows:**
- **Model** — Current Claude model
- **Scope:Phase** — Current scope name and phase number
- **Scope Progress** — Percentage of phases completed (from PHASES.md checkboxes)
- **Context Usage** — Color-coded context window consumption

**Context colors:**
- Green (<50%) — Healthy context
- Yellow (50-65%) — Getting used
- Orange (65-80%) — Running low
- Flashing red with skull (80%+) — Critical, compaction imminent

## No Auto-Commit Policy

Autodev does NOT auto-commit. All commits must be manual per company policy. After execution, autodev reports which files need committing but never runs `git commit` itself.

## Repository

https://github.com/autonxt/autodev

## License

MIT
