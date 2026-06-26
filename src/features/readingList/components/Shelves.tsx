import { BookMarked, BookOpen, BookCheck, X } from "lucide-react";
import { FC } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ReadingListType } from "@/features/readingList/types";
import { useFetchReadingList } from "@/features/readingList/api/useFetchReadingList";
import { Spinner } from "../../../components/ui/Spinner";
import { cn } from "@/lib/utils";

interface ShelvesProps {
	currentList: ReadingListType;
}
export const Shelves: FC<ShelvesProps> = ({ currentList }) => {
	const listBooksQuery = useFetchReadingList(currentList);
	const listsCount = listBooksQuery.data?.counts;

	const shelves: {
		type: ReadingListType;
		label: string;
		icon: React.ReactNode;
		count: number | undefined;
	}[] = [
		{
			type: "to_be_read",
			label: "TBR",
			icon: <BookMarked size={13} />,
			count: listsCount?.to_be_read,
		},
		{
			type: "reading",
			label: "Reading",
			icon: <BookOpen size={13} />,
			count: listsCount?.reading,
		},
		{
			type: "finished",
			label: "Finished",
			icon: <BookCheck size={13} />,
			count: listsCount?.finished,
		},
		{
			type: "did_not_finish",
			label: "DNF",
			icon: <X size={13} />,
			count: listsCount?.did_not_finish,
		},
	];

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const handleTabChange = (newType: string) => {
		const params = new URLSearchParams(searchParams);
		params.set("type", newType);

		// Updates the URL bar without reloading the full page
		router.push(`${pathname}?${params.toString()}`);
	};

	return (
		<div className="flex mx-4 mt-4 rounded-xl p-1 gap-1 bg-surface">
			{shelves.map((s) => (
				<button
					key={s.type}
					className={cn(
						"flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold font-nunito transition-all active:scale-95",
						currentList === s.type ? "bg-surface-high" : "bg-transparent",
						currentList === s.type ? "text-amber-bright" : "text-paper-dim",
						currentList === s.type
							? "shadow-[0_1px_6px_rgba(0,0,0,0.3)]"
							: "none",
					)}
					onClick={() => handleTabChange(s.type)}
				>
					{s.icon}
					{s.label}
					<span
						className={cn(
							"ml-0.5 text-xs rounded-full px-1.5 py-px",
							currentList === s.type ? "bg-amber-dim" : "bg-stone",
							currentList === s.type ? "text-amber-bright " : "text-paper-dim",
						)}
					>
						{!s.count && s.count !== 0 ? <Spinner /> : s.count}
					</span>
				</button>
			))}
		</div>
	);
};
