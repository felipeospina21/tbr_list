import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/features/auth/server/getCurrentUserId";
import { readingListTypeSchema } from "@/features/readingList/schemas/readingList.schema";
import { getReadingList } from "@/features/readingList/server/queries/getReadingList";
import { isDevelopment } from "@/lib/env";
import { toErrorMessage } from "@/lib/errors";

export async function GET(request: Request) {
	try {
		const userId = await getCurrentUserId();

		if (!userId) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

		const type = getRequestedListType(request);
		const readingList = await getReadingList(userId, type);

		return Response.json(readingList);
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

function getRequestedListType(request: Request) {
	const requestUrl = new URL(request.url);

	const parsedType = readingListTypeSchema.safeParse(
		requestUrl.searchParams.get("type"),
	);

	return parsedType.success ? parsedType.data : "to_be_read";
}
