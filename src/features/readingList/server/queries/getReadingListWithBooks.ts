import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db/drizzle";
import {
	bookGenres,
	bookMoods,
	books,
	readingListItems,
	readingLists,
} from "@/db/schema";
import { ReadingListType } from "@/features/readingList/types";

export interface ReadingListBook {
	id: string;
	title: string;
	author: string;
	cover: string;
	pages: number | null;
	seriesName: string | null;
	seriesPosition: number | null;
	seriesCount: number | null;
	position: number;
	genres: string[];
	moods: string[];
	description: string;
	publisher: string | null;
	publisherYear: number | null;
	isbn10: string | null;
	isbn13: string | null;
	canonicalId: number;
	rating: number | null;
	ratingCount: number | null;
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
	// 1. Fetch the distinct list of books and their list position metrics (Exactly 1 row per book)
	const baseBooks = await db
		.select({
			id: books.id,
			title: books.title,
			author: books.author,
			cover: books.cover,
			pages: books.pages,
			seriesName: books.seriesName,
			seriesPosition: books.seriesPosition,
			seriesCount: books.seriesCount,
			description: books.description,
			publisher: books.publisher,
			publisherYear: books.publishedYear,
			isbn10: books.isbn10,
			isbn13: books.isbn13,
			canonicalId: books.canonicalId,
			rating: books.rating,
			ratingCount: books.ratingsCount,
			position: readingListItems.position,
		})
		.from(readingListItems)
		.innerJoin(readingLists, eq(readingListItems.listId, readingLists.id))
		.innerJoin(books, eq(readingListItems.bookId, books.id))
		.where(and(eq(readingLists.userId, userId), eq(readingLists.type, type)))
		.orderBy(readingListItems.position);

	// Safe escape clause if the user has no books in this list
	if (baseBooks.length === 0) {
		return {
			type,
			books: [],
			pages: 0,
		};
	}

	const bookIds = baseBooks.map((b) => b.id);

	// 2. Fetch all matching tags in parallel (Each returns small, compact flat rows)
	const [genresData, moodsData] = await Promise.all([
		db.select().from(bookGenres).where(inArray(bookGenres.bookId, bookIds)),
		db.select().from(bookMoods).where(inArray(bookMoods.bookId, bookIds)),
	]);

	// 3. Map the isolated relational arrays back to the respective target books
	const formattedBooks = baseBooks.map((book) => {
		const genres = genresData
			.filter((g) => g.bookId === book.id)
			.map((g) => g.genre);

		const moods = moodsData
			.filter((m) => m.bookId === book.id)
			.map((m) => m.mood);

		return {
			...book,
			genres,
			moods,
		};
	});

	return {
		type,
		books: formattedBooks,
		pages: formattedBooks.reduce((acc, book) => acc + (book.pages ?? 0), 0),
	};
}
