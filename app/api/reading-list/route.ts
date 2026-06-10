import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { getAuthOptions } from "@/auth";
import {
	bookSchema,
	moveBookSchema,
	readingListSlugSchema,
} from "@/features/readingList/schemas/readingList.schema";
import { getReadingListStore } from "@/features/readingList/server/storage";
import type { ReadingListSlug } from "@/features/readingList/types/readingList";

function isDevelopment() {
	return process.env.NODE_ENV !== "production";
}

function toErrorMessage(error: unknown, fallback: string) {
	if (error instanceof Error && error.message) {
		return error.message;
	}

	return fallback;
}

async function getCurrentUserId() {
	const session = await getServerSession(getAuthOptions());
	return session?.user?.id ?? null;
}

function getRequestedListSlug(request: Request): ReadingListSlug | undefined {
	const requestUrl = new URL(request.url);
	const parsedListSlug = readingListSlugSchema.safeParse(
		requestUrl.searchParams.get("listSlug"),
	);

	return parsedListSlug.success
		? (parsedListSlug.data as ReadingListSlug)
		: undefined;
}

export async function GET(request: Request) {
	try {
		const userId = await getCurrentUserId();

		if (!userId) {
			return NextResponse.json(
				{ error: "Authentication required." },
				{ status: 401 },
			);
		}

		const store = await getReadingListStore();
		const snapshot = await store.getBooks(
			userId,
			getRequestedListSlug(request),
		);
		return NextResponse.json(snapshot);
	} catch (error) {
		console.error("GET /api/reading-list failed", error);
		return NextResponse.json(
			{
				books: [],
				pages: 0,
				error: isDevelopment()
					? toErrorMessage(error, "Unable to load reading list.")
					: "Unable to load reading list.",
			},
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
		const snapshot = await store.addBook(
			userId,
			parsedBook.data,
			getRequestedListSlug(request),
		);

		return NextResponse.json(snapshot);
	} catch (error) {
		console.error("POST /api/reading-list failed", error);
		return NextResponse.json(
			{
				error: isDevelopment()
					? toErrorMessage(error, "Unable to save the book.")
					: "Unable to save the book.",
			},
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
			getRequestedListSlug(request),
		);

		return NextResponse.json(snapshot);
	} catch (error) {
		console.error("PATCH /api/reading-list failed", error);
		return NextResponse.json(
			{
				error: isDevelopment()
					? toErrorMessage(error, "Unable to move the book.")
					: "Unable to move the book.",
			},
			{ status: 500 },
		);
	}
}
