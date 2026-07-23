"use client";
import { useSearchParams } from "next/navigation";
import { ReadingListType } from "@/features/readingList/types";
import { BooksList } from "./BooksList";
import { Shelves } from "./Shelves";

export const Library = () => {
	const searchParams = useSearchParams();

	// Read the current list from the URL, fallback to 'to_be_read'
	const currentList = (searchParams.get("type") ||
		"to_be_read") as ReadingListType;

	return (
		<div className="flex flex-col h-full">
			<Shelves currentList={currentList} />
			<BooksList currentList={currentList} />
		</div>
	);
};
