## CAPES — Fandom Social Platform (MVP/POC)

CAPES is an event‑centric social app for fans of games, anime, movies, and comics to discover local events and meet people in real life. It focuses on simple discovery and RSVP flows over heavy social features, so organizers can list events quickly and fans can find what’s happening nearby. Profiles capture just enough context (name, city, interests) to personalize results and enable lightweight communities.

This repository contains the Next.js (TypeScript) frontend and serverless API routes for the MVP defined in the PRD. It integrates with an external Event API for event data/RSVPs and uses Supabase for email/password authentication and minimal profile storage.

What users can do:
- Browse and filter upcoming fandom events by city, date, and tags
- View event details and RSVP; receive confirmation and reminder emails (MVP)
- Create and join public communities around specific fandoms
- Report inappropriate content and block users for safety
See also:
- PRD: ../prd-fandom-social-platform.md
- Tasks checklist: ../tasks/tasks-prd-fandom-social-platform.md

### Features (MVP scope)
- Auth and profiles: email/password (Supabase), display name, avatar, interests, city
- Events: create, list, filter by city/date/fandom; event detail; RSVP/un-RSVP
- Communities (lightweight): create/join public communities, member list
- Safety: report content/user, block user, basic admin review queue
- Privacy: profile and event visibility controls

### Tech Stack
- Next.js App Router (React Server Components), TypeScript
- Tailwind CSS v4, shadcn/ui primitives (Radix under the hood)
- Supabase Auth (email/password), minimal profile storage
- Serverless API routes (proxy to external Event API)
- Bun as the package runner

---

## Getting Started

### Prerequisites
- Bun installed: https://bun.sh (recommended ≥ 1.1)
- Node.js (optional, not required to run, but helpful for tooling): ≥ 18
- Supabase project with email/password auth enabled

### 1) Install dependencies
```bash
bun install
```

### 2) Configure environment variables
Create a `.env.local` in `capes/` based on the template below.

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE=

# External Event API
EVENT_API_BASE_URL=https://fastapi-backend-e0m2.onrender.com
EVENT_API_KEY=

# Email provider (optional for MVP if using Supabase emails only)
EMAIL_PROVIDER=
EMAIL_API_KEY=
EMAIL_FROM=
```

Notes:
- `EVENT_API_BASE_URL` defaults to the value in the PRD; keep it overrideable.
- If the external API does not require an API key, leave `EVENT_API_KEY` empty.

### 3) Run the app
```bash
# Dev server (Turbopack)
bun run dev

# Type-check and lint (recommended during development)
bun run type-check
bun run lint
```

Build and start:
```bash
bun run build
bun run start
```

---

## Project Structure

Key directories and files:
- `app/` — App Router pages, layouts, and server actions
- `components/` — UI primitives and composite components (shadcn/ui based)
- `lib/` — providers, utilities, and client helpers (e.g., Supabase)
- `supabase/` — Supabase SSR helpers and middleware
- `auth/` and `app/auth` — authentication actions and routes
- `public/` — static assets
- `middleware.ts` — auth/session-related and routing middleware
- `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `tsconfig.json` — tooling

Refer to the task checklist for suggested additional files that may be added: ../tasks/tasks-prd-fandom-social-platform.md

---

## Environment & Configuration

Add a `.env.local` as described above. Common variables:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE`
- `EVENT_API_BASE_URL`, `EVENT_API_KEY`
- `EMAIL_PROVIDER`, `EMAIL_API_KEY`, `EMAIL_FROM`

Tailwind v4 is already configured via PostCSS. shadcn/ui primitives reside under `components/ui/*`.

---

## Scripts

From `package.json`:
- `bun run dev` — start Next.js dev server (Turbopack)
- `bun run build` — production build (Turbopack)
- `bun run start` — start production server
- `bun run lint` — run ESLint
- `bun run lint:fix` — auto-fix lint issues
- `bun run type-check` — TypeScript type checking

---

## Authentication (Supabase)

- Enable email/password in your Supabase project
- Configure SMTP (Supabase-managed email is sufficient for MVP)
- Provide the three Supabase env vars
- The app uses SSR helpers under `supabase/` and auth actions under `auth/`

Route protection: certain pages should redirect unauthenticated users. See `middleware.ts` and auth actions.

---

## External Event API Integration

- Base URL: `https://fastapi-backend-e0m2.onrender.com`
- Docs: `https://fastapi-backend-e0m2.onrender.com/docs`
- Intended endpoints (subject to API docs):
  - GET `/events` — list with filters: `city`, `start_date`, `end_date`, `tag`
  - GET `/events/{id}` — event detail
  - POST `/events` — create event (organizers)
  - POST `/events/{id}/rsvp` — RSVP/un-RSVP (or a local workaround if not available)

Integration strategy:
- Frontend calls our Next.js API routes; server routes proxy to the external API
- Cache minimal event metadata locally if needed; respect external API as source of truth
- On RSVP success, optionally send confirmation email (provider TBD)

---

## Development Notes

- UI components: see `components/ui/*` and `components/navigation.tsx`
- Global providers and theming: `lib/providers.tsx`
- Profile context and helpers: `lib/profileContext.tsx`, `lib/profile.ts`
- Supabase helpers: `supabase/*`
- App pages of interest: `app/page.tsx`, `app/login/page.tsx`, `app/complete-profile/*`

Quality:
- Prefer TypeScript across the codebase
- Run `bun run type-check` and `bun run lint` before commits
- Follow component composition and accessibility best practices (Radix UI)

---

## Roadmap & Tasks

The living task list is maintained here:
- ../tasks/tasks-prd-fandom-social-platform.md

High-level phases (from the PRD):
- Phase 0: design system, schema, auth skeleton, event list/create
- Phase 1: event detail/RSVP, email confirmations, community pages
- Phase 2: reporting/blocking, admin queue, polish, soft launch

---

## Contributing

Contributions are welcome. Please:
- Keep changes scoped and well-typed
- Add or update small unit tests where applicable (e.g., lib utilities)
- Ensure `bun run type-check` and `bun run lint` pass locally

---

## License

Specify your license here (e.g., MIT). If omitted, the project is proprietary by default.

