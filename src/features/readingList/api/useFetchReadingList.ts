"use client";

import { useQuery } from "@tanstack/react-query";
import { getReadingListQueryKey } from "./readingListQueryKeys";
import { apiFetch } from "@/lib/api/apiFetch";
import { ReadingListType } from "@/features/readingList/types/readingList";
import { FetchRedingLists } from "@/app/api/reading-list/route";
export { getReadingListQueryKey } from "./readingListQueryKeys";

export async function fetchReadingList(
	listType: ReadingListType,
): Promise<FetchRedingLists> {
	return apiFetch<FetchRedingLists>(`/api/reading-list?type=${listType}`);
}

export function useFetchReadingList(listType: ReadingListType) {
	return useQuery({
		queryKey: getReadingListQueryKey(listType),
		queryFn: () => fetchReadingList(listType),
		refetchOnWindowFocus: false,
		throwOnError: true,
	});
}
