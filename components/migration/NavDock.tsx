"use client";
import { motion } from "framer-motion";
import { BarChart2, BookOpen, Search, Smile } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { T } from "./constants";

const base = "/reading-app";
const NAV_ITEMS = [
	{ id: "library", route: base, label: "Library", icon: BookOpen },
	{ id: "search", label: "Search", route: `${base}/search`, icon: Search },
	{ id: "mood", label: "Mood", route: `${base}/mood`, icon: Smile },
	{ id: "stats", label: "Stats", route: `${base}/stats`, icon: BarChart2 },
] as const;

export type NavId = (typeof NAV_ITEMS)[number]["id"];

interface NavDockProps {
	activeNav: "library" | "search" | "mood" | "stats";
}

export const NavDock: FC<NavDockProps> = ({ activeNav }) => {
	return (
		<div
			className="fixed bottom-0 left-0 right-0 z-30 flex-shrink-0 safe-bottom"
			style={{
				backgroundColor: T.surface,
				borderTop: `1px solid ${T.stone}`,
				boxShadow: "0 -8px 32px rgba(0,0,0,0.4)",
			}}
		>
			<div className="flex items-stretch" style={{ height: 72 }}>
				{NAV_ITEMS.map((item) => {
					const Icon = item.icon;
					const isActive = activeNav === item.id;
					return (
						<Link
							key={item.id}
							className="flex-1 flex flex-col items-center justify-center gap-1 transition-all active:scale-90 min-h-[44px]"
							aria-label={item.label}
							href={item.route}
						>
							<motion.div
								className="flex items-center justify-center w-10 h-7 rounded-xl"
								animate={{
									backgroundColor: isActive ? T.amberDim : "transparent",
								}}
								transition={{ type: "spring", stiffness: 400, damping: 30 }}
							>
								<Icon
									size={17}
									style={{ color: isActive ? T.amberBright : T.stoneLight }}
								/>
							</motion.div>
							<span
								className="font-nunito transition-all"
								style={{
									color: isActive ? T.amber : T.stoneLight,
									fontWeight: isActive ? 700 : 400,
									fontSize: 10,
								}}
							>
								{item.label}
							</span>
						</Link>
					);
				})}
			</div>
		</div>
	);
};
