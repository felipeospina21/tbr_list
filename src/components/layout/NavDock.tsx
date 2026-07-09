"use client";
import { motion } from "framer-motion";
import { BarChart2, BookOpen, Search, Smile } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { cn } from "@/lib/utils";
import { T } from "@/tokens";
import { NavItems } from "./PageSurface";

const base = "/reading-app";
const NAV_ITEMS = [
	{
		id: "library",
		label: "Library",
		route: base,
		icon: BookOpen,
		disabled: false,
	},
	{
		id: "search",
		label: "Search",
		route: `${base}/search`,
		icon: Search,
		disabled: false,
	},
	{
		id: "mood",
		label: "Mood",
		route: `${base}/mood`,
		icon: Smile,
		disabled: true,
	},
	{
		id: "stats",
		label: "Stats",
		route: `${base}/stats`,
		icon: BarChart2,
		disabled: true,
	},
] as const;

export type NavId = (typeof NAV_ITEMS)[number]["id"];

interface NavDockProps {
	activeNav: NavItems;
}

export const NavDock: FC<NavDockProps> = ({ activeNav }) => {
	return (
		<div className="fixed bottom-0 left-0 right-0 z-30 shrink-0 safe-bottom text-surface border-t-[1px_solid_var(--color-stone)] shadow-[0_-8px_32px_rgba(0,0,0,0.4)]">
			<div className="flex items-stretch h-18">
				{NAV_ITEMS.map((item) => {
					const Icon = item.icon;
					const isActive = activeNav === item.id;
					const isDisabled = item.disabled;
					return (
						<Link
							key={item.id}
							className={cn(
								"flex-1 flex flex-col items-center justify-center gap-1 transition-all active:scale-90 min-h-11",
								isDisabled ? "pointer-events-none " : null,
							)}
							aria-label={item.label}
							href={item.route}
						>
							{isDisabled && (
								<span className="text-xs absolute text-amber">coming soon</span>
							)}
							<motion.div
								className="flex items-center justify-center w-10 h-7 rounded-xl"
								animate={{
									backgroundColor: isActive ? T.amberDim : "transparent",
								}}
								transition={{ type: "spring", stiffness: 400, damping: 30 }}
							>
								<Icon
									size={17}
									className={cn(
										isActive ? "text-amber-bright" : "text-stone-light",
										isDisabled ? "opacity-50 text-gray-500" : null,
									)}
								/>
							</motion.div>
							<span
								className={cn(
									"font-nunito transition-all text-[10px]",
									isActive
										? "text-amber font-bold"
										: "text-stone-light font-normal",
								)}
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
