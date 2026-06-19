import { and, eq } from "drizzle-orm";
import {
	books,
	readingLists,
	readingListItems,
	bookGenres,
	bookMoods,
} from "@/db/schema";
import { db } from "@/db/drizzle";
import { ReadingListType } from "@/features/readingList/types/readingList";

export interface ReadingListBook {
	id: string;
	title: string;
	author: string;
	cover: string;
	pages: number | null;
	seriesName: string | null;
	seriesPosition: string | null;
	position: number;
	genres: string[];
	moods: string[];
}

export interface GetReadingListWithBooks {
	type: ReadingListType;
	books: ReadingListBook[];
	pages: number;
}

export async function getReadingListWithBooks(
	userId: string,
	type: ReadingListType,
) {
	const rows = await db
		.select({
			id: books.id,
			title: books.title,
			author: books.author,
			cover: books.cover,
			pages: books.pages,
			seriesName: books.seriesName,
			seriesPosition: books.seriesPosition,
			position: readingListItems.position,
			genre: bookGenres.genre,
			mood: bookMoods.mood,
		})
		.from(readingListItems)
		.innerJoin(readingLists, eq(readingListItems.listId, readingLists.id))
		.innerJoin(books, eq(readingListItems.bookId, books.id))
		.leftJoin(bookGenres, eq(books.id, bookGenres.bookId)) // Left join to include books without genres
		.leftJoin(bookMoods, eq(books.id, bookMoods.bookId)) // Left join to include books without moods
		.where(and(eq(readingLists.userId, userId), eq(readingLists.type, type)))
		.orderBy(readingListItems.position);

	// Accumulator object to group flat database rows by book ID
	const booksMap: Record<
		string,
		Omit<ReadingListBook, "genres" | "moods"> & {
			genres: Set<string>;
			moods: Set<string>;
		}
	> = {};

	for (const row of rows) {
		if (!booksMap[row.id]) {
			booksMap[row.id] = {
				id: row.id,
				title: row.title,
				author: row.author,
				cover: row.cover,
				pages: row.pages,
				seriesName: row.seriesName,
				seriesPosition: row.seriesPosition,
				position: row.position,
				genres: new Set<string>(),
				moods: new Set<string>(),
			};
		}
		if (row.genre) booksMap[row.id].genres.add(row.genre);
		if (row.mood) booksMap[row.id].moods.add(row.mood);
	}

	// Convert Sets back to arrays for the final response
	const formattedBooks = Object.values(booksMap)
		.map((book) => ({
			...book,
			genres: Array.from(book.genres),
			moods: Array.from(book.moods),
		}))
		.sort((a, b) => a.position - b.position); // Maintain position order

	return {
		type,
		books: formattedBooks,
		pages: formattedBooks.reduce((acc, book) => acc + (book.pages ?? 0), 0),
	};
}
