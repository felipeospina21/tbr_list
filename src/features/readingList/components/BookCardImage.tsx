import Image from "next/image";
import { FC } from "react";
import { SchemaBook } from "../types/readingList";
import styles from "./BookCardImage.module.css";

interface BookCardImageProps {
	book: SchemaBook;
	index: number;
}

export const BookCardImage: FC<BookCardImageProps> = ({ book, index }) => {
	return (
		<div className={styles.coverWrap}>
			<Image
				src={book.cover}
				alt={`${book.title} cover`}
				fill
				className={styles.coverImage}
				sizes="(max-width: 768px) 40vw, 168px"
				unoptimized
				priority={index === 0}
			/>
		</div>
	);
};
