import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { getAuthOptions } from "@/auth";
import { ReadingList } from "@/features/readingList/ReadingList";

export const metadata: Metadata = {
	title: "TBR List App",
	description: "Your personal reading list and book search workspace.",
};

export const dynamic = "force-dynamic";

export default async function ReadingListPage() {
	const session = await getServerSession(getAuthOptions());

	if (!session?.user?.id) {
		redirect("/login?callbackUrl=/reading-list");
	}

	const accountLabel =
		session.user.email ?? session.user.name ?? "Signed in reader";

	return <ReadingList accountLabel={accountLabel} />;
}
