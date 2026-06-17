import { and, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { books, readingListItems, readingLists } from "@/db/schema";
import { ReadingListType } from "@/db/types";

export async function getReadingListBooks(
	userId: string,
	type: ReadingListType,
) {
	return db
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
		.innerJoin(readingLists, eq(readingListItems.listId, readingLists.id))
		.innerJoin(books, eq(readingListItems.bookId, books.id))
		.where(and(eq(readingLists.userId, userId), eq(readingLists.type, type)))
		.orderBy(readingListItems.position);
}
