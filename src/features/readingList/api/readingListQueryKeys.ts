import { ReadingListType } from "@/features/readingList/types";

export const READING_LIST_QUERY_KEY = ["reading-list"] as const;

export function getReadingListQueryKey(readingListType: ReadingListType) {
	return [...READING_LIST_QUERY_KEY, readingListType] as const;
}
