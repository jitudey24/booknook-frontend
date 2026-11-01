<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## What this repo is

Single-package Next.js 16 (App Router) client for BookNook. The backend is a **separate Express API not in this repo** — almost every page is `"use client"` and fetches from `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5000`). The only route handler is `src/app/api/auth/[...all]/route.ts` (better-auth). Pages show error states unless the backend is running.

`next.config.ts` enables `cacheComponents`, `partialPrefetching`, and `reactCompiler` — these change data-fetching and rendering rules; check `node_modules/next/dist/docs/` before writing page code.

## Commands

- `npm run dev` / `npm run build` / `npm run start`
- `npm run lint` — flat-config ESLint 9 (not `next lint`)
- **No test suite and no typecheck script.** Verify types with `npx tsc --noEmit`.
- Before finishing: `npm run lint` → `npx tsc --noEmit` → `npm run build`.

## Environment (`.env`, gitignored — never commit; copy `.env.example`)

- Required: `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_API_URL`
- `MONGODB_DB=BookNook` (capital B/N) must be set explicitly — the code's default `booknook` is a **different, empty database**. `BookNook-Server/.env` uses the same name; all real users live there.
- Optional: `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` (Google sign-in), `NEXT_PUBLIC_IMGBB_API_KEY` (cover upload on `/add-book`; upload is disabled without it)
- A missing `MONGODB_URI` makes `src/lib/mongodb.ts` throw at import, so **every** auth endpoint 500s. This exact mismatch (`MONGODB_URL` vs `MONGODB_URI`) caused a real production-style outage — keep names exact.
- Production values live in the Vercel dashboard, not in the repo.

## Auth (better-auth + MongoDB + JWT plugin)

- Server config: `src/lib/auth.ts` · client: `src/lib/auth-client.ts` · handler: `src/app/api/auth/[...all]/route.ts`
- To call the backend as the logged-in user: `const { data } = await authClient.token()` then `Authorization: Bearer ${data.token}` (pattern in `src/app/my-books/page.tsx`).
- `trustedOrigins` in `src/lib/auth.ts` is hardcoded — the deployed origin must be added there or auth redirects fail in production.
- Protected pages: read `authClient.useSession()`, wait for `isPending` before redirecting, then `router.replace("/login?redirect=...")` (see `src/app/my-books/page.tsx`).

## UI stack quirks

- Tailwind CSS 4, **CSS-first config in `src/app/globals.css`** — there is no `tailwind.config`.
- shadcn style `base-nova` built on **`@base-ui/react`, not Radix** (`components.json`). Adding components: `npx shadcn add ...`.
- React Compiler is on — skip manual `useMemo`/`useCallback`/`memo`.
- Path alias: `@/*` → `src/*`.
- Toasts: react-hot-toast `<Toaster>` is already mounted in `src/app/layout.tsx`.

## Conventions

- Backend API responses follow `{ success, message, data }`.
- README's structure/routes table is stale (e.g., `/profile` exists but isn't listed) — trust the code under `src/app/`.
