import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";
import {
	readingListItems,
	readingLists,
	userReadingSessions,
} from "@/db/schema";
import { ReadingListType } from "@/features/readingList/types";
import { SearchBook } from "@/features/search/types/search.types";
import { upsertBook } from "./upsertBook";

export type AddBookToReadingListInput = {
	userId: string;
	type: ReadingListType;
	book: SearchBook;
};

export async function addBookToReadingList(input: AddBookToReadingListInput) {
	// 1. Upsert the book into the main books registry
	const book = await upsertBook(input.book, db);

	// 2. Find or create the reading list
	let list = await db.query.readingLists.findFirst({
		where: (lists, { and, eq }) =>
			and(eq(lists.userId, input.userId), eq(lists.type, input.type)),
	});

	if (!list) {
		const [newList] = await db
			.insert(readingLists)
			.values({
				id: crypto.randomUUID(),
				userId: input.userId,
				type: input.type,
				name: input.type === "to_be_read" ? "To Be Read" : input.type,
			})
			.returning();
		list = newList;
	}

	// 3. Check for existence
	const existingItem = await db.query.readingListItems.findFirst({
		where: (items, { and, eq }) =>
			and(eq(items.listId, list.id), eq(items.bookId, book.id)),
	});

	if (existingItem) return book;

	// 4. Calculate position and Insert
	const [positionResult] = await db
		.select({
			maxPosition: sql<number>`COALESCE(MAX(${readingListItems.position}), 0)`,
		})
		.from(readingListItems)
		.where(eq(readingListItems.listId, list.id));

	const nextPosition = (positionResult?.maxPosition ?? 0) + 1.0;

	// Perform the insertion and wrap the follow-up in a try-catch for rollback
	try {
		await db.insert(readingListItems).values({
			id: crypto.randomUUID(),
			listId: list.id,
			bookId: book.id,
			position: nextPosition,
		});

		// 5. Sync the Session/Stats row
		await db
			.insert(userReadingSessions)
			.values({
				userId: input.userId,
				bookId: book.id,
				status: input.type,
				addedToTbrAt: input.type === "to_be_read" ? new Date() : null,
				startedReadingAt: input.type === "reading" ? new Date() : null,
			})
			.onConflictDoUpdate({
				target: [userReadingSessions.userId, userReadingSessions.bookId],
				set: {
					status: input.type,
					addedToTbrAt: input.type === "to_be_read" ? new Date() : null,
					startedReadingAt: input.type === "reading" ? new Date() : null,
				},
			});
	} catch (error) {
		console.error(
			"Critical: Failed to sync reading session, rolling back list entry",
			error,
		);

		// MANUAL ROLLBACK: Delete the list item if the session sync failed
		await db
			.delete(readingListItems)
			.where(
				and(
					eq(readingListItems.listId, list.id),
					eq(readingListItems.bookId, book.id),
				),
			);

		throw new Error("Failed to add book. Please try again.");
	}

	return book;
}

// export async function addBookToReadingList(input: AddBookToReadingListInput) {
// 	// 1. Upsert the book into the main books registry
// 	const book = await upsertBook(input.book, db);
//
// 	// 2. Find or create the targeted reading list for this user
// 	let list = await db.query.readingLists.findFirst({
// 		where: (lists, { and, eq }) =>
// 			and(eq(lists.userId, input.userId), eq(lists.type, input.type)),
// 	});
//
// 	if (!list) {
// 		const [newList] = await db
// 			.insert(readingLists)
// 			.values({
// 				id: crypto.randomUUID(),
// 				userId: input.userId,
// 				type: input.type,
// 				name: input.type === "to_be_read" ? "To Be Read" : input.type,
// 			})
// 			.returning();
// 		list = newList;
// 	}
//
// 	// 3. EXPLICIT CHECK: Is this book already sitting in this specific list?
// 	const existingItem = await db.query.readingListItems.findFirst({
// 		where: (items, { and, eq }) =>
// 			and(eq(items.listId, list.id), eq(items.bookId, book.id)),
// 	});
//
// 	// If it exists, short-circuit right here. No duplicate entries, no position gaps.
// 	if (existingItem) {
// 		return book;
// 	}
//
// 	// 4. CHOOSE POSITION: Grab the current absolute highest position in this list
// 	const [positionResult] = await db
// 		.select({
// 			maxPosition: sql<number>`COALESCE(MAX(${readingListItems.position}), 0)`,
// 		})
// 		.from(readingListItems)
// 		.where(eq(readingListItems.listId, list.id));
//
// 	// Always append cleanly to the tail end of the list
// 	const nextPosition = (positionResult?.maxPosition ?? 0) + 1.0;
//
// 	// 5. Link the book to the reading list at its new bottom position
// 	await db
// 		.insert(readingListItems)
// 		.values({
// 			id: crypto.randomUUID(),
// 			listId: list.id,
// 			bookId: book.id,
// 			position: nextPosition,
// 		})
// 		.onConflictDoNothing();
//
// 	return book;
// }
