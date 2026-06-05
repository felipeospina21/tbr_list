"use client";

import { useMemo, useState } from "react";

import {
	type Book,
	initialBooks,
	moveBookInList,
	totalPages,
} from "./readingList";

export function useReadingList() {
	const [books, setBooks] = useState<Book[]>(initialBooks);

	const pages = useMemo(() => totalPages(books), [books]);

	function moveBook(index: number, direction: -1 | 1) {
		setBooks((current) => moveBookInList(current, index, direction));
	}

	function addBook(book: Book) {
		setBooks((current) => {
			if (current.some((existingBook) => existingBook.id === book.id)) {
				return current;
			}

			return [...current, book];
		});
	}

	return {
		books,
		addBook,
		moveBook,
		pages,
	};
}
