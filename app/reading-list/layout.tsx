import type { FC, ReactNode } from "react";

import { PageSurface } from "@/components/layout/PageSurface";
import styles from "./layout.module.css";

interface ReadingListLayoutProps {
	children: ReactNode;
}

const ReadingListLayout: FC<ReadingListLayoutProps> = ({ children }) => {
	return (
		<PageSurface
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
