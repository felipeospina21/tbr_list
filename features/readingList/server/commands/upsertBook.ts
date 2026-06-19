import { DbClient, db } from "@/db/drizzle";
import { bookGenres, bookMoods, books } from "@/db/schema";
import { SearchBook } from "@/f";

export async function upsertBook(input: SearchBook, tx: DbClient = db) {
	let existingBook;
	const bookId = input.bookId;

	if (typeof bookId === "number") {
		existingBook = await tx.query.books.findFirst({
			where: (books, { eq }) => eq(books.canonicalId, bookId),
		});
	}

	if (existingBook) {
		return existingBook;
	}

	const [book] = await tx
		.insert(books)
		.values({
			canonicalId: bookId,
			title: input.title,
			author: input.author,
			cover: input.cover,
			pages: input.pages,
			description: input.description,
			primarySource: input.source,
			primarySourceBookId: input.sourceBookId,
			isbn10: input.isbn10,
			isbn13: input.isbn13,
			language: input.language,
			publishedDate: input.publishedDate,
			publishedYear: input.publishedYear,
			publisher: input.publisher,
			seriesName: input.seriesName,
			seriesPosition: input.seriesPosition,
			subtitle: input.subtitle,
		})
		.returning();

	if (input.genres.length) {
		await tx.insert(bookGenres).values(
			input.genres.map((genre) => ({
				bookId: book.id,
				genre,
			})),
		);
	}

	if (input.moods.length) {
		await tx.insert(bookMoods).values(
			input.moods.map((mood) => ({
				bookId: book.id,
				mood,
			})),
		);
	}

	return book;
}
