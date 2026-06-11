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
	const accountLabel =
		session.user.email ?? session.user.name ?? "Signed in reader";

	return (
		<Suspense
			fallback={
				<ReadingListPending
					accountLabel={accountLabel}
					initialListSlug={initialListSlug}
				/>
			}
		>
			<ReadingListHydration
				accountLabel={accountLabel}
				initialListSlug={initialListSlug}
				userId={session.user.id}
			/>
		</Suspense>
	);
}
