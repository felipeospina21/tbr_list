import {
	ArrowRight,
	BookOpenText,
	LibraryBig,
	MoveRight,
	Search,
	Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/Badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/Card";
import { SectionBackdrop } from "@/components/SectionBackdrop";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "TBR List Landing",
	description: "An editorial landing page for the TBR List app.",
};

const features = [
	{
		icon: MoveRight,
		title: "Order that feels natural",
		copy: "Slide books up and down until the queue matches the reading mood you actually have.",
	},
	{
		icon: Search,
		title: "Search without friction",
		copy: "Find titles fast, keep the flow intact, and avoid bouncing between tabs or notes.",
	},
	{
		icon: LibraryBig,
		title: "Built for one hand",
		copy: "The layout stays legible and touchable on mobile, then expands cleanly on desktop.",
	},
];

export default function LandingPage() {
	return (
		<main className="min-h-screen bg-[#0d1110] text-stone-50">
			<section className="relative isolate overflow-hidden">
				<SectionBackdrop />
				<div className="absolute left-1/2 top-12 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-200/10 blur-3xl" />

				<div className="mx-auto grid w-full max-w-7xl gap-10 px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-12 lg:px-8 lg:pb-20 lg:pt-10">
					<div className="max-w-2xl">
						<div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.34em] text-white/55">
							<Sparkles className="size-4 text-amber-200/90" />
							<Badge
								className="border-white/10 bg-white/6 text-white/82"
								variant="secondary"
							>
								Editorial reading app
							</Badge>
						</div>

						<h1 className="mt-6 max-w-[11ch] font-serif text-6xl leading-[0.88] tracking-[-0.04em] text-balance sm:text-7xl lg:text-[5.5rem]">
							Keep the next book within reach.
						</h1>

						<p className="mt-6 max-w-xl text-base leading-8 text-white/74 sm:text-lg">
							TBR List is a quiet reading queue for people who care about
							sequence. Add books, reorder them by mood, and keep the whole list
							available on mobile without losing clarity.
						</p>

						<div className="mt-8 flex flex-col gap-3 sm:flex-row">
							<Link
								href="/workspace"
								className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-amber-200 px-5 text-sm font-semibold text-stone-950 shadow-[0_16px_40px_rgba(243,201,147,0.2)] transition-transform transition-colors hover:-translate-y-0.5 hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1110]"
							>
								Open the app
								<ArrowRight className="size-4" />
							</Link>
							<a
								href="#story"
								className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/14 bg-white/4 px-5 text-sm font-semibold text-white/88 backdrop-blur transition-colors hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1110]"
							>
								See the flow
							</a>
						</div>

						<div className="mt-8 flex flex-wrap gap-3 text-sm text-white/68">
							<div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-3 py-2">
								<BookOpenText className="size-4 text-amber-200/90" />
								One list, always visible
							</div>
							<div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-3 py-2">
								<MoveRight className="size-4 text-amber-200/90" />
								Manual ordering
							</div>
							<div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-3 py-2">
								<Search className="size-4 text-amber-200/90" />
								Search built in
							</div>
						</div>
					</div>

					<div className="relative mx-auto w-full max-w-[34rem]">
						<div className="absolute inset-x-8 top-8 -z-10 h-[28rem] rounded-[2.5rem] bg-black/30 blur-3xl" />
						<Card className="overflow-hidden border-white/10 bg-[#121817]/88 text-white shadow-[0_36px_100px_rgba(0,0,0,0.4)] backdrop-blur-md">
							<CardHeader className="gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
											Reading list
										</p>
										<CardTitle
											className={cn(
												"mt-2 font-serif text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl",
											)}
										>
											Books to read next
										</CardTitle>
									</div>
									<div className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
										PWA
									</div>
								</div>
								<CardDescription className="max-w-md text-sm leading-6 text-white/66">
									A compact reading surface that keeps the queue legible and
									reorderable on the smallest screens.
								</CardDescription>
							</CardHeader>

							<CardContent className="space-y-3 px-4 py-4 sm:px-5 sm:py-5">
								{[
									{
										title: "The Left Hand of Darkness",
										meta: "Ursula K. Le Guin",
										energy: "Move up",
										accent: "bg-amber-200",
									},
									{
										title: "Braiding Sweetgrass",
										meta: "Robin Wall Kimmerer",
										energy: "Keep steady",
										accent: "bg-white/80",
									},
									{
										title: "A Swim in a Pond in the Rain",
										meta: "George Saunders",
										energy: "Move down",
										accent: "bg-emerald-200/90",
									},
								].map((book, index) => (
									<div
										key={book.title}
										className={cn(
											"rounded-[1.35rem] border px-4 py-4 transition-transform duration-300",
											index === 0
												? "border-white/14 bg-white/8 translate-y-0"
												: "border-white/8 bg-white/[0.04]",
										)}
									>
										<div className="flex items-start gap-4">
											<div
												className={cn("mt-1 size-3 rounded-full", book.accent)}
											/>
											<div className="min-w-0 flex-1">
												<div className="flex items-start justify-between gap-4">
													<div className="min-w-0">
														<p className="truncate text-sm font-semibold text-white">
															{book.title}
														</p>
														<p className="mt-1 text-sm text-white/58">
															{book.meta}
														</p>
													</div>
													<span className="shrink-0 rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/68">
														{book.energy}
													</span>
												</div>
											</div>
										</div>
									</div>
								))}
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			<section
				id="story"
				className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
			>
				<div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
					<div className="max-w-lg">
						<p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/50">
							What it solves
						</p>
						<h2
							className={cn(
								"mt-4 font-serif text-4xl leading-[0.96] tracking-[-0.03em] text-balance sm:text-5xl",
							)}
						>
							A reading queue with just enough ceremony.
						</h2>
						<p className="mt-4 max-w-md text-sm leading-7 text-white/68 sm:text-base">
							This page is designed to feel closer to a literary cover spread
							than a dashboard. It gives the app a stronger first impression
							while keeping the message direct.
						</p>
					</div>

					<div className="grid gap-4 sm:grid-cols-3">
						{features.map((feature, index) => {
							const Icon = feature.icon;

							return (
								<Card
									key={feature.title}
									className={cn(
										"border-white/10 bg-white/[0.05] text-white shadow-[0_18px_50px_rgba(0,0,0,0.2)]",
										index === 1 && "bg-amber-200 text-stone-950",
									)}
								>
									<CardHeader className="gap-4 p-5">
										<div
											className={cn(
												"flex size-10 items-center justify-center rounded-full border",
												index === 1
													? "border-stone-950/10 bg-white/45"
													: "border-white/10 bg-white/8",
											)}
										>
											<Icon className="size-4" />
										</div>
										<CardTitle className="text-lg font-semibold tracking-[-0.02em]">
											{feature.title}
										</CardTitle>
										<CardDescription
											className={cn(
												"text-sm leading-6",
												index === 1 ? "text-stone-950/72" : "text-white/66",
											)}
										>
											{feature.copy}
										</CardDescription>
									</CardHeader>
								</Card>
							);
						})}
					</div>
				</div>
			</section>

			<section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
				<Card className="overflow-hidden border-white/10 bg-[linear-gradient(135deg,_rgba(245,219,171,0.18)_0%,_rgba(255,255,255,0.04)_32%,_rgba(17,23,21,0.94)_100%)] text-white shadow-[0_30px_90px_rgba(0,0,0,0.32)]">
					<CardContent className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl">
							<p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/52">
								Ready to read
							</p>
							<h2
								className={cn(
									"mt-4 font-serif text-4xl leading-[0.95] tracking-[-0.03em] text-balance sm:text-5xl",
								)}
							>
								Open the app and put your queue back in order.
							</h2>
							<p className="mt-4 max-w-xl text-sm leading-7 text-white/72 sm:text-base">
								Use this landing route as a polished front door while the main
								app continues to live elsewhere.
							</p>
						</div>

						<div className="flex flex-col gap-3 sm:flex-row">
							<Link
								href="/workspace"
								className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-amber-200 px-5 text-sm font-semibold text-stone-950 shadow-[0_16px_40px_rgba(243,201,147,0.2)] transition-transform transition-colors hover:-translate-y-0.5 hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1110]"
							>
								Start using TBR List
								<ArrowRight className="size-4" />
							</Link>
							<a
								href="#story"
								className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/14 bg-white/4 px-5 text-sm font-semibold text-white/88 backdrop-blur transition-colors hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1110]"
							>
								Review the story
							</a>
						</div>
					</CardContent>
				</Card>
			</section>
		</main>
	);
}
