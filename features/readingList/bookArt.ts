const palettes = [
	{
		accent: "from-[#f4c4a8] to-[#d98b63]",
		background: "#f4c4a8",
		foreground: "#7d4f38",
	},
	{
		accent: "from-[#c7d8ff] to-[#7994d6]",
		background: "#c7d8ff",
		foreground: "#36519e",
	},
	{
		accent: "from-[#d3efce] to-[#8dc37a]",
		background: "#d3efce",
		foreground: "#4b6f3c",
	},
	{
		accent: "from-[#f6d7e4] to-[#d27da0]",
		background: "#f6d7e4",
		foreground: "#a3496b",
	},
	{
		accent: "from-[#d7d0ff] to-[#b1a0f0]",
		background: "#d7d0ff",
		foreground: "#5e4db2",
	},
	{
		accent: "from-[#d7ecef] to-[#8fc0ca]",
		background: "#d7ecef",
		foreground: "#31606d",
	},
] as const;

export function buildBookArt(seed: string) {
	const index = hashSeed(seed) % palettes.length;
	const palette = palettes[index];

	return {
		accent: palette.accent,
		cover: buildCover(seed, palette.background, palette.foreground),
	};
}

function buildCover(title: string, background: string, foreground: string) {
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
      <text x="86" y="170" fill="${foreground}" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="700" letter-spacing="4">SEARCH RESULT</text>
      <text x="86" y="890" fill="${foreground}" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="700">${safeTitle}</text>
      <text x="86" y="962" fill="${foreground}" font-family="Arial, Helvetica, sans-serif" font-size="28" opacity="0.88">Book preview</text>
    </svg>
  `)}`;
}

function hashSeed(seed: string) {
	let hash = 0;

	for (let index = 0; index < seed.length; index += 1) {
		hash = (hash << 5) - hash + seed.charCodeAt(index);
		hash |= 0;
	}

	return Math.abs(hash);
}
