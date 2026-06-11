import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import type { FC, ReactNode } from "react";

import { getAuthOptions } from "@/auth";
import { PageSurface } from "@/components/layout/PageSurface";
import { ReadingListNavbar } from "@/features/readingList/components/ReadingListNavbar";
import styles from "./layout.module.css";

interface ReadingListLayoutProps {
	children: ReactNode;
}

const ReadingListLayout: FC<ReadingListLayoutProps> = async ({ children }) => {
	const session = await getServerSession(getAuthOptions());

	if (!session?.user?.id) {
		redirect("/login?callbackUrl=/reading-list");
	}

	const accountLabel =
		session.user.email ?? session.user.name ?? "Signed in reader";

	return (
		<PageSurface
			decorations={<ReadingListNavbar accountLabel={accountLabel} />}
			shellClassName={styles.shell}
			surfaceClassName={styles.surface}
			debugName="ReadingListPage"
			surfaceDebugName="ReadingListSurface"
		>
			{children}
		</PageSurface>
	);
};

export default ReadingListLayout;
