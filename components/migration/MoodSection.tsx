"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Smile, X } from "lucide-react";
import { SetStateAction, useState } from "react";
import { T } from "./constants";
import { MoodCard } from "./MoodCard";
import { MoodDrawer } from "./MoodDrawer";
import { Book } from "./types";

const MOODS = [
	"contemplative",
	"hopeful",
	"mysterious",
	"calm",
	"melancholic",
	"tender",
	"tense",
];

export const MOOD_EMOJI: Record<string, string> = {
	contemplative: "🌿",
	hopeful: "🌤",
	mysterious: "🌙",
	calm: "🍃",
	melancholic: "🌧",
	tender: "🌸",
	tense: "⚡",
};

export const MoodSection = ({ books }: { books: Book[] }) => {
	const [selectedMood, setSelectedMood] = useState<string | null>(null);
	const [isShuffling, setIsShuffling] = useState(false);
	const [suggestion, setSuggestion] = useState<Book | null>(null);
	const [drawerOpen, setDrawerOpen] = useState(false);

	const pickBook = (mood: string) => {
		setSelectedMood(mood);
		setIsShuffling(true);
		setDrawerOpen(true);
		const matches = books.filter(
			(b) => b.mood?.includes(mood) && b.shelf !== "dnf",
		);
		setTimeout(() => {
			setIsShuffling(false);
			setSuggestion(
				matches.length > 0
					? matches[Math.floor(Math.random() * matches.length)]
					: null,
			);
		}, 1400);
	};

	return (
		<div className="flex flex-col h-full">
			<div className="px-4 pt-5 pb-3">
				<h2
					className="font-lora text-xl font-semibold"
					style={{ color: T.paper }}
				>
					How are you feeling?
				</h2>
				<p className="font-nunito text-sm mt-1" style={{ color: T.paperDim }}>
					Pick a mood and we'll suggest your next read.
				</p>
			</div>

			<div className="flex-1 overflow-y-auto px-4 pb-4">
				<div className="grid grid-cols-2 gap-2.5">
					{MOODS.map((mood) => {
						return (
							<MoodCard
								key={mood}
								mood={mood}
								books={books}
								pickBook={pickBook}
								selectedMood={selectedMood}
							/>
						);
					})}
				</div>
			</div>

			{/* Mood Drawer */}
			<MoodDrawer
				drawerOpen={drawerOpen}
				isShuffling={isShuffling}
				selectedMood={selectedMood}
				setDrawerOpen={setDrawerOpen}
				suggestion={suggestion}
				books={books}
				pickBook={pickBook}
			/>
		</div>
	);
};
