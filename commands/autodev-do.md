---
name: autodev:do
description: Route freeform text to the right autodev command automatically
argument-hint: "<description of what you want to do>"
allowed-tools:
  - Read
  - Bash
  - AskUserQuestion
---

<objective>
Analyze freeform natural language input and dispatch to the most appropriate autodev command. Smart dispatcher — matches intent to the best command, confirms the match, then hands off.
</objective>

<process>

<step name="validate">
If `$ARGUMENTS` is empty, ask:
```
What would you like to do? Describe the task and I'll route it to the right command.
```
Wait for response before continuing.
</step>

<step name="route">
Evaluate `$ARGUMENTS` against these routing rules. Apply the **first matching** rule:

| If the text describes... | Route to | Why |
|--------------------------|----------|-----|
| A small, trivial task: fix typo, config change, small refactor | `/autodev-fast` | No planning overhead needed |
| Checking progress, status, "where am I" | `/autodev-progress` | Status check |
| A complex task: refactoring, multi-file architecture | `/autodev-plan` | Needs full planning cycle |
| Planning a specific phase | `/autodev-plan <phase>` | Direct planning request |
| Executing a phase | `/autodev-execute <phase>` | Direct execution request |
| A review or verification | `/autodev-verify` | Needs verification |
| Starting a new scope | `/autodev-scope` | Scope creation |
| Bug investigation | Use `/autodev-execute` with bug-fixing approach | Needs execution |

**Ambiguity handling:** If text could match multiple routes, ask the user:
```
"{description}" could be:
1. /autodev-fast — Quick inline execution (if small and clear)
2. /autodev-plan — Full planning cycle (if complex)

Which approach fits better?
```
</step>

<step name="display">
Show the routing decision:

```
**Input:** {first 80 chars of $ARGUMENTS}
**Routing to:** /autodev-{command}
**Reason:** {one-line explanation}
```
</step>

<step name="dispatch">
Invoke the chosen command, passing `$ARGUMENTS` as args.
After invoking, stop. The dispatched command handles everything from here.
</step>

</process>

<success_criteria>
- [ ] Input validated (not empty)
- [ ] Intent matched to exactly one autodev command
- [ ] Ambiguity resolved via user question (if needed)
- [ ] Routing decision displayed before dispatch
- [ ] Command invoked with appropriate arguments
- [ ] No work done directly — dispatcher only
</success_criteria>
