import { ReadingListType } from "@/db/types";
import { getReadingListBooks } from "../db/getReadingListBooks";

export async function getReadingList(userId: string, type: ReadingListType) {
	const books = await getReadingListBooks(userId, type);

	return {
		type,
		books,
		pages: books.reduce((acc, book) => acc + (book.pages ?? 0), 0),
	};
}
