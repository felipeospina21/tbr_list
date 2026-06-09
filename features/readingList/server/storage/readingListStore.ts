import "server-only";

import type {
	Book,
	ReadingListSlug,
	ReadingListSnapshot,
} from "../../types/readingList";

export type { ReadingListSnapshot };

export interface ReadingListStore {
	getBooks(
		userId: string,
		listSlug?: ReadingListSlug,
	): Promise<ReadingListSnapshot>;
	addBook(
		userId: string,
		book: Book,
		listSlug?: ReadingListSlug,
	): Promise<ReadingListSnapshot>;
	moveBook(
		userId: string,
		bookId: string,
		direction: -1 | 1,
		listSlug?: ReadingListSlug,
	): Promise<ReadingListSnapshot>;
}
