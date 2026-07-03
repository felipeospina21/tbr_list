import { unauthorized } from "next/navigation";
import { getCurrentUserId } from "@/features/auth/server/getCurrentUserId";
import { UpdateServerOrderPayload } from "@/features/readingList/api/useChangeBookPosition";
import {
	deleteBookSchema,
	readingListTypeSchema,
} from "@/features/readingList/schemas/readingList.schema";
import { addBookToReadingList } from "@/features/readingList/server/commands/addBookToReadingList";
import { deleteBookFromReadingList } from "@/features/readingList/server/commands/deleteBookFromReadingList";
import { reorderSingleItem } from "@/features/readingList/server/commands/reorderSingleItem";
import {
	GetReadingListCounts,
	getReadingListCounts,
} from "@/features/readingList/server/queries/getReadingListsCount";
import {
	GetReadingListWithBooks,
	getReadingListWithBooks,
} from "@/features/readingList/server/queries/getReadingListWithBooks";
import { ApiResponseHelper } from "@/lib/api/apiResponse";
import { withRetry } from "@/lib/api/withRetry";

export interface FetchRedingLists {
	items: GetReadingListWithBooks;
	counts: GetReadingListCounts;
}
export async function GET(request: Request) {
	try {
		const userId = await getCurrentUserId();
		if (!userId) {
			return unauthorized();
		}

		const type = getRequestedListType(request);

		// Run both database queries simultaneously for optimal performance
		const [readingList, counts] = await Promise.all([
			withRetry(() => getReadingListWithBooks(userId, type)),
			withRetry(() => getReadingListCounts(userId)),
		]);

		// Combine them into a single clean envelope
		return ApiResponseHelper.success<FetchRedingLists>(
			{
				items: readingList,
				counts,
			},
			200,
		);
	} catch (error) {
		return ApiResponseHelper.handle(error);
	}
}

export async function POST(request: Request) {
	try {
		const userId = await getCurrentUserId();
		if (!userId) {
			return unauthorized();
		}

		const input = await request.json();

		const book = await addBookToReadingList({
			userId,
			type: input.type,
			book: input.book,
		});

		return ApiResponseHelper.success(book.id, 201);
	} catch (error) {
		return ApiResponseHelper.handle(error);
	}
}

export async function PATCH(request: Request) {
	try {
		const userId = await getCurrentUserId();
		if (!userId) {
			return unauthorized();
		}

		const body: UpdateServerOrderPayload = await request.json();
		const { bookId, abovePosition, belowPosition, listType } = body;

		const res = await reorderSingleItem({
			listType,
			userId,
			bookId,
			belowPosition,
			abovePosition,
		});

		return ApiResponseHelper.success({ position: res.position }, 200);
	} catch (error) {
		return ApiResponseHelper.handle(error);
	}
}

export async function DELETE(request: Request) {
	try {
		const userId = await getCurrentUserId();
		if (!userId) {
			return unauthorized();
		}

		const body = await request.json();
		const parsedBody = deleteBookSchema.safeParse(body);

		if (!parsedBody.success) {
			return ApiResponseHelper.error(
				"Invalid delete request.",
				"BAD_REQUEST",
				400,
				parsedBody.error.flatten(),
			);
		}

		const result = await deleteBookFromReadingList({
			userId,
			bookId: parsedBody.data.bookId,
		});

		return ApiResponseHelper.success(result, 200);
	} catch (error) {
		return ApiResponseHelper.handle(error);
	}
}

function getRequestedListType(request: Request) {
	const requestUrl = new URL(request.url);

	const parsedType = readingListTypeSchema.safeParse(
		requestUrl.searchParams.get("type"),
	);

	return parsedType.success ? parsedType.data : "to_be_read";
}
