import { AnimatePresence, motion } from "framer-motion";
import { FC, useState } from "react";
import { INITIAL_BOOKS, T } from "./constants";
import { Book } from "./types";
import { LibrarySection } from "./LibrarySection";
import { SearchSection } from "./SearchSection";
import { StatsSection } from "./StatsSection";
import { MoodSection } from "./MoodSection";

interface NavPageContentProps {
	activeNav: "library" | "search" | "mood" | "stats";
	direction: number;
}

export const NavPageContent: FC<NavPageContentProps> = ({
	activeNav,
	direction,
}) => {
	const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);

	const pageVariants = {
		enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
		center: { x: 0, opacity: 1 },
		exit: (dir: number) => ({ x: dir < 0 ? "100%" : "-100%", opacity: 0 }),
	};

	const pageTransition = {
		type: "spring" as const,
		stiffness: 300,
		damping: 35,
		mass: 0.8,
	};

	return (
		<div
			className="flex-1 overflow-hidden relative"
			style={{ backgroundColor: T.night }}
		>
			<AnimatePresence mode="popLayout" custom={direction}>
				<motion.div
					key={activeNav}
					custom={direction}
					variants={pageVariants}
					initial="enter"
					animate="center"
					exit="exit"
					transition={pageTransition}
					className="absolute inset-0 flex flex-col"
					style={{ backgroundColor: T.night }}
				>
					<div className="flex-1 overflow-hidden flex flex-col nav-safe-bottom">
						{activeNav === "library" && (
							<LibrarySection books={books} setBooks={setBooks} />
						)}
						{activeNav === "search" && (
							<SearchSection books={books} setBooks={setBooks} />
						)}
						{activeNav === "mood" && <MoodSection books={books} />}
						{activeNav === "stats" && <StatsSection books={books} />}
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	);
};
