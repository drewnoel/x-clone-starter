---
name: create-issue
description: Turn a feature, bug, or task into a tracked work item — creates a markdown issue file at docs/issues/<slug>.md with a title, description, acceptance criteria, priority, and status. Use whenever the user describes a feature, bug, or task that should become a tracked issue, or runs /create-issue.
argument-hint: <title> <description>
arguments: [title, description]
allowed-tools: Write(docs/issues/**)
---

# Create issue

Turn `$title` and `$description` into a tracked work item at `docs/issues/<slug>.md`.

## 1. Generate the slug
From `$title`:
1. Lowercase it.
2. Replace every run of characters that are not `a-z` or `0-9` with a single hyphen.
3. Strip any leading/trailing hyphens.

Example: "Dark Mode Toggle" → `dark-mode-toggle`.

## 2. Write the issue file
Target path: `docs/issues/<slug>.md` (the `Write` tool creates the `docs/issues/` directory automatically if it doesn't exist yet — don't run `mkdir` or any other tool).

Content:

```markdown
# <title>

## Description
<description>

## Acceptance Criteria
- <2–5 concrete, testable criteria you derive from the description>

## Priority
<low|medium|high — use your judgment from the description; default to medium if nothing suggests otherwise>

## Status
open
```

## 3. Report back
Print exactly this shape (fill in the real path):

```
Created docs/issues/<slug>.md

Next steps:
- Implement the issue we just created → docs/issues/<slug>.md
- Create another issue
```

Don't add anything else — no extra commentary, no restating the file contents.
