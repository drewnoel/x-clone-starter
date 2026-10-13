# X Clone Starter

A frontend for an X (Twitter)-style app. The API is already deployed — this repo is
frontend-only, living under `src/frontend/`.

Launch Claude Code from the repo root (not from `src/frontend/`) so this file loads.

## Stack

- **React 19** + **Vite** + **TypeScript**
- **TanStack Router** — file-based routing (`src/frontend/src/routes/`)
- **TanStack Query** — server state / data fetching
- **Tailwind CSS v4** + shadcn-style primitives in `src/frontend/src/components/ui/`
- **better-auth** (React client) for authentication
- **react-hook-form** + **zod** (via `@hookform/resolvers`) for forms — see `components/ui/form.tsx`
- **@hugeicons/react** for icons (not lucide or heroicons)
- **Vitest** + `@testing-library/react` for tests

## Structure

```
src/frontend/src/
  routes/          File-based routes (TanStack Router). `_app.tsx` and `_auth.tsx` are
                   pathless layout routes — `_app` requires a signed-in session,
                   `_auth` requires a signed-out one (see their `beforeLoad` guards).
  components/
    ui/            Generic, feature-agnostic primitives (button, dialog, form, ...)
  hooks/           Reusable React hooks
  lib/             Framework-agnostic utilities (auth client, formatting, session query)
  stores/          Client-side state outside React Query, built on TanStack Store (currently: theme)
```

## Conventions

- **Routing**: add a new page by adding a file under `src/frontend/src/routes/`. Auth-gated
  pages go under `_app/`; the layout at `src/frontend/src/routes/_app.tsx` renders the
  header/nav shared by all of them. `routeTree.gen.ts` is generated — never edit it by hand, it
  regenerates on `pnpm dev`/`pnpm build`.
- **Data fetching**: API calls live in `src/frontend/src/queries/<domain>.ts` (a directory you'll
  create) as plain `fetch` calls wrapped in `queryOptions(...)` (see `lib/session.ts` for the
  pattern). Always pass `credentials: "include"` — auth is cookie-based.
- **Auth**: `lib/auth-client.ts` wraps `better-auth/react`; `lib/session.ts` exposes
  `sessionQueryOptions` for reading the current session via React Query.
- **Env config**: the API base URL is read from `VITE_API_URL` (see
  `src/frontend/.env.example` and `src/frontend/vite.config.ts`'s `/api` proxy) — never hardcode
  the API origin in application code.
- **UI primitives**: `components/ui/` is generated via the **shadcn** CLI on top of **radix-ui**
  — don't hand-write new primitives, add them the same way as the existing ones.
- **Forms**: built with `react-hook-form` + `zod` schemas wired through `components/ui/form.tsx`
  (see the sign-in/sign-up routes for the pattern).

## Workflow

- Run `pnpm lint` and fix any TypeScript errors before considering any task complete, and
  prefer editing existing components over creating new ones.

## Issue tracking

- Tracked work items live in `docs/issues/<slug>.md` as markdown, with a `status` field that
  goes from `open` to `done`. File one with `/create-issue`, resolve it with `/close-issue`.

## Workshop note

- The API is shared by everyone in the room. When testing in the browser (including via
  MCP browser tools), sign in with your own account — sign up if you haven't — rather than
  the shared fallback test account from `workshop.html`. Likes, retweets, and follows are
  per-account state shared live with whoever else is using that account.

## Commands (run from `src/frontend/`)

- `pnpm dev` — start the dev server
- `pnpm build` — typecheck + production build
- `pnpm lint` — ESLint
- `pnpm test` — Vitest
