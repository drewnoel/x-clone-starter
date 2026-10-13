---
name: close-issue
description: Mark a tracked issue in docs/issues/ as resolved by slug or part of its title — flips status from open to done, appends a resolution note and optional commit reference, and reports which issues are still open. Manual invocation only.
argument-hint: <slug-or-title-fragment> [commit-ref]
allowed-tools: Read(docs/issues/**) Edit(docs/issues/**) Glob(docs/issues/**) AskUserQuestion
---

# Close issue

Raw arguments: `$ARGUMENTS`

Interpret `$ARGUMENTS` yourself (there's no rigid positional split): it's an issue identifier
(a slug like `dark-mode-toggle`, or a fragment of a title like `dark mode`), optionally followed
by a commit reference (a short git SHA — hex-ish, no spaces). If the last token looks like a
commit SHA and the rest still plausibly identifies an issue, treat it as the commit ref; otherwise
treat the whole string as the identifier with no commit ref.

## 1. Find the matching issue
1. `Glob` `docs/issues/*.md` to see everything that exists.
2. Slugify the identifier the same way `/create-issue` does (lowercase, non-alphanumeric runs →
   single hyphen, strip leading/trailing hyphens).
3. Exact match: if `docs/issues/<slug>.md` exists, that's your one candidate — skip to step 2.
4. Otherwise, read each file's title (the `# ` heading) and filename slug. A file is a candidate
   if its slug *contains* the slugified identifier as a substring, or its title case-insensitively
   contains the identifier text.
5. **Zero candidates**: say so plainly (name what you searched for) and stop. No edit.
6. **One candidate**: proceed.
7. **Several candidates**: use `AskUserQuestion` to list each one (title + current status) and let
   the user pick, with an option to back out instead of guessing.

## 2. Update the chosen file
- If its `## Status` already reads `done`, don't edit it — note that it's already closed and stop.
- Otherwise, in one edit: flip `## Status` from `open` to `done`, and append a `## Resolution`
  section after it with a short one-line note you write summarizing the close. If a commit
  reference was given, add a line `Commit: <ref>` under the note.

## 3. Report back
On a real close, print:
1. The path you updated.
2. A short "Still open" summary: `Glob` + read the status of every other file in `docs/issues/`
   and list the ones still `open` (title + slug). If none remain, say so.

On an already-closed match or a missing/ambiguous-and-declined match, say so in one line and stop
— no "Still open" summary needed there.

Don't add anything else — no extra commentary, no restating full file contents.
