import { ReadingListType } from "@/features/readingList/types/readingList";

export const READING_LIST_QUERY_KEY = ["reading-list"] as const;

export function getReadingListQueryKey(listSlug: ReadingListType) {
	return [...READING_LIST_QUERY_KEY, listSlug] as const;
}
