"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	addReadingListBook,
	fetchReadingList,
	moveReadingListBook,
} from "../data/readingListApi";
import type { Book } from "../types/readingList";

const READING_LIST_QUERY_KEY = ["reading-list"] as const;
const EMPTY_READING_LIST = {
	books: [],
	pages: 0,
} satisfies {
	books: Book[];
	pages: number;
};

export function useReadingList() {
	const queryClient = useQueryClient();
	const readingListQuery = useQuery({
		queryKey: READING_LIST_QUERY_KEY,
		queryFn: fetchReadingList,
		refetchOnWindowFocus: false,
	});

	const addBookMutation = useMutation({
		mutationFn: addReadingListBook,
		onSuccess: (snapshot) => {
			queryClient.setQueryData(READING_LIST_QUERY_KEY, snapshot);
		},
	});

	const moveBookMutation = useMutation({
		mutationFn: ({
			bookId,
			direction,
		}: {
			bookId: string;
			direction: -1 | 1;
		}) => moveReadingListBook(bookId, direction),
		onSuccess: (snapshot) => {
			queryClient.setQueryData(READING_LIST_QUERY_KEY, snapshot);
		},
	});

	const books = readingListQuery.data?.books ?? EMPTY_READING_LIST.books;
	const pages = readingListQuery.data?.pages ?? EMPTY_READING_LIST.pages;

	async function addBook(book: Book) {
		await addBookMutation.mutateAsync(book);
	}

	async function moveBook(bookId: string, direction: -1 | 1) {
		await moveBookMutation.mutateAsync({ bookId, direction });
	}

	return {
		books,
		addBook,
		moveBook,
		pages,
	};
}
