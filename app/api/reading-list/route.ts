import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { getAuthOptions } from "@/auth";
import {
	bookSchema,
	moveBookSchema,
	readingListSlugSchema,
	removeBookSchema,
	transferBookSchema,
	updateBookMoodsSchema,
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
			targetIndex?: unknown;
			sourceListSlug?: unknown;
			targetListSlug?: unknown;
			moods?: unknown;
		};

		const parsedMoodUpdate = updateBookMoodsSchema.safeParse(body);

		if (parsedMoodUpdate.success) {
			const store = await getReadingListStore();
			const snapshot = await store.updateBookMoods(
				userId,
				parsedMoodUpdate.data.bookId,
				parsedMoodUpdate.data.moods,
				getRequestedListSlug(request),
			);

			return NextResponse.json(snapshot);
		}

		const parsedTransfer = transferBookSchema.safeParse(body);

		if (parsedTransfer.success) {
			const store = await getReadingListStore();
			const snapshot = await store.transferBook(
				userId,
				parsedTransfer.data.bookId,
				parsedTransfer.data.sourceListSlug as ReadingListSlug,
				parsedTransfer.data.targetListSlug as ReadingListSlug,
			);

			return NextResponse.json(snapshot);
		}

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
			parsedMove.data.targetIndex,
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

export async function DELETE(request: Request) {
	try {
		const userId = await getCurrentUserId();

		if (!userId) {
			return NextResponse.json(
				{ error: "Authentication required." },
				{ status: 401 },
			);
		}

		const body = (await request.json()) as { bookId?: unknown };
		const parsedRemove = removeBookSchema.safeParse(body);

		if (!parsedRemove.success) {
			return NextResponse.json(
				{ error: "Invalid remove payload." },
				{ status: 400 },
			);
		}

		const store = await getReadingListStore();
		const snapshot = await store.removeBook(
			userId,
			parsedRemove.data.bookId,
			getRequestedListSlug(request),
		);

		return NextResponse.json(snapshot);
	} catch (error) {
		console.error("DELETE /api/reading-list failed", error);
		return NextResponse.json(
			{
				error: isDevelopment()
					? toErrorMessage(error, "Unable to remove the book.")
					: "Unable to remove the book.",
			},
			{ status: 500 },
		);
	}
}
