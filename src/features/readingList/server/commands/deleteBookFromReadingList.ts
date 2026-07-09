import { and, eq, inArray, sql } from "drizzle-orm";

import { DbClient, db } from "@/db/drizzle";
import {
	books,
	readingListItems,
	readingLists,
	userBookMoods,
	userReadingSessions,
} from "@/db/schema";

export interface DeleteBookFromReadingListInput {
	userId: string;
	bookId: string;
}

async function countBookReferences(bookId: string, tx: DbClient = db) {
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

export async function deleteBookFromReadingList(
	input: DeleteBookFromReadingListInput,
) {
	return db.transaction(async (tx) => {
		// Remove the current user's list entries and per-book state first.
		await Promise.all([
			tx
				.delete(readingListItems)
				.where(
					and(
						eq(readingListItems.bookId, input.bookId),
						inArray(
							readingListItems.listId,
							tx
								.select({ id: readingLists.id })
								.from(readingLists)
								.where(eq(readingLists.userId, input.userId)),
						),
					),
				),
			tx
				.delete(userReadingSessions)
				.where(
					and(
						eq(userReadingSessions.userId, input.userId),
						eq(userReadingSessions.bookId, input.bookId),
					),
				),
			tx
				.delete(userBookMoods)
				.where(
					and(
						eq(userBookMoods.userId, input.userId),
						eq(userBookMoods.bookId, input.bookId),
					),
				),
		]);

		const references = await countBookReferences(input.bookId, tx);
		const remainingReferences =
			references.readingListItemRefs +
			references.readingSessionRefs +
			references.userBookMoodRefs;

		if (remainingReferences === 0) {
			await tx.delete(books).where(eq(books.id, input.bookId));
		}

		return {
			bookId: input.bookId,
		};
	});
}
