import { motion } from "framer-motion";
import { FC } from "react";
import { T } from "./constants";
import { Book } from "./types";

interface GenreBreakdownStatsProps {
	books: Book[];
	total: number;
}

export const GenreBreakdownStats: FC<GenreBreakdownStatsProps> = ({
	books,
	total,
}) => {
	const genreCounts: Record<string, number> = {};
	books.forEach((b) => {
		genreCounts[b.genre] = (genreCounts[b.genre] ?? 0) + 1;
	});

	const topGenres = Object.entries(genreCounts)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 4);

	return (
		<div
			className="rounded-2xl p-4"
			style={{
				backgroundColor: T.surfaceRaised,
				border: `1px solid ${T.stone}`,
			}}
		>
			<p
				className="font-nunito text-xs uppercase tracking-widest font-semibold mb-3"
				style={{ color: T.amber }}
			>
				Top Genres
			</p>
			<div className="flex flex-col gap-3">
				{topGenres.map(([genre, count]) => {
					const pct = Math.round((count / total) * 100);
					return (
						<div key={genre}>
							<div className="flex justify-between items-center mb-1">
								<span
									className="font-nunito text-sm"
									style={{ color: T.paper }}
								>
									{genre}
								</span>
								<span
									className="font-nunito text-xs font-semibold"
									style={{ color: T.amberBright }}
								>
									{count} books
								</span>
							</div>
							<div
								className="w-full rounded-full overflow-hidden"
								style={{ height: 3, backgroundColor: T.stone }}
							>
								<motion.div
									className="h-full rounded-full"
									style={{ backgroundColor: T.amber }}
									initial={{ width: 0 }}
									animate={{ width: `${pct}%` }}
									transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
								/>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
