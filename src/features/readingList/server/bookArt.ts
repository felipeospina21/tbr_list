import { createHash } from "node:crypto";

const PALETTE = [
	["#f5d0fe", "#8b5cf6"],
	["#fecaca", "#dc2626"],
	["#fed7aa", "#ea580c"],
	["#bfdbfe", "#2563eb"],
	["#bbf7d0", "#16a34a"],
	["#fde68a", "#ca8a04"],
] as const;

export function buildBookArt(title: string) {
	const seed = hashSeed(title);
	const palette = PALETTE[seed % PALETTE.length];

	return {
		cover: buildCover(title, palette[0], palette[1]),
		accent: `from-[${palette[0]}] to-[${palette[1]}]`,
	};
}

function hashSeed(input: string) {
	return createHash("sha256").update(input).digest().readUInt32BE(0);
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
      <text x="86" y="170" fill="${foreground}" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="700" letter-spacing="4">MOCK COVER</text>
      <text x="86" y="890" fill="${foreground}" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="700">${safeTitle}</text>
      <text x="86" y="962" fill="${foreground}" font-family="Arial, Helvetica, sans-serif" font-size="28" opacity="0.88">Reading list preview</text>
    </svg>
  `)}`;
}
