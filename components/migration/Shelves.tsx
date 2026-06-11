import { BookOpen, BookMarked, X } from "lucide-react";
import { T } from "./constants";
import { ShelfKey } from "./types";
import { Dispatch, FC, SetStateAction } from "react";
import { Book } from "@/features/readingList/types/readingList";

interface ShelvesProps {
	activeShelf: ShelfKey;
	setActiveShelf: Dispatch<SetStateAction<ShelfKey>>;
	books: Book[];
	selectedSlug: string;
}
export const Shelves: FC<ShelvesProps> = ({
	activeShelf,
	books,
	setActiveShelf,
}) => {
	const shelves: { key: ShelfKey; label: string; icon: React.ReactNode }[] = [
		{ key: "to_be_read", label: "TBR", icon: <BookMarked size={13} /> },
		{ key: "reading", label: "Reading", icon: <BookOpen size={13} /> },
		{ key: "dnf", label: "DNF", icon: <X size={13} /> },
	];

	return (
		<div
			className="flex mx-4 mt-4 rounded-xl p-1 gap-1"
			style={{ backgroundColor: T.surface }}
		>
			{shelves.map((s) => (
				<button
					key={s.key}
					className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold font-nunito transition-all active:scale-95"
					style={{
						backgroundColor:
							activeShelf === s.key ? T.surfaceHigh : "transparent",
						color: activeShelf === s.key ? T.amberBright : T.paperDim,
						boxShadow:
							activeShelf === s.key ? "0 1px 6px rgba(0,0,0,0.3)" : "none",
					}}
					onClick={() => setActiveShelf(s.key)}
				>
					{s.icon}
					{s.label}
					<span
						className="ml-0.5 text-xs rounded-full px-1.5 py-px"
						style={{
							backgroundColor: activeShelf === s.key ? T.amberDim : T.stone,
							color: activeShelf === s.key ? T.amberBright : T.paperDim,
						}}
					>
						{books.filter((b) => b.shelf === s.key).length}
					</span>
				</button>
			))}
		</div>
	);
};
