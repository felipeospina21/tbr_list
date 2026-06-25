"use client";
import { Search, X } from "lucide-react";
import { useMemo, useRef, useState, useTransition } from "react";
import { useBookSearchData } from "@/features/readingList/api/useBookSearchData";
import { T } from "@/tokens";
import { SearchSuggestions } from "./SearchSuggestions";
import { Spinner } from "@/components/ui/Spinner";

function debounce<Args extends unknown[]>(
	fn: (...args: Args) => void,
	delay: number,
): (...args: Args) => void {
	let timer: ReturnType<typeof setTimeout> | undefined;

	return (...args: Args): void => {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => fn(...args), delay);
	};
}

export const SearchSection = () => {
	const [displayQuery, setDisplayQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	// 1. Grab the React 19 transition pending state
	const [isPending, startTransition] = useTransition();

	const updateDebounce = useMemo(() => {
		return debounce((val: string) => {
			// 2. Wrap the query key state change in a transition!
			startTransition(() => {
				setDebouncedQuery(val);
			});
		}, 500);
	}, []);

	const searchBook = useBookSearchData(debouncedQuery, {
		enabled: debouncedQuery.trim().length > 2,
	});

	const updateQuery = (value: string) => {
		setDisplayQuery(value);
		updateDebounce(value);
	};

	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		updateQuery(value);
	};

	const onInputClear = () => {
		updateQuery("");
		inputRef.current?.focus();
	};

	return (
		<div className="flex flex-col h-full">
			{/* Search input */}
			<div className="px-4 pt-4">
				<div
					className="flex items-center gap-2 px-3 py-3 rounded-xl"
					style={{
						backgroundColor: T.surfaceRaised,
						border: `1px solid ${T.stone}`,
					}}
				>
					<Search size={16} style={{ color: T.amber }} />
					<input
						ref={inputRef}
						type="text"
						placeholder="Search by title or author…"
						value={displayQuery}
						onChange={onInputChange}
						className="flex-1 bg-transparent text-sm font-nunito outline-none placeholder:opacity-40"
						style={{ color: T.paper }}
					/>
					{searchBook.isFetching && <Spinner />}
					<button onClick={onInputClear} style={{ color: T.stoneLight }}>
						<X size={15} />
					</button>
				</div>
			</div>
			<SearchSuggestions
				query={debouncedQuery}
				books={searchBook.data?.results}
				isPending={searchBook.isFetching}
			/>
		</div>
	);
};
