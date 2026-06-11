"use client";

import { BookOpen, Shuffle } from "lucide-react";
import Image from "next/image";
import { type FC, useMemo, useState } from "react";
import iconStyles from "@/components/Icon.module.css";
import { Button } from "@/components/ui/Button";
import {
	READING_LIST_MOOD_EMOJI,
	READING_LIST_MOODS,
} from "../constants/readingListMoods";
import type { Book } from "../types/readingList";
import styles from "./MoodMatchPanel.module.css";

interface MoodMatchPanelProps {
	books: Book[];
}

export const MoodMatchPanel: FC<MoodMatchPanelProps> = ({ books }) => {
	const [selectedMood, setSelectedMood] = useState<string | null>(null);
	const [shuffleIndex, setShuffleIndex] = useState(0);
	const availableBooks = books.filter((book) => book.moods.length > 0);
	const matchingBooks = selectedMood
		? books.filter((book) => book.moods.includes(selectedMood))
		: [];
	const suggestion = useMemo(() => {
		if (matchingBooks.length === 0) {
			return null;
		}

		return matchingBooks[shuffleIndex % matchingBooks.length];
	}, [matchingBooks, shuffleIndex]);

	return (
		<section className={styles.panel}>
			<div className={styles.header}>
				<p className={styles.eyebrow}>Mood match</p>
				<h2 className={styles.title}>Pick the tone for your next read.</h2>
				<p className={styles.copy}>
					Mood tags are editable from each book's options.
				</p>
			</div>

			<div className={styles.moodGrid}>
				{READING_LIST_MOODS.map((mood) => {
					const count = books.filter((book) =>
						book.moods.includes(mood),
					).length;
					const isSelected = selectedMood === mood;

					return (
						<button
							key={mood}
							type="button"
							className={
								isSelected
									? `${styles.moodCard} ${styles.moodCardSelected}`
									: styles.moodCard
							}
							onClick={() => {
								setSelectedMood(mood);
								setShuffleIndex(0);
							}}
						>
							<span className={styles.moodMark}>
								{READING_LIST_MOOD_EMOJI[mood]}
							</span>
							<span className={styles.moodName}>{mood}</span>
							<span className={styles.moodCount}>
								{count} {count === 1 ? "book" : "books"}
							</span>
						</button>
					);
				})}
			</div>

			<div className={styles.suggestion}>
				{suggestion ? (
					<>
						<Image
							className={styles.cover}
							src={suggestion.cover}
							alt={suggestion.title}
							width={88}
							height={144}
							unoptimized
						/>
						<div className={styles.suggestionContent}>
							<p className={styles.suggestionEyebrow}>{selectedMood} pick</p>
							<h3 className={styles.suggestionTitle}>{suggestion.title}</h3>
							<p className={styles.suggestionAuthor}>{suggestion.author}</p>
							<div className={styles.suggestionMeta}>
								<BookOpen className={iconStyles.size3} aria-hidden="true" />
								{typeof suggestion.pages === "number"
									? `${suggestion.pages} pages`
									: "Page count unavailable"}
							</div>
							<Button
								type="button"
								className={styles.shuffleButton}
								onClick={() => setShuffleIndex((current) => current + 1)}
							>
								<Shuffle className={iconStyles.size4} aria-hidden="true" />
								Shuffle
							</Button>
						</div>
					</>
				) : (
					<div className={styles.emptyState}>
						<BookOpen className={styles.emptyIcon} aria-hidden="true" />
						<p>
							{availableBooks.length === 0
								? "Add mood tags to your books to unlock suggestions."
								: "Choose a mood with at least one tagged book."}
						</p>
					</div>
				)}
			</div>
		</section>
	);
};
