import { unauthorized } from "next/navigation";
import { getCurrentUserId } from "@/features/auth/server/getCurrentUserId";
import { readingListTypeSchema } from "@/features/readingList/schemas/readingList.schema";
import { addBookToReadingList } from "@/features/readingList/server/commands/addBookToReadingList";
import {
	GetReadingListWithBooks,
	getReadingListWithBooks,
} from "@/features/readingList/server/queries/getReadingListWithBooks";
import { ApiResponseHelper } from "@/lib/api/apiResponse";
import {
	GetReadingListCounts,
	getReadingListCounts,
} from "@/features/readingList/server/queries/getReadingListsCount";
import { reorderSingleItem } from "@/features/readingList/server/commands/reorderSingleItem";
import { UpdateServerOrderPayload } from "@/features/readingList/api/useChangeBookPosition";

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
			getReadingListWithBooks(userId, type),
			getReadingListCounts(userId),
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

		return ApiResponseHelper.success(res.success, 200, {
			newPosition: res.position,
		});
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
