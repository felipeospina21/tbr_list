import { eq, sql } from "drizzle-orm";

import { DbClient, db } from "@/db/drizzle";
import {
	readingListItems,
	userBookMoods,
	userReadingSessions,
} from "@/db/schema";

export interface BookReferenceCounts {
	readingListItemRefs: number;
	readingSessionRefs: number;
	userBookMoodRefs: number;
}

export async function countBookReferences(
	bookId: string,
	tx: DbClient = db,
): Promise<BookReferenceCounts> {
	const [readingListItemRefs, readingSessionRefs, userBookMoodRefs] =
		await Promise.all([
			tx
				.select({
					count: sql<number>`count(*)`.mapWith(Number),
				})
				.from(readingListItems)
				.where(eq(readingListItems.bookId, bookId)),
			tx
				.select({
					count: sql<number>`count(*)`.mapWith(Number),
				})
				.from(userReadingSessions)
				.where(eq(userReadingSessions.bookId, bookId)),
			tx
				.select({
					count: sql<number>`count(*)`.mapWith(Number),
				})
				.from(userBookMoods)
				.where(eq(userBookMoods.bookId, bookId)),
		]);

	return {
		readingListItemRefs: readingListItemRefs[0]?.count ?? 0,
		readingSessionRefs: readingSessionRefs[0]?.count ?? 0,
		userBookMoodRefs: userBookMoodRefs[0]?.count ?? 0,
	};
}
