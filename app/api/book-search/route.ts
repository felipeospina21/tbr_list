import { searchHardcover } from "@/f";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const url = new URL(request.url);
	const query = url.searchParams.get("q")?.trim() ?? "";

	if (query.length < 2) {
		return NextResponse.json({ results: [] });
	}

	try {
		const outcome = await searchHardcover(query);

		return NextResponse.json(outcome);
	} catch {
		return NextResponse.json(
			{ results: [], error: "Unable to search books right now." },
			{ status: 500 },
		);
	}
}
