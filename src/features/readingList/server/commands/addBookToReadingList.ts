import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { readingListItems, readingLists } from "@/db/schema";
import { ReadingListType } from "@/features/readingList/types";
import { SearchBook } from "@/features/search/types/search.types";
import { upsertBook } from "./upsertBook";
import { upsertUserReadingSession } from "./upsertUserReadingSession";

export type AddBookToReadingListInput = {
	userId: string;
	type: ReadingListType;
	book: SearchBook;
};

export async function addBookToReadingList(input: AddBookToReadingListInput) {
	return db.transaction(async (tx) => {
		// 1. Upsert the book into the main books registry
		const book = await upsertBook(input.book, tx);

		// 2. Find or create the reading list
		let list = await tx.query.readingLists.findFirst({
			where: (lists, { and, eq }) =>
				and(eq(lists.userId, input.userId), eq(lists.type, input.type)),
		});

		if (!list) {
			const [newList] = await tx
				.insert(readingLists)
				.values({
					id: crypto.randomUUID(),
					userId: input.userId,
					type: input.type,
					name: input.type === "to_be_read" ? "To Be Read" : input.type,
				})
				.onConflictDoNothing()
				.returning();

			list =
				newList ??
				(await tx.query.readingLists.findFirst({
					where: (lists, { and, eq }) =>
						and(eq(lists.userId, input.userId), eq(lists.type, input.type)),
				}));
		}

		if (!list) {
			throw new Error("Failed to create reading list.");
		}

		// 3. Check for existence
		const existingItem = await tx.query.readingListItems.findFirst({
			where: (items, { and, eq }) =>
				and(eq(items.listId, list.id), eq(items.bookId, book.id)),
		});

		if (existingItem) return book;

		// 4. Calculate position and Insert
		const [positionResult] = await tx
			.select({
				maxPosition: sql<number>`COALESCE(MAX(${readingListItems.position}), 0)`,
			})
			.from(readingListItems)
			.where(eq(readingListItems.listId, list.id));

		const nextPosition = (positionResult?.maxPosition ?? 0) + 1.0;

		await tx.insert(readingListItems).values({
			id: crypto.randomUUID(),
			listId: list.id,
			bookId: book.id,
			position: nextPosition,
		});

		// 5. Sync the Session/Stats row
		await upsertUserReadingSession(
			{
				userId: input.userId,
				bookId: book.id,
				status: input.type,
				addedToTbrAt: input.type === "to_be_read" ? new Date() : null,
				startedReadingAt: input.type === "reading" ? new Date() : null,
			},
			tx,
		);

		return book;
	});
}
