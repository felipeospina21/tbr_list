import { FC } from "react";
import { T } from "./constants";

export const EmptyMoodSuggestion: FC = () => {
	return (
		<div
			className="text-center py-8 rounded-2xl"
			style={{
				backgroundColor: T.surfaceRaised,
				border: `1px solid ${T.stone}`,
			}}
		>
			<p className="font-lora text-base" style={{ color: T.paperDim }}>
				No matching books
			</p>
			<p className="font-nunito text-sm mt-1" style={{ color: T.stoneLight }}>
				Add books with this mood to your library
			</p>
		</div>
	);
};
