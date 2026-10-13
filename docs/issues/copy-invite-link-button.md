# Copy Invite Link Button

## Description
## User Story
As a signed-in user, I want to copy the current page's URL to my clipboard with one click so that I can quickly share it with others.

## Edge Cases
- Clipboard API unavailable in the browser → error toast, no fallback.
- The copy call itself throws/rejects (e.g. permission denied) → same error toast treatment as "unavailable."

## Out of Scope
- A new public pre-auth landing page — this ships on the existing signed-in home feed only.
- A manual-copy fallback (e.g. a selectable text field) when the Clipboard API is unavailable.
- Any sharing mechanism beyond copying the link (no native share sheet, no social share buttons).

## Acceptance Criteria
- A button is visible on the signed-in home feed that, when clicked, copies the current page's URL to the clipboard.
- On success, a toast confirms the link was copied.
- On failure (Clipboard API unavailable or the copy attempt throws), an error toast is shown instead.
- No other visible UI change results from a successful copy — the toast is the only confirmation.

## Priority
low

## Status
done

## Resolution
Implemented on the signed-in home feed and QA-tested (happy path, both error branches, mobile/desktop widths) with no bugs found.
