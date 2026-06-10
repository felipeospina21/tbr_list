"use client";

import type { FC } from "react";

import { ErrorSurface } from "@/components/layout/ErrorSurface";

interface ReadingListErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

const ReadingListError: FC<ReadingListErrorProps> = ({ reset }) => {
	return (
		<ErrorSurface
			title="Unable to load your reading list"
			message="The reading list could not be loaded. Try again, or come back once the connection is stable."
			onAction={reset}
		/>
	);
};

export default ReadingListError;
