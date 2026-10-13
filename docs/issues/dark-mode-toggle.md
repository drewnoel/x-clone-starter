# Dark Mode Toggle

## Description
## User Story
As a user (signed in or not), I want to switch between light, dim, and dark display modes so that I can read the app comfortably in my preferred lighting/contrast and have that choice remembered.

## Edge Cases
- No stored preference yet → light mode.
- Stored value is corrupted or unrecognized → fall back to light mode rather than erroring.
- Rapid mode switching → last selection wins; no flicker or race condition.

## Out of Scope
- Syncing theme preference across devices or accounts — localStorage is per-browser only.
- Automatically following OS-level prefers-color-scheme.
- Per-page or per-component theme overrides.

## Acceptance Criteria
- A visible control lets any user, authenticated or not, choose between light, dim, and dark modes.
- The selected mode persists across page reloads and new sessions via localStorage.
- A first-time visitor with no stored preference sees light mode by default.
- The control's current state visually reflects the active mode.
- Switching modes updates the UI immediately, with no full page reload.

## Priority
low

## Status
done

## Resolution
Theme switcher already existed for signed-in users; added it to the signed-out (_auth) layout too so it meets the "any user, authenticated or not" requirement. Verified both signed-in and signed-out via browser, including persistence and live switching.
