import { and, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { books, readingListItems, readingLists } from "@/db/schema";
import { ReadingListType } from "@/db/types";

export async function getReadingList(userId: string, type: ReadingListType) {
	const b = await db
		.select({
			id: books.id,
			title: books.title,
			author: books.author,
			cover: books.cover,
			pages: books.pages,
			seriesName: books.seriesName,
			seriesPosition: books.seriesPosition,
			position: readingListItems.position,
		})
		.from(readingListItems)
		.innerJoin(readingListItems, eq(readingListItems.listId, readingLists.id))
		.innerJoin(books, eq(readingListItems.bookId, books.id))
		.where(and(eq(readingLists.userId, userId), eq(readingLists.type, type)))
		.orderBy(readingListItems.position);

	return {
		type,
		books: b,
		pages: b.reduce((acc, book) => acc + (book.pages ?? 0), 0),
	};
}
