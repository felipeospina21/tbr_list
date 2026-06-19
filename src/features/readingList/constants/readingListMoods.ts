export const READING_LIST_MOODS = [
	"contemplative",
	"hopeful",
	"mysterious",
	"calm",
	"melancholic",
	"tender",
	"tense",
] as const;

export type ReadingListMood = (typeof READING_LIST_MOODS)[number];

export const READING_LIST_MOOD_EMOJI: Record<ReadingListMood, string> = {
	contemplative: "Still",
	hopeful: "Light",
	mysterious: "Moon",
	calm: "Calm",
	melancholic: "Rain",
	tender: "Soft",
	tense: "Edge",
};
