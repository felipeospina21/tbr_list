import { readingListSlugSchema } from "../schemas/readingList.schema";
import {
	DEFAULT_READING_LIST_SLUG,
	type ReadingListSlug,
} from "../types/readingList";

interface InitialListSlugInput {
	listSlug?: string | string[];
}

export function getInitialListSlug({
	listSlug,
}: InitialListSlugInput): ReadingListSlug {
	const requestedListSlug = Array.isArray(listSlug) ? listSlug[0] : listSlug;
	const parsedListSlug = readingListSlugSchema.safeParse(requestedListSlug);

	return parsedListSlug.success
		? (parsedListSlug.data as ReadingListSlug)
		: DEFAULT_READING_LIST_SLUG;
}
