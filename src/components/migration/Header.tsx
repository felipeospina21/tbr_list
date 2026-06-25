import { BookMarked } from "lucide-react";
import { FC } from "react";
import { T } from "./constants";
import { NavId } from "./NavDock";
import { NavItems } from "../layout/PageSurface";

interface HeaderProps {
	activeNav: NavItems;
}

export const Header: FC<HeaderProps> = ({ activeNav }) => {
	const sectionTitle: Record<NavId, string> = {
		library: "NextRead",
		search: "Discover",
		mood: "Mood Match",
		stats: "My Stats",
	};

	return (
		<div
			className="flex-shrink-0 safe-top"
			style={{
				backgroundColor: T.surface,
				borderBottom: `1px solid ${T.stone}`,
			}}
		>
			<div className="flex items-center justify-between px-5 pt-2 pb-3">
				<h1
					className="font-lora text-2xl font-bold tracking-tight"
					style={{ color: T.paper }}
				>
					{sectionTitle[activeNav]}
				</h1>
				{/* Amber accent dot — brand mark */}
				<div
					className="w-8 h-8 rounded-full flex items-center justify-center"
					style={{ backgroundColor: T.amberDim }}
				>
					<BookMarked size={15} style={{ color: T.amber }} />
				</div>
			</div>
		</div>
	);
};
