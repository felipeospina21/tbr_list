"use client";

import { useState } from "react";
import { BookOpen, Search, Smile, BarChart2 } from "lucide-react";
import { NavDock } from "@/components/migration/NavDock";
import { Header } from "@/components/migration/Header";
import { NavPageContent } from "@/components/migration/NavPageContent";
import { T } from "@/components/migration/constants";

const NAV_ITEMS = [
	{ id: "library", label: "Library", icon: BookOpen },
	{ id: "search", label: "Search", icon: Search },
	{ id: "mood", label: "Mood", icon: Smile },
	{ id: "stats", label: "Stats", icon: BarChart2 },
] as const;

type NavId = (typeof NAV_ITEMS)[number]["id"];

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function Index() {
	const [activeNav, setActiveNav] = useState<NavId>("library");
	const [_, setPrevNav] = useState<NavId>("library");
	const [direction, setDirection] = useState(0);

	const navOrder: NavId[] = ["library", "search", "mood", "stats"];

	const navigate = (id: NavId) => {
		const curr = navOrder.indexOf(activeNav);
		const next = navOrder.indexOf(id);
		setDirection(next > curr ? 1 : -1);
		setPrevNav(activeNav);
		setActiveNav(id);
	};

	return (
		<div
			className="flex flex-col w-full overflow-hidden"
			style={{
				height: "100dvh",
				backgroundColor: T.night,
				fontFamily: "'Nunito Sans', sans-serif",
			}}
		>
			{/* Header */}
			<Header activeNav={activeNav} />

			{/* Animated page content */}
			<NavPageContent activeNav={activeNav} direction={direction} />

			{/* Bottom Navigation Dock */}
			<NavDock navigate={navigate} activeNav={activeNav} />
		</div>
	);
}
