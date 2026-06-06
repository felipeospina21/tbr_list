"use client";

import styles from "./SearchBooksStateMessage.module.css";

type SearchBooksStateMessageProps = {
	variant: "idle" | "loading" | "empty" | "error";
	message: string;
};

export function SearchBooksStateMessage({
	variant,
	message,
}: SearchBooksStateMessageProps) {
	return (
		<div className={`${styles.message} ${styles[variant]}`}>{message}</div>
	);
}
