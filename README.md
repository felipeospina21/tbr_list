# tbr_list

A reading-list app for managing the books you want to read (to-be-read), are reading, and have finished. Search for books, add them to lists, and drag them into the order you want. It's installable as a PWA and works offline.

**Live:** https://tbr-list-pied.vercel.app

## Features

- **Book search**: queries Hardcover first (when configured), then falls back to Open Library, then Google Books
- **Reading lists**: organize books into lists and shelves, with a details drawer for each book
- **Drag and drop reordering**: fractional positions, so moving a book updates one row instead of shifting the whole list (see [`reorder.md`](reorder.md))
- **Google sign-in** with NextAuth
- **Offline support**: installable PWA with a service worker (Serwist) and a persisted query cache in IndexedDB
- **Database model** for books, genres, moods, metrics and reading sessions (see [`src/docs/database-schema.md`](src/docs/database-schema.md))

## Tech stack

- [Next.js](https://nextjs.org/) 16, React 19 and TypeScript
- Postgres on [Neon](https://neon.tech/), with Drizzle ORM and migrations
- NextAuth (Auth.js) v4
- TanStack Query with an async-storage persister
- Tailwind CSS 4, shadcn/ui, Radix UI, Vaul and Framer Motion
- Zod, Serwist and Biome

## Getting started

Requires Node and [pnpm](https://pnpm.io/).

```bash
pnpm install
```

Create a `.env.local` file with these variables (names only):

```
DATABASE_URL=              # Neon connection string
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
HARDCOVER_API_KEY=         # optional: enables Hardcover as the primary search
GOOGLE_BOOKS_API_KEY=      # optional: makes the Google Books fallback more reliable
```

- Register `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI in Google Cloud Console.
- If you deploy on Vercel with a Neon or Postgres integration, the app also accepts `POSTGRES_URL_NON_POOLING`, `POSTGRES_URL` or `NEON_DATABASE_URL` in place of `DATABASE_URL`.

```bash
pnpm db:migrate    # Apply database migrations
pnpm dev           # Dev server at http://localhost:3000
pnpm build         # Production build
pnpm start         # Run the production build
pnpm check         # Biome lint and format
pnpm db:generate   # Generate a migration after schema changes
```

## Project structure

```
src/
├── app/             # Routes: reading-app, search, login, offline, API routes
├── features/        # readingList, search and auth (components, server code, schemas)
├── components/      # Shared UI (shadcn) and layout
├── db/              # Drizzle schema and client
├── lib/             # API and error helpers
└── docs/            # Database schema
migrations/          # Drizzle SQL migrations
```
