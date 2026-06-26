import { searchHardcover } from "@/features/search/api/searchHardcover";
import { ApiResponseHelper } from "@/lib/api/apiResponse";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const url = new URL(request.url);
	const query = url.searchParams.get("q")?.trim() ?? "";

	if (query.length < 2) {
		return NextResponse.json({ results: [] });
	}

	try {
		const outcome = await searchHardcover(query);

		return ApiResponseHelper.success(outcome, 200);
	} catch (error) {
		return ApiResponseHelper.handle(error);
	}
}
