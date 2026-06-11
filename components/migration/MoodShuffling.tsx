import { motion } from "framer-motion";
import { FC } from "react";
import { T } from "./constants";
import { Book } from "./types";

interface MoodShufflingProps {
	books: Book[];
}

export const MoodShuffling: FC<MoodShufflingProps> = ({ books }) => {
	return (
		<div className="flex gap-3 mb-5">
			{[0, 1, 2].map((i) => (
				<motion.div
					key={i}
					className="rounded-xl overflow-hidden flex-1"
					style={{ height: 140, backgroundColor: T.stone }}
					animate={{ rotateY: [0, 180, 360], scale: [1, 0.95, 1] }}
					transition={{
						duration: 0.7,
						delay: i * 0.15,
						repeat: 1,
						ease: "easeInOut",
					}}
				>
					<img
						src={books[i % books.length]?.img_url}
						alt="shuffling"
						className="w-full h-full object-cover opacity-40"
					/>
				</motion.div>
			))}
		</div>
	);
};
