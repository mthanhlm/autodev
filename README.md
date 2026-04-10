# Autodev

Lean workflow plugin for agile-driven development. Plan, execute, and verify without the overhead.

## What's Different from GSD

| GSD | Autodev |
|-----|---------|
| Project → Milestone → Phase | Epic → Story only |
| Auto-commit by AI | Manual commit only (company policy) |
| 25+ agents | 3 essential agents |
| Heavy discuss-phase flow | Inline discuss in plan |
| Complex multi-tool dependency | Simple command-based workflow |
| Workstreams, workspaces | Single epic |

## Installation

### From GitHub Marketplace (Recommended)

The plugin is published to the Claude Code marketplace. Claude Code will automatically manage versions in `~/.claude/plugins/cache/autodev/autodev/<version>/`.

### From GitHub (Manual)

```bash
# Clone to Claude Code plugins directory
git clone https://github.com/autonxt/autodev.git ~/.claude/plugins/cache/autodev/autodev
```

### From Local Copy

```bash
# Copy to Claude Code plugins cache directory
cp -r /path/to/autodev ~/.claude/plugins/cache/autodev/autodev
```

## Commands

| Command | Purpose |
|---------|---------|
| `/autodev` | Universal entry point — routes to right command |
| `/autodev-epic` | Create epic from existing repo |
| `/autodev-story` | Create stories from epic scope |
| `/autodev-plan` | Create detailed story plans |
| `/autodev-execute` | Execute plans (sequential blocking) |
| `/autodev-verify` | Manual UAT after execution |
| `/autodev-fast` | Inline trivial tasks, no planning |
| `/autodev-progress` | Show current state and next steps |
| `/autodev-health` | Validate project integrity |
| `/autodev-cleanup` | Remove entire epic (.autodev/) |

## Workflow

```
/autodev-epic           → Create epic (EPIC.md, STORIES.md, STATE.md)
     ↓
/autodev                → Auto-detects state, advances
     ↓
/autodev-plan 1         → Creates {1}-CONTEXT.md and {1}-{01,02}-TASK.md
     ↓
/autodev-execute 1      → Execute tasks in waves (sequential blocking)
     ↓
/autodev-verify 1       → Manual user acceptance testing
     ↓
/autodev                → Advance to next story or suggest next command
```

## Agile Terminology

Autodev uses standard agile terminology:

| Term | Description |
|------|-------------|
| **Epic** | Overall project goal — what we're building |
| **Story** | A vertical slice delivering user value (model + API + UI) |
| **Task** | An executable unit within a story |
| **Subtask** | Atomic work items within a task |

**Vertical slices** mean each Story is complete — it includes the data model, API layer, and UI component together. Stories are independent and can be worked on in parallel.

## State Files

| File | Purpose |
|------|---------|
| `.autodev/EPIC.md` | Epic definition with goal and must-haves |
| `.autodev/STORIES.md` | Story breakdown with status |
| `.autodev/STATE.md` | Current state and decisions |
| `.autodev/stories/N-*/{N}-{M}-TASK.md` | Executable task plans |
| `.autodev/stories/N-*/{N}-{M}-SUMMARY.md` | Execution summaries |

## Usage Example

```bash
# Start a new epic
/autodev-epic "User authentication system"

/autodev
# → Shows: /autodev-plan 1

/autodev-plan 1
# → Asks questions about implementation
# → Creates {1}-CONTEXT.md and {1}-{01,02}-TASK.md

/autodev-execute 1
# → Executes tasks in waves
# → Reports manual commit needed

/autodev-verify 1
# → Presents UAT items
# → User marks pass/fail

/autodev
# → Advances to next story or suggests next command
```

## Statusline

The statusline shows real-time context window usage and current working directory:

```
dirname │ ctx: ████████░░ 62%
```

**What it shows:**
- **Directory name** — Current working directory (basename)
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
