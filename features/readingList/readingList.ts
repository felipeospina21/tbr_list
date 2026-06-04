export type Book = {
	id: string;
	title: string;
	author: string;
	pages: number;
	description: string;
	cover: string;
	accent: string;
};

export const initialBooks: Book[] = [
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

export function totalPages(books: readonly Book[]) {
	return books.reduce((sum, book) => sum + book.pages, 0);
}

export function moveBookInList(
	books: readonly Book[],
	index: number,
	direction: -1 | 1,
) {
	const nextIndex = index + direction;

	if (nextIndex < 0 || nextIndex >= books.length) {
		return books;
	}

	const next = [...books];
	const [book] = next.splice(index, 1);
	next.splice(nextIndex, 0, book);
	return next;
}

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
