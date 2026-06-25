import { FC } from "react";
import { T } from "@/tokens";

interface StatsCardsProps {
	total: number;
	totalPages: number;
	tbr: number;
	reading: number;
}

export const StatsCards: FC<StatsCardsProps> = ({
	reading,
	tbr,
	total,
	totalPages,
}) => {
	const statCards = [
		{ label: "Total Books", value: total, accent: T.amber },
		{ label: "Reading", value: reading, accent: T.amberBright },
		{ label: "TBR Queue", value: tbr, accent: T.paperDim },
		{
			label: "Pages Read",
			value: totalPages.toLocaleString(),
			accent: T.stoneLight,
		},
	];
	return (
		<div className="grid grid-cols-2 gap-2.5">
			{statCards.map((s) => (
				<div
					key={s.label}
					className="rounded-2xl p-4"
					style={{
						backgroundColor: T.surfaceRaised,
						border: `1px solid ${T.stone}`,
					}}
				>
					<p
						className="font-nunito text-xs uppercase tracking-widest font-semibold"
						style={{ color: s.accent }}
					>
						{s.label}
					</p>
					<p
						className="font-lora text-2xl font-bold mt-1"
						style={{ color: T.paper }}
					>
						{s.value}
					</p>
				</div>
			))}
		</div>
	);
};
