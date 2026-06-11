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
		targetIndex: number,
		listSlug?: ReadingListSlug,
	): Promise<ReadingListSnapshot>;
	removeBook(
		userId: string,
		bookId: string,
		listSlug?: ReadingListSlug,
	): Promise<ReadingListSnapshot>;
	transferBook(
		userId: string,
		bookId: string,
		sourceListSlug: ReadingListSlug,
		targetListSlug: ReadingListSlug,
	): Promise<ReadingListSnapshot>;
	updateBookMoods(
		userId: string,
		bookId: string,
		moods: readonly string[],
		listSlug?: ReadingListSlug,
	): Promise<ReadingListSnapshot>;
}
