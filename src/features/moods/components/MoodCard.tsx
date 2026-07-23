import { motion } from "framer-motion";
import { FC } from "react";
import { T } from "./constants";
import { MOOD_EMOJI } from "./MoodSection";
import { Book } from "./types";

interface MoodCardProps {
	mood: string;
	books: Book[];
	selectedMood: string | null;
	pickBook: (mood: string) => void;
}

export const MoodCard: FC<MoodCardProps> = ({
	mood,
	books,
	selectedMood,
	pickBook,
}) => {
	const count = books.filter(
		(b) => b.mood?.includes(mood) && b.shelf !== "dnf",
	).length;
	const isSelected = selectedMood === mood;

	return (
		<motion.button
			whileTap={{ scale: 0.96 }}
			className="flex flex-col items-center justify-center py-5 px-3 rounded-2xl text-center active:opacity-80 transition-all"
			style={{
				backgroundColor: isSelected ? T.amberDim : T.surfaceRaised,
				border: `1px solid ${isSelected ? T.amber : T.stone}`,
				color: isSelected ? T.amberBright : T.paper,
				boxShadow: isSelected ? `0 0 0 1px ${T.amber}` : "none",
			}}
			onClick={() => pickBook(mood)}
		>
			<span className="text-2xl mb-1.5">{MOOD_EMOJI[mood]}</span>
			<span className="font-nunito text-sm font-semibold capitalize">
				{mood}
			</span>
			<span
				className="font-nunito text-xs mt-0.5"
				style={{ color: isSelected ? T.amber : T.stoneLight }}
			>
				{count} {count === 1 ? "book" : "books"}
			</span>
		</motion.button>
	);
};
