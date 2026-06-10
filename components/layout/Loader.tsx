import type { FC } from "react";

import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";
import styles from "./Loader.module.css";

interface LoaderProps {
	className?: string;
}

export const Loader: FC<LoaderProps> = ({ className }) => {
	return (
		<div className={cn(styles.loader, className)} aria-busy="true">
			<Spinner className={styles.spinner} />
		</div>
	);
};
