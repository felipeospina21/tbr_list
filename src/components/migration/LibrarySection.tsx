"use client";
import { useFetchReadingList } from "@/features/readingList/api/useFetchReadingList";
import { BooksList } from "./BooksList";
import { Shelves } from "./Shelves";
import { useSearchParams } from "next/navigation";
import { ReadingListType } from "@/features/readingList/types/readingList";

export const LibrarySection = () => {
	const searchParams = useSearchParams();

	// Read the current list from the URL, fallback to 'to_be_read'
	const currentList = (searchParams.get("type") ||
		"to_be_read") as ReadingListType;

	const toBeReadQuery = useFetchReadingList(currentList);

	if (toBeReadQuery.isLoading) {
		return <div>loading</div>;
	}

	return (
		<div className="flex flex-col h-full">
			{/* Shelf selector — minimal pill row */}
			<Shelves currentList={currentList} books={toBeReadQuery.data?.books} />

			<BooksList books={toBeReadQuery.data?.books} currentList={currentList} />
			{/**/}
			{/* <BookListActions */}
			{/* 	books={toBeReadQuery.data?.books} */}
			{/* 	optionsBook={optionsBook} */}
			{/* 	setBooks={setBooks} */}
			{/* 	setOptionsBook={setOptionsBook} */}
			{/* /> */}
		</div>
	);
};
