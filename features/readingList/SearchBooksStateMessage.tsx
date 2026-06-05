"use client";

type SearchBooksStateMessageProps = {
	variant: "idle" | "loading" | "empty" | "error";
	message: string;
};

const stateClasses = {
	idle: "border-dashed border-white/12 bg-white/[0.03] text-white/60",
	loading: "border-white/12 bg-white/[0.03] text-white/60",
	empty: "border-dashed border-white/12 bg-white/[0.03] text-white/60",
	error: "border-rose-400/20 bg-rose-500/10 text-rose-100",
} as const;

export function SearchBooksStateMessage({
	variant,
	message,
}: SearchBooksStateMessageProps) {
	return (
		<div
			className={`rounded-2xl border px-4 py-6 text-sm ${stateClasses[variant]}`}
		>
			{message}
		</div>
	);
}
