import "server-only";

import type { Book, ReadingListSnapshot } from "../../types/readingList";

export type { ReadingListSnapshot };

export interface ReadingListStore {
	getBooks(userId: string): Promise<ReadingListSnapshot>;
	addBook(userId: string, book: Book): Promise<ReadingListSnapshot>;
	moveBook(
		userId: string,
		bookId: string,
		direction: -1 | 1,
	): Promise<ReadingListSnapshot>;
}
