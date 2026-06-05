import type { Metadata } from "next";

import { ReadingList } from "@/features/readingList/ReadingList";

export const metadata: Metadata = {
	title: "TBR List App",
	description: "Your personal reading list and book search workspace.",
};

export default function ReadingListPage() {
	return <ReadingList />;
}
