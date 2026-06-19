import { BookMarked, BookOpen, BookCheck, X } from "lucide-react";
import { FC } from "react";
import { T } from "./constants";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ReadingListType } from "@/features/readingList/types/readingList";
import { ReadingListBook } from "@/features/readingList/server/queries/getReadingListWithBooks";

interface ShelvesProps {
	currentList: ReadingListType;
	books: ReadingListBook[] | undefined;
}
export const Shelves: FC<ShelvesProps> = ({ currentList, books }) => {
	const shelves: {
		type: ReadingListType;
		label: string;
		icon: React.ReactNode;
	}[] = [
		{
			type: "to_be_read",
			label: "TBR",
			icon: <BookMarked size={13} />,
		},
		{
			type: "reading",
			label: "Reading",
			icon: <BookOpen size={13} />,
		},
		{ type: "finished", label: "Finished", icon: <BookCheck size={13} /> },
		{ type: "did_not_finish", label: "DNF", icon: <X size={13} /> },
	];

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const handleTabChange = (newType: string) => {
		console.log(newType);
		const params = new URLSearchParams(searchParams);
		params.set("type", newType);

		// Updates the URL bar without reloading the full page
		router.push(`${pathname}?${params.toString()}`);
	};

	return (
		<div
			className="flex mx-4 mt-4 rounded-xl p-1 gap-1"
			style={{ backgroundColor: T.surface }}
		>
			{shelves.map((s) => (
				<button
					key={s.type}
					className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold font-nunito transition-all active:scale-95"
					style={{
						backgroundColor:
							currentList === s.type ? T.surfaceHigh : "transparent",
						color: currentList === s.type ? T.amberBright : T.paperDim,
						boxShadow:
							currentList === s.type ? "0 1px 6px rgba(0,0,0,0.3)" : "none",
					}}
					onClick={() => handleTabChange(s.type)}
				>
					{s.icon}
					{s.label}
					<span
						className="ml-0.5 text-xs rounded-full px-1.5 py-px"
						style={{
							backgroundColor: currentList === s.type ? T.amberDim : T.stone,
							color: currentList === s.type ? T.amberBright : T.paperDim,
						}}
					>
						{books?.length}
					</span>
				</button>
			))}
		</div>
	);
};
