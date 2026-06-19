import { and, eq, max } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { readingListItems, readingLists } from "@/db/schema";
import { ReadingListType } from "@/db/types";
import { SearchBook } from "@/f";
import { ReadingListNotFoundError } from "@/lib/errors/ReadingListNotFoundError";
import { upsertBook } from "./upsertBook";

export type AddBookToReadingListInput = {
	userId: string;
	type: ReadingListType;
	book: SearchBook;
};

export async function addBookToReadingList(input: AddBookToReadingListInput) {
	return db.transaction(async (tx) => {
		const book = await upsertBook(input.book, tx);

		const list = await tx.query.readingLists.findFirst({
			where: and(
				eq(readingLists.userId, input.userId),
				eq(readingLists.type, input.type),
			),
		});

		if (!list) {
			throw new ReadingListNotFoundError();
		}

		const existingItem = await tx.query.readingListItems.findFirst({
			where: and(
				eq(readingListItems.listId, list.id),
				eq(readingListItems.bookId, book.id),
			),
		});

		if (existingItem) {
			return existingItem;
		}

		const [result] = await tx
			.select({
				maxPosition: max(readingListItems.position),
			})
			.from(readingListItems)
			.where(eq(readingListItems.listId, list.id));

		const nextPosition = (result.maxPosition ?? 0) + 1;

		const [item] = await tx
			.insert(readingListItems)
			.values({
				listId: list.id,
				bookId: book.id,
				position: nextPosition,
			})
			.returning();

		return item;
	});
}
