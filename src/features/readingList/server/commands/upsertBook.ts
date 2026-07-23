import { DbClient, db } from "@/db/drizzle";
import { bookGenres, bookMoods, books } from "@/db/schema";
import { SearchBook } from "@/features/search/types/search.types";

export async function upsertBook(input: SearchBook, tx: DbClient = db) {
	let existingBook = null;
	const bookId = input.bookId;

	// 1. Explicitly check for an existing cached book record
	if (typeof bookId === "number") {
		existingBook = await tx.query.books.findFirst({
			where: (books, { eq }) => eq(books.canonicalId, bookId),
		});
	}

	// 2. If it's already in our DB, bypass the insert entirely
	if (existingBook) {
		return existingBook;
	}

	// 3. Save the new book metadata safely with an ON CONFLICT clause
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
		// Safety: If the book was added by a concurrent request, update its timestamp and return it
		.onConflictDoUpdate({
			target: [books.primarySource, books.primarySourceBookId],
			set: { updatedAt: new Date() },
		})
		.returning();

	// 4. CRITICAL SAFETY GUARD: Throw a meaningful error if the DB returns nothing
	if (!book) {
		throw new Error(
			`Failed to upsert book: "${input.title}". Database record could not be created.`,
		);
	}

	// 5. Batch attach the book genres tags (Safe now because 'book' is guaranteed to exist)
	if (input.genres && input.genres.length > 0) {
		await tx.insert(bookGenres).values(
			input.genres.map((genre) => ({
				bookId: book.id,
				genre,
			})),
		);
	}

	// 6. Batch attach the book mood tags
	if (input.moods && input.moods.length > 0) {
		await tx.insert(bookMoods).values(
			input.moods.map((mood) => ({
				bookId: book.id,
				mood,
			})),
		);
	}

	return book;
}
