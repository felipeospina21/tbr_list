import Image from "next/image";
import { FC } from "react";

interface BookImageProps {
	url: string;
	title: string;
}
export const BookImage: FC<BookImageProps> = ({ title, url }) => {
	return (
		<div className="relative shrink-0 w-[68] min-h-[104]">
			<Image
				src={url}
				alt={title}
				className="w-full h-full object-cover"
				width={100}
				height={150}
			/>
		</div>
	);
};
