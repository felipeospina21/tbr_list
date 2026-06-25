"use client";
import { BooksList } from "./BooksList";
import { Shelves } from "./Shelves";
import { useSearchParams } from "next/navigation";
import { ReadingListType } from "@/features/readingList/types";
import { BookListActions } from "./BookListActions";
import { useState } from "react";
import { ReadingListBook } from "@/features/readingList/server/queries/getReadingListWithBooks";

export const Library = () => {
	const [optionsBook, setOptionsBook] = useState<ReadingListBook | null>(null);
	const searchParams = useSearchParams();

	// Read the current list from the URL, fallback to 'to_be_read'
	const currentList = (searchParams.get("type") ||
		"to_be_read") as ReadingListType;

	function onBookOptions(book: ReadingListBook) {
		setOptionsBook(book);
	}

	return (
		<div className="flex flex-col h-full">
			<Shelves currentList={currentList} />

			<BooksList currentList={currentList} onBookOptions={onBookOptions} />

			<BookListActions
				optionsBook={optionsBook}
				setOptionsBook={setOptionsBook}
			/>
		</div>
	);
};
