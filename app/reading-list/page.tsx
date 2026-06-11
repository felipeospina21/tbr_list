import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { Suspense } from "react";

import { getAuthOptions } from "@/auth";
import { ReadingListHydration } from "@/features/readingList/components/ReadingListHydration";
import { ReadingListPending } from "@/features/readingList/components/ReadingListPending";
import { getInitialListSlug } from "@/features/readingList/routing/getInitialListSlug";

interface ReadingListPageProps {
	searchParams: Promise<{
		listSlug?: string | string[];
	}>;
}

export default async function ReadingListPage({
	searchParams,
}: ReadingListPageProps) {
	const session = await getServerSession(getAuthOptions());

	if (!session?.user?.id) {
		redirect("/login?callbackUrl=/reading-list");
	}

	const initialListSlug = getInitialListSlug(await searchParams);

	return (
		<Suspense
			fallback={<ReadingListPending initialListSlug={initialListSlug} />}
		>
			<ReadingListHydration
				initialListSlug={initialListSlug}
				userId={session.user.id}
			/>
		</Suspense>
	);
}
