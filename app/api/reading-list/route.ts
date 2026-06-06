import { NextResponse } from "next/server";
import {
	bookSchema,
	moveBookSchema,
} from "@/features/readingList/schemas/readingList";
import { getReadingListStore } from "@/features/readingList/server/storage";

export async function GET() {
	try {
		const store = await getReadingListStore();
		const snapshot = await store.getBooks();
		return NextResponse.json(snapshot);
	} catch {
		return NextResponse.json(
			{ books: [], pages: 0, error: "Unable to load reading list." },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as { book?: unknown };

		const parsedBook = bookSchema.safeParse(body.book);

		if (!parsedBook.success) {
			return NextResponse.json(
				{ error: "Invalid book payload." },
				{ status: 400 },
			);
		}

		const store = await getReadingListStore();
		const snapshot = await store.addBook(parsedBook.data);

		return NextResponse.json(snapshot);
	} catch {
		return NextResponse.json(
			{ error: "Unable to save the book." },
			{ status: 500 },
		);
	}
}

export async function PATCH(request: Request) {
	try {
		const body = (await request.json()) as {
			bookId?: unknown;
			direction?: unknown;
		};

		const parsedMove = moveBookSchema.safeParse(body);

		if (!parsedMove.success) {
			return NextResponse.json(
				{ error: "Invalid move payload." },
				{ status: 400 },
			);
		}

		const store = await getReadingListStore();
		const snapshot = await store.moveBook(
			parsedMove.data.bookId,
			parsedMove.data.direction,
		);

		return NextResponse.json(snapshot);
	} catch {
		return NextResponse.json(
			{ error: "Unable to move the book." },
			{ status: 500 },
		);
	}
}
