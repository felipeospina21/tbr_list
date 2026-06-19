import { unauthorized } from "next/navigation";
import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/features/auth/server/getCurrentUserId";
import { readingListTypeSchema } from "@/features/readingList/schemas/readingList.schema";
import { addBookToReadingList } from "@/features/readingList/server/commands/addBookToReadingList";
import { getReadingList } from "@/features/readingList/server/queries/getReadingList";
import { errorResponse } from "@/lib/api/errorResponse";
import { isDevelopment } from "@/lib/env";
import { toErrorMessage } from "@/lib/errors";

export async function GET(request: Request) {
	try {
		const userId = await getCurrentUserId();
		if (!userId) {
			return unauthorized();
		}

		const type = getRequestedListType(request);
		const readingList = await getReadingList(userId, type);

		return Response.json(readingList);
	} catch (error) {
		errorResponse(error);
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

		return Response.json(
			{
				id: book.id,
			},
			{ status: 201 },
		);
	} catch (error) {
		errorResponse(error);
	}
}

function getRequestedListType(request: Request) {
	const requestUrl = new URL(request.url);

	const parsedType = readingListTypeSchema.safeParse(
		requestUrl.searchParams.get("type"),
	);

	return parsedType.success ? parsedType.data : "to_be_read";
}
