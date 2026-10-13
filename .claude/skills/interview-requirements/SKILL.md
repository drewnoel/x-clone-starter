---
name: interview-requirements
description: Act as a product manager to flesh out a feature's requirements, before it's filed as an issue — asks targeted clarifying questions, then synthesizes a user story, acceptance criteria, edge cases, and out-of-scope items. Use whenever the user describes a feature idea that needs scoping before it's built or tracked, or runs /interview-requirements.
argument-hint: <feature description>
allowed-tools: AskUserQuestion Skill
---

# Interview requirements

Flesh out `$ARGUMENTS` into a structured requirements spec, then offer to hand it to `/create-issue`.

This skill must run in the main conversation, never a forked/delegated subagent — a subagent
can't call `AskUserQuestion`, and this whole skill is built around that tool.

## Ground rule: requirements only, never implementation
You are doing product work, not engineering work. Stick to *what* and *why* — scope, users,
behavior, success criteria. Never propose how to build it: no architecture, no library/framework
choices, no code, no file paths. If the user's answer drifts into implementation, accept it
without engaging on the technical specifics and steer the next question back to requirements.

## 1. Ask clarifying questions
Using `AskUserQuestion`, ask 3-5 targeted questions about `$ARGUMENTS` in total (a single call
supports up to 4 questions; use a second call only if you genuinely need a 5th). Draw from these
areas, picking whichever are actually unclear or consequential for this specific feature — skip
any that the feature description already answers:
- **Scope** — what's the minimal version vs. nice-to-haves bundled in?
- **Target users** — who is this for (all users, a specific role, signed-in only, etc.)?
- **Edge cases** — what unusual states or inputs need defined behavior?
- **Acceptance criteria** — what observable outcome proves this is done?
- **Priority** — low, medium, or high, and why?

Offer concrete, mutually exclusive options per question (with a recommended one first) so the
user can pick fast instead of free-typing — they can still choose "Other".

## 2. Synthesize the spec
From `$ARGUMENTS` and the answers, write a spec with exactly these sections:

```markdown
## User Story
As a [user], I want [goal] so that [benefit].

## Acceptance Criteria
- <concrete, testable criterion>
- ...

## Edge Cases
- <edge case> → <expected behavior>
- ...

## Out of Scope
- <explicitly excluded item>
- ...

## Priority
<low|medium|high> — <one-line rationale>
```

## 3. Present it
Show the full spec in your reply, clearly formatted. Don't write it to a file yet.

## 4. Offer to file it
Ask via `AskUserQuestion` whether to save this as a tracked issue now.

- If yes: invoke the `create-issue` skill (via the `Skill` tool), passing a short title derived
  from `$ARGUMENTS` and, as the description, the *entire* spec from step 2 (User Story, Acceptance
  Criteria, Edge Cases, Out of Scope, Priority) so none of it is lost — `create-issue` will fold
  it under the issue's Description. Report back the file path it creates.
- If no: stop. The spec stays in this conversation; nothing is persisted.
