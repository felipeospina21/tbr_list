"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Book = {
  id: string;
  title: string;
  author: string;
  pages: number;
  description: string;
  cover: string;
  accent: string;
};

const initialBooks: Book[] = [
  {
    id: "the-quiet-storm",
    title: "The Quiet Storm",
    author: "Mara Ellis",
    pages: 384,
    description:
      "A reflective literary novel about returning home, unresolved grief, and the people who help us name what changed.",
    cover: createCover("The Quiet Storm", "#f4c4a8", "#7d4f38"),
    accent: "from-[#f4c4a8] to-[#d98b63]",
  },
  {
    id: "after-midnight-letters",
    title: "After Midnight Letters",
    author: "Jonah Reed",
    pages: 272,
    description:
      "An intimate epistolary story built from unsent letters, late-night confessions, and the long distance between two versions of yourself.",
    cover: createCover("After Midnight Letters", "#c7d8ff", "#36519e"),
    accent: "from-[#c7d8ff] to-[#7994d6]",
  },
  {
    id: "the-garden-archive",
    title: "The Garden Archive",
    author: "Leila Navarro",
    pages: 448,
    description:
      "A wide-ranging blend of memoir and nature writing that traces memory through plants, seasons, and the places we try to keep alive.",
    cover: createCover("The Garden Archive", "#d3efce", "#4b6f3c"),
    accent: "from-[#d3efce] to-[#8dc37a]",
  },
  {
    id: "signal-in-the-wood",
    title: "Signal in the Wood",
    author: "Tariq Holt",
    pages: 336,
    description:
      "A tightly paced mystery about missing hikers, local folklore, and the stories a town tells to protect itself.",
    cover: createCover("Signal in the Wood", "#f6d7e4", "#a3496b"),
    accent: "from-[#f6d7e4] to-[#d27da0]",
  },
];

function createCover(title: string, background: string, foreground: string) {
  const safeTitle = title.replaceAll("&", "&amp;");

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1080" role="img" aria-label="${safeTitle}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${background}" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.2" />
        </linearGradient>
        <radialGradient id="glow" cx="30%" cy="22%" r="75%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="720" height="1080" rx="52" fill="url(#bg)" />
      <rect x="46" y="46" width="628" height="988" rx="38" fill="none" stroke="#ffffff" stroke-opacity="0.45" stroke-width="4" />
      <circle cx="560" cy="170" r="170" fill="url(#glow)" />
      <path d="M108 842c74-42 136-97 186-169 56-81 90-156 164-243 51-60 119-111 154-132" fill="none" stroke="${foreground}" stroke-width="14" stroke-linecap="round" stroke-opacity="0.8" />
      <path d="M136 874c85-25 161-79 220-152 52-64 100-150 162-220 44-50 96-89 134-110" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-opacity="0.5" />
      <text x="86" y="170" fill="${foreground}" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="700" letter-spacing="4">MOCK COVER</text>
      <text x="86" y="890" fill="${foreground}" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="700">${safeTitle}</text>
      <text x="86" y="962" fill="${foreground}" font-family="Arial, Helvetica, sans-serif" font-size="28" opacity="0.88">Reading list preview</text>
    </svg>
  `)}`;
}

export default function Home() {
  const [books, setBooks] = useState(initialBooks);

  const totalPages = useMemo(
    () => books.reduce((sum, book) => sum + book.pages, 0),
    [books],
  );

  function moveBook(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= books.length) {
      return;
    }

    setBooks((current) => {
      const next = [...current];
      const [book] = next.splice(index, 1);
      next.splice(nextIndex, 0, book);
      return next;
    });
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff9ef_0%,_#f3efe8_44%,_#ebe5dc_100%)] px-4 py-5 text-stone-950 sm:px-6 sm:py-8">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <header className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(96,72,46,0.12)] backdrop-blur sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
            Reading list
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Books to read next
              </h1>
              <p className="max-w-xl text-sm leading-6 text-stone-600 sm:text-base">
                Reorder the list to match your current mood. The cards are
                mobile-first and expand cleanly on larger screens.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:min-w-52">
              <div className="rounded-2xl bg-stone-950 px-4 py-3 text-white">
                <p className="text-xs uppercase tracking-[0.2em] text-white/65">
                  Books
                </p>
                <p className="mt-1 text-2xl font-semibold">{books.length}</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-stone-200">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Pages
                </p>
                <p className="mt-1 text-2xl font-semibold">{totalPages}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-4">
          {books.map((book, index) => {
            const isFirst = index === 0;
            const isLast = index === books.length - 1;

            return (
              <article
                key={book.id}
                className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/90 shadow-[0_18px_50px_rgba(96,72,46,0.1)]"
              >
                <div className="grid gap-0 md:grid-cols-[180px_minmax(0,1fr)]">
                  <div className={`bg-gradient-to-br ${book.accent} p-4 sm:p-5`}>
                    <div className="relative mx-auto aspect-[3/4] w-full max-w-[220px] overflow-hidden rounded-[1.25rem] shadow-lg ring-1 ring-white/50">
                      <Image
                        src={book.cover}
                        alt={`${book.title} front cover`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 180px"
                        unoptimized
                        priority={index === 0}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
                            #{index + 1}
                          </span>
                          <span className="text-xs uppercase tracking-[0.22em] text-stone-400">
                            TBR
                          </span>
                        </div>
                        <h2 className="text-2xl font-semibold tracking-tight">
                          {book.title}
                        </h2>
                        <p className="text-sm text-stone-600">{book.author}</p>
                      </div>
                      <div className="rounded-2xl bg-stone-950 px-3 py-2 text-right text-white">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">
                          Pages
                        </p>
                        <p className="text-lg font-semibold">{book.pages}</p>
                      </div>
                    </div>

                    <p className="text-sm leading-6 text-stone-700 sm:text-[15px]">
                      {book.description}
                    </p>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => moveBook(index, -1)}
                        disabled={isFirst}
                        className="inline-flex h-11 items-center justify-center rounded-full bg-stone-950 px-4 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400 sm:flex-1"
                      >
                        Move up
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBook(index, 1)}
                        disabled={isLast}
                        className="inline-flex h-11 items-center justify-center rounded-full border border-stone-200 bg-white px-4 text-sm font-medium text-stone-900 transition disabled:cursor-not-allowed disabled:text-stone-300 sm:flex-1"
                      >
                        Move down
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
