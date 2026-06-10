import { BookPlus } from "lucide-react";
import { FC } from "react";
import { Button } from "@/components/Button";
import iconStyles from "@/components/Icon.module.css";
import { cn } from "@/lib/utils";
import { useAddBookToReadingList } from "../mutations/useAddBookToReadingList";
import { Book } from "../types/readingList";
import style from "./SearchBooksCardActions.module.css";

interface SearchBooksCardActionsProps {
	isAdded: boolean;
	activeListSlug: "to_be_read" | "finished" | "did_not_finish";
	book: Book;
}

export const SearchBooksCardActions: FC<SearchBooksCardActionsProps> = ({
	isAdded,
	book,
	activeListSlug,
}) => {
	const addBookMutation = useAddBookToReadingList(activeListSlug);

	return (
		<div className={style.actionWrap}>
			<Button
				type="button"
				variant={isAdded ? "secondary" : "default"}
				onClick={() => addBookMutation.mutate(book)}
				disabled={isAdded}
				className={cn(
					style.actionButton,
					isAdded ? style.added : style.notAdded,
				)}
			>
				<BookPlus className={iconStyles.size4} />
				{isAdded ? "Added to list" : "Add to list"}
			</Button>
		</div>
	);
};
