import { X } from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";
import { T } from "./constants";
import { MOOD_EMOJI } from "./MoodSection";

interface MoodDrawerHeaderProps {
	setDrawerOpen: Dispatch<SetStateAction<boolean>>;
	selectedMood: string | null;
}

export const MoodDrawerHeader: FC<MoodDrawerHeaderProps> = ({
	setDrawerOpen,
	selectedMood,
}) => {
	return (
		<div className="flex items-center justify-between mb-4">
			<div>
				<p
					className="font-nunito text-xs uppercase tracking-widest font-semibold"
					style={{ color: T.amber }}
				>
					{MOOD_EMOJI[selectedMood!]} {selectedMood} pick
				</p>
				<h3
					className="font-lora text-lg font-semibold mt-0.5"
					style={{ color: T.paper }}
				>
					Your Next Read
				</h3>
			</div>
			<button
				className="w-8 h-8 flex items-center justify-center rounded-full active:opacity-60"
				style={{
					backgroundColor: T.surfaceRaised,
					color: T.paperDim,
				}}
				onClick={() => setDrawerOpen(false)}
			>
				<X size={15} />
			</button>
		</div>
	);
};
