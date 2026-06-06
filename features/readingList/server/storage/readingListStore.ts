import "server-only";

import type { Book, ReadingListSnapshot } from "../../types/readingList";

export type { ReadingListSnapshot };

export interface ReadingListStore {
	getBooks(): Promise<ReadingListSnapshot>;
	addBook(book: Book): Promise<ReadingListSnapshot>;
	moveBook(bookId: string, direction: -1 | 1): Promise<ReadingListSnapshot>;
}
