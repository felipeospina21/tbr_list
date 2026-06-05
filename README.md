This is a [Next.js](https://nextjs.org) reading list app.

## Getting Started

First, copy the example env file if you want Google Books to use an API key:

```bash
cp .env.example .env.local
```

Set `GOOGLE_BOOKS_API_KEY` in `.env.local` to make Google Books requests more reliable. The app will still fall back to Open Library automatically if Google fails or returns no results.

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
