"use client";
import { useFetchReadingList } from "@/features/readingList/api/useFetchReadingList";
import { BooksList } from "./BooksList";
import { Shelves } from "./Shelves";
import { useSearchParams } from "next/navigation";
import { ReadingListType } from "@/features/readingList/types/readingList";
import { BookListActions } from "./BookListActions";
import { useState } from "react";
import { ReadingListBook } from "@/features/readingList/server/queries/getReadingListWithBooks";
import { AnimatePresence, useDragControls } from "framer-motion";
import { DraggableBookItem } from "./DraggableBookItem";
import { Loader } from "../layout/Loader";

export const LibrarySection = () => {
	const [optionsBook, setOptionsBook] = useState<ReadingListBook | null>(null);
	const searchParams = useSearchParams();

	// Read the current list from the URL, fallback to 'to_be_read'
	const currentList = (searchParams.get("type") ||
		"to_be_read") as ReadingListType;

	// const toBeReadQuery = useFetchReadingList(currentList);
	// const books = toBeReadQuery.data?.books;
	//
	// if (toBeReadQuery.isLoading) {
	// 	return <Loader />;
	// }

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
