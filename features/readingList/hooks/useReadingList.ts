"use client";

import { useEffect, useState } from "react";

import { useAddBookToReadingList } from "../mutations/useAddBookToReadingList";
import { useChangeBookPosition } from "../mutations/useChangeBookPosition";
import {
	EMPTY_READING_LIST,
	useFetchReadingList,
} from "../queries/useFetchReadingList";
import {
	type Book,
	DEFAULT_READING_LIST_SLUG,
	READING_LIST_DEFINITIONS,
	type ReadingListSlug,
} from "../types/readingList";

const EMPTY_READING_LISTS = READING_LIST_DEFINITIONS.map((definition) => ({
	slug: definition.slug,
	name: definition.name,
	isDefault: definition.isDefault,
	booksCount: 0,
}));

export function useReadingList(
	initialListSlug: ReadingListSlug = DEFAULT_READING_LIST_SLUG,
) {
	const [selectedListSlug, setSelectedListSlug] =
		useState<ReadingListSlug>(initialListSlug);
	const readingListQuery = useFetchReadingList(selectedListSlug);
	const addBookMutation = useAddBookToReadingList(selectedListSlug);
	const changeBookPositionMutation = useChangeBookPosition(selectedListSlug);

	useEffect(() => {
		const resolvedListSlug = readingListQuery.data?.activeListSlug;

		if (resolvedListSlug && resolvedListSlug !== selectedListSlug) {
			setSelectedListSlug(resolvedListSlug);
		}
	}, [readingListQuery.data?.activeListSlug, selectedListSlug]);

	const books = readingListQuery.data?.books ?? EMPTY_READING_LIST.books;
	const pages = readingListQuery.data?.pages ?? EMPTY_READING_LIST.pages;
	const lists = readingListQuery.data?.lists ?? EMPTY_READING_LISTS;
	const activeListSlug =
		readingListQuery.data?.activeListSlug ?? selectedListSlug;

	async function addBook(book: Book) {
		await addBookMutation.mutateAsync(book);
	}

	async function moveBook(bookId: string, direction: -1 | 1) {
		await changeBookPositionMutation.mutateAsync({ bookId, direction });
	}

	return {
		activeListSlug,
		books,
		addBook,
		lists,
		setSelectedListSlug,
		moveBook,
		pages,
	};
}
