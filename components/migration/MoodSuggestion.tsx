import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { FC } from "react";
import { T } from "./constants";
import { MOOD_EMOJI } from "./MoodSection";
import { Book } from "./types";

interface MoodSuggestionProps {
	suggestion: Book;
}

export const MoodSuggestion: FC<MoodSuggestionProps> = ({ suggestion }) => {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.96 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
			className="flex gap-4 rounded-2xl p-4"
			style={{
				backgroundColor: T.surfaceRaised,
				border: `1px solid ${T.stone}`,
			}}
		>
			<div
				className="flex-shrink-0 rounded-xl overflow-hidden"
				style={{ width: 76, height: 116 }}
			>
				<img
					src={suggestion.img_url}
					alt={suggestion.title}
					className="w-full h-full object-cover"
				/>
			</div>
			<div className="flex flex-col justify-between min-w-0">
				<div>
					<p
						className="font-lora text-base font-semibold leading-tight"
						style={{ color: T.paper }}
					>
						{suggestion.title}
					</p>
					<p className="font-nunito text-sm mt-1" style={{ color: T.paperDim }}>
						{suggestion.author}
					</p>
					<div className="flex flex-wrap gap-1 mt-2">
						{suggestion.mood?.map((m) => (
							<span
								key={m}
								className="font-nunito text-xs px-2 py-0.5 rounded-full"
								style={{
									backgroundColor: T.stone,
									color: T.paperDim,
								}}
							>
								{MOOD_EMOJI[m]} {m}
							</span>
						))}
					</div>
				</div>
				<div className="flex items-center gap-1 mt-2">
					<Clock size={12} style={{ color: T.amber }} />
					<span className="font-nunito text-xs" style={{ color: T.paperDim }}>
						{suggestion.pages} pages
					</span>
				</div>
			</div>
		</motion.div>
	);
};
