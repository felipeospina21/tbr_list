This is a [Next.js](https://nextjs.org) reading list app.

## Getting Started

First, copy the example env file if you want Google Books to use an API key:

```bash
cp .env.example .env.local
```

Set `HARDCOVER_API_KEY` in `.env.local` to use Hardcover as the primary book search provider. Set `GOOGLE_BOOKS_API_KEY` to make the final Google Books fallback more reliable. The app searches Hardcover first when configured, then Open Library, then Google Books.

Set `DATABASE_URL` to a Neon connection string for the reading list database. If you deploy on Vercel with a Neon or Postgres integration, the app also accepts `POSTGRES_URL_NON_POOLING`, `POSTGRES_URL`, or `NEON_DATABASE_URL`.

The normalized database layout and table relationships are documented in [`docs/database-schema.md`](/home/felipe/projects/tbr_list/docs/database-schema.md).

The app now uses Google sign-in through NextAuth/Auth.js. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` in `.env.local`, and register `http://localhost:3000/api/auth/callback/google` as the local OAuth callback URL in Google Cloud Console.

Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The route stays thin in `app/page.tsx`; the reading-list feature lives in `features/readingList/`.

## Learn More

To learn more about Next.js, take a look at these resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out the [Next.js GitHub repository](https://github.com/vercel/next.js) if you want more context.
