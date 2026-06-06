import type { Book, ReadingListSnapshot } from "../types/readingList";

async function readJson<T>(response: Response): Promise<T> {
	if (!response.ok) {
		throw new Error("Reading list request failed");
	}

	return (await response.json()) as T;
}

export async function fetchReadingList(): Promise<ReadingListSnapshot> {
	const response = await fetch("/api/reading-list");
	return readJson<ReadingListSnapshot>(response);
}

export async function addReadingListBook(
	book: Book,
): Promise<ReadingListSnapshot> {
	const response = await fetch("/api/reading-list", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ book }),
	});

	return readJson<ReadingListSnapshot>(response);
}

export async function moveReadingListBook(
	bookId: string,
	direction: -1 | 1,
): Promise<ReadingListSnapshot> {
	const response = await fetch("/api/reading-list", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ bookId, direction }),
	});

	return readJson<ReadingListSnapshot>(response);
}
