import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { getAuthOptions } from "@/auth";
import {
	bookSchema,
	moveBookSchema,
} from "@/features/readingList/schemas/readingList.schema";
import { getReadingListStore } from "@/features/readingList/server/storage";

async function getCurrentUserId() {
	const session = await getServerSession(getAuthOptions());
	return session?.user?.id ?? null;
}

export async function GET() {
	try {
		const userId = await getCurrentUserId();

		if (!userId) {
			return NextResponse.json(
				{ error: "Authentication required." },
				{ status: 401 },
			);
		}

		const store = await getReadingListStore();
		const snapshot = await store.getBooks(userId);
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
		const userId = await getCurrentUserId();

		if (!userId) {
			return NextResponse.json(
				{ error: "Authentication required." },
				{ status: 401 },
			);
		}

		const body = (await request.json()) as { book?: unknown };

		const parsedBook = bookSchema.safeParse(body.book);

		if (!parsedBook.success) {
			return NextResponse.json(
				{ error: "Invalid book payload." },
				{ status: 400 },
			);
		}

		const store = await getReadingListStore();
		const snapshot = await store.addBook(userId, parsedBook.data);

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
		const userId = await getCurrentUserId();

		if (!userId) {
			return NextResponse.json(
				{ error: "Authentication required." },
				{ status: 401 },
			);
		}

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
			userId,
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
