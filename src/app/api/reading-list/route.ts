import { unauthorized } from "next/navigation";
import { getCurrentUserId } from "@/features/auth/server/getCurrentUserId";
import { readingListTypeSchema } from "@/features/readingList/schemas/readingList.schema";
import { addBookToReadingList } from "@/features/readingList/server/commands/addBookToReadingList";
import {
	GetReadingListWithBooks,
	getReadingListWithBooks,
} from "@/features/readingList/server/queries/getReadingListWithBooks";
import { ApiResponseHelper } from "@/lib/api/apiResponse";

export async function GET(request: Request) {
	try {
		const userId = await getCurrentUserId();
		if (!userId) {
			return unauthorized();
		}

		const type = getRequestedListType(request);
		const readingList = await getReadingListWithBooks(userId, type);

		return ApiResponseHelper.success<GetReadingListWithBooks>(readingList, 200);
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

function getRequestedListType(request: Request) {
	const requestUrl = new URL(request.url);

	const parsedType = readingListTypeSchema.safeParse(
		requestUrl.searchParams.get("type"),
	);

	return parsedType.success ? parsedType.data : "to_be_read";
}
