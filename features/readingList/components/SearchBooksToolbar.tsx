"use client";

import { Search, X } from "lucide-react";

import { Button } from "@/components/Button";
import iconStyles from "@/components/Icon.module.css";
import { Input } from "@/components/Input";
import styles from "./SearchBooksToolbar.module.css";

type SearchBooksToolbarProps = {
	query: string;
	onQueryChange: (query: string) => void;
};

export function SearchBooksToolbar({
	query,
	onQueryChange,
}: SearchBooksToolbarProps) {
	const canClear = query.trim().length > 0;

	return (
		<div className={styles.toolbar}>
			<div className={styles.searchWrap}>
				<Search className={`${styles.searchIcon} ${iconStyles.size4}`} />
				<Input
					value={query}
					onChange={(event) => onQueryChange(event.target.value)}
					placeholder="Search by title or author"
					className={styles.input}
				/>
			</div>
			<Button
				type="button"
				variant="outline"
				onClick={() => onQueryChange("")}
				disabled={!canClear}
				className={styles.clearButton}
			>
				<X className={iconStyles.size4} />
				Clear
			</Button>
		</div>
	);
}
