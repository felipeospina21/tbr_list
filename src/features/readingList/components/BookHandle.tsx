import { DragControls } from "framer-motion";
import { GripVertical } from "lucide-react";
import { FC } from "react";

export const BookHandle: FC<{ controls: DragControls }> = ({ controls }) => {
	return (
		<div
			className="flex items-center px-2 cursor-grab active:cursor-grabbing touch-none text-stone-light"
			onPointerDown={(e) => {
				controls.start(e);
			}}
		>
			<GripVertical size={16} />
		</div>
	);
};
