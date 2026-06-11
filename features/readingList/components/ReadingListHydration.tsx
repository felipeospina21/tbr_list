import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";

import { getReadingListQueryKey } from "../queries/readingListQueryKeys";
import { ReadingList } from "../ReadingList";
import { getReadingListStore } from "../server/storage";
import type { ReadingListSlug } from "../types/readingList";

interface ReadingListHydrationProps {
	accountLabel: string;
	initialListSlug: ReadingListSlug;
	userId: string;
}

export async function ReadingListHydration({
	accountLabel,
	initialListSlug,
	userId,
}: ReadingListHydrationProps) {
	const store = await getReadingListStore();
	const initialSnapshot = await store.getBooks(userId, initialListSlug);
	const queryClient = new QueryClient();

	queryClient.setQueryData(
		getReadingListQueryKey(initialListSlug),
		initialSnapshot,
	);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ReadingList
				accountLabel={accountLabel}
				initialListSlug={initialListSlug}
			/>
		</HydrationBoundary>
	);
}
