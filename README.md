# R10-Xtreme

Next.js (App Router) site for IEEE R10-Xtreme. Pulls events from the IEEE
vTools Events API, keeps only the ones tagged `#IEEEXtreme`, and renders each one's
photo, title, description, hashtags, section, Student Branch, and a
**Register now** button.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## How the events feed works

- `lib/vtools.ts` calls the vTools Events List endpoint
  (`/RST/events/api/public/v8/events/list`), server-side, and revalidates
  every 15 minutes (ISR) so you're not hammering vTools on every visit.
- Events are kept only if one of their hashtags (or a `#word` found in the
  description, as a fallback) matches `#IEEE` (case-insensitive).
- `app/api/events/route.ts` exposes that as `/api/events`, which the client
  component `components/EventsSection.tsx` calls on mount, showing a
  skeleton grid (`EventCardSkeleton.tsx`) while the request is in flight,
  and a friendly empty/error state otherwise.

### ⚠️ Field-mapping note

The IEEE docs we had access to fully documented the `/countries/list` and
`/categories/list` responses (JSON:API-style: `{ data: [{ attributes: {...} }] }`)
but not the exact `/events/list` schema. `normalizeEvent()` in `lib/vtools.ts`
therefore checks several likely attribute names (`photo_url` / `image_url` /
`banner_url`, `registration_url` / `url`, `hashtags` / `tags`, etc.). **Once
you can see one real event payload**, open `lib/vtools.ts` and tighten those
lookups to the actual field names — everything else in the app will keep
working unchanged.

### Scoping to your Section/Branch only

The public `events/list` endpoint returns the global vTools feed; there's no
documented query param to scope it to one Section or Student Branch. IEEE
mentions "Custom Feeds" for that (contact vTools staff to request one). Once
you have that URL, set it as `VTOOLS_EVENTS_URL` in your environment and no
code changes are needed.

## Deploying to Vercel

1. Push this project to a GitHub repo.
2. Import it in [Vercel](https://vercel.com/new).
3. Add the environment variables from `.env.example` in the Vercel project
   settings (Production + Preview).
4. Deploy — the events feed refreshes automatically via ISR (every 15 min).

## Project structure

```
app/
  page.tsx              # assembles all sections
  api/events/route.ts    # server route that returns filtered #IEEE events
  loading.tsx             # full-page loader for the initial route
components/
  Navbar, Hero, About, Rules, Guide, Contact, Footer
  EventsSection.tsx        # client-side fetch + loading/error/empty states
  EventCard.tsx             # photo, title, description, hashtags, register CTA
  EventCardSkeleton.tsx      # loading placeholder
  TeamSection.tsx              # committee avatars (data/team.ts)
lib/vtools.ts             # API client + response normalization
data/team.ts               # R10 Lead / Co-Leads roster
```

## Team

Edit `data/team.ts` to update the committee roster or add an `avatar` image
path (drop the image in `public/` first). Members without an avatar show an
initials badge automatically.
