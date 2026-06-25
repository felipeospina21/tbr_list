import { motion } from "framer-motion";
import { FC } from "react";
import { T } from "@/tokens";

interface LibraryBreakdownStatsProps {
	reading: number;
	tbr: number;
	dnf: number;
}

export const LibraryBreakdownStats: FC<LibraryBreakdownStatsProps> = ({
	dnf,
	reading,
	tbr,
}) => {
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
				Library Breakdown
			</p>
			<div className="flex gap-1.5 h-2.5 rounded-full overflow-hidden">
				{[
					{ count: reading, color: T.amber, label: "Reading" },
					{ count: tbr, color: T.amberDim, label: "TBR" },
					{ count: dnf, color: T.stone, label: "DNF" },
				].map((s) =>
					s.count > 0 ? (
						<motion.div
							key={s.label}
							className="h-full rounded-full"
							style={{ backgroundColor: s.color }}
							initial={{ flex: 0 }}
							animate={{ flex: s.count }}
							transition={{ duration: 0.6, ease: "easeOut" }}
						/>
					) : null,
				)}
			</div>
			<div className="flex gap-4 mt-3">
				{[
					{ label: "Reading", count: reading, color: T.amber },
					{ label: "TBR", count: tbr, color: T.paperDim },
					{ label: "DNF", count: dnf, color: T.stoneLight },
				].map((s) => (
					<div key={s.label} className="flex items-center gap-1.5">
						<div
							className="w-2 h-2 rounded-full"
							style={{ backgroundColor: s.color }}
						/>
						<span className="font-nunito text-xs" style={{ color: T.paperDim }}>
							{s.label} ({s.count})
						</span>
					</div>
				))}
			</div>
		</div>
	);
};
