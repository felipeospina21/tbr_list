import { AnimatePresence, motion } from "framer-motion";
import { Smile } from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";
import { T } from "./constants";
import { EmptyMoodSuggestion } from "./EmptyMoodSuggestion";
import { MoodDrawerHeader } from "./MoodDrawerHeader";
import { MoodShuffling } from "./MoodShuffling";
import { MoodSuggestion } from "./MoodSuggestion";
import { Book } from "./types";

interface MoodDrawerProps {
	drawerOpen: boolean;
	isShuffling: boolean;
	selectedMood: string | null;
	setDrawerOpen: Dispatch<SetStateAction<boolean>>;
	suggestion: Book | null;
	books: Book[];
	pickBook: (mood: string) => void;
}

export const MoodDrawer: FC<MoodDrawerProps> = ({
	drawerOpen,
	setDrawerOpen,
	selectedMood,
	isShuffling,
	books,
	suggestion,
	pickBook,
}) => {
	return (
		<AnimatePresence>
			{drawerOpen && (
				<>
					<motion.div
						className="fixed inset-0 z-40"
						style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setDrawerOpen(false)}
					/>
					<motion.div
						className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl px-5 pt-5"
						style={{
							backgroundColor: T.surfaceHigh,
							borderTop: `1px solid ${T.stone}`,
							paddingBottom: "calc(88px + env(safe-area-inset-bottom, 0px))",
						}}
						initial={{ y: "100%" }}
						animate={{ y: 0 }}
						exit={{ y: "100%" }}
						transition={{ type: "spring", stiffness: 400, damping: 40 }}
					>
						<div
							className="w-8 h-0.5 rounded-full mx-auto mb-5"
							style={{ backgroundColor: T.stone }}
						/>
						<MoodDrawerHeader
							setDrawerOpen={setDrawerOpen}
							selectedMood={selectedMood}
						/>

						{isShuffling ? (
							<MoodShuffling books={books} />
						) : suggestion ? (
							<MoodSuggestion suggestion={suggestion} />
						) : (
							<EmptyMoodSuggestion />
						)}

						{!isShuffling && suggestion && (
							<motion.button
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
								className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-nunito text-sm font-semibold mt-4 active:scale-[0.98] transition-transform"
								style={{ backgroundColor: T.amber, color: T.night }}
								onClick={() => {
									setDrawerOpen(false);
									pickBook(selectedMood!);
								}}
							>
								<Smile size={15} />
								Shuffle Again
							</motion.button>
						)}
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};
