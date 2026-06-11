import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";

import { getReadingListQueryKey } from "../queries/readingListQueryKeys";
import { ReadingList } from "../ReadingList";
import { getReadingListStore } from "../server/storage";
import {
	READING_LIST_DEFINITIONS,
	type ReadingListSlug,
} from "../types/readingList";

interface ReadingListHydrationProps {
	initialListSlug: ReadingListSlug;
	userId: string;
}

export async function ReadingListHydration({
	initialListSlug,
	userId,
}: ReadingListHydrationProps) {
	const store = await getReadingListStore();
	const queryClient = new QueryClient();
	const snapshots = await Promise.all(
		READING_LIST_DEFINITIONS.map(async (list) => ({
			slug: list.slug,
			snapshot: await store.getBooks(userId, list.slug),
		})),
	);

	for (const { slug, snapshot } of snapshots) {
		queryClient.setQueryData(getReadingListQueryKey(slug), snapshot);
	}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ReadingList initialListSlug={initialListSlug} />
		</HydrationBoundary>
	);
}
