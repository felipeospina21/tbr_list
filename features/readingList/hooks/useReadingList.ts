"use client";

import { useAddBookToReadingList } from "../mutations/useAddBookToReadingList";
import { useChangeBookPosition } from "../mutations/useChangeBookPosition";
import {
	EMPTY_READING_LIST,
	useFetchReadingList,
} from "../queries/useFetchReadingList";
import type { Book } from "../types/readingList";

export function useReadingList() {
	const readingListQuery = useFetchReadingList();
	const addBookMutation = useAddBookToReadingList();
	const changeBookPositionMutation = useChangeBookPosition();

	const books = readingListQuery.data?.books ?? EMPTY_READING_LIST.books;
	const pages = readingListQuery.data?.pages ?? EMPTY_READING_LIST.pages;

	async function addBook(book: Book) {
		await addBookMutation.mutateAsync(book);
	}

	async function moveBook(bookId: string, direction: -1 | 1) {
		await changeBookPositionMutation.mutateAsync({ bookId, direction });
	}

	return {
		books,
		addBook,
		moveBook,
		pages,
	};
}
