import type { ReadingListSlug } from "../types/readingList";

export const READING_LIST_QUERY_KEY = ["reading-list"] as const;

export function getReadingListQueryKey(listSlug: ReadingListSlug) {
	return [...READING_LIST_QUERY_KEY, listSlug] as const;
}
