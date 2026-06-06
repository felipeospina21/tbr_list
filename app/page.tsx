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
import iconStyles from "@/components/Icon.module.css";
import { SectionBackdrop } from "@/components/SectionBackdrop";
import { debugComponentAttrs } from "@/lib/debug";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

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
		<main className={styles.main} {...debugComponentAttrs("LandingPage")}>
			<section className={styles.hero} {...debugComponentAttrs("LandingHero")}>
				<SectionBackdrop />
				<div className={styles.heroGlow} />

				<div className={styles.heroShell}>
					<div className={styles.intro}>
						<div className={styles.eyebrow}>
							<Sparkles className={iconStyles.size4} />
							<Badge className={styles.badge} variant="secondary">
								Editorial reading app
							</Badge>
						</div>

						<h1 className={styles.title}>Keep the next book within reach.</h1>

						<p className={styles.lede}>
							TBR List is a quiet reading queue for people who care about
							sequence. Add books, reorder them by mood, and keep the whole list
							available on mobile without losing clarity.
						</p>

						<div className={styles.actions}>
							<Link
								href="/workspace"
								className={cn(styles.buttonBase, styles.primaryButton)}
							>
								Open the app
								<ArrowRight className={iconStyles.size4} />
							</Link>
							<a
								href="#story"
								className={cn(styles.buttonBase, styles.secondaryButton)}
							>
								See the flow
							</a>
						</div>

						<div className={styles.chips}>
							<div className={styles.chip}>
								<BookOpenText className={styles.chipIcon} />
								One list, always visible
							</div>
							<div className={styles.chip}>
								<MoveRight className={styles.chipIcon} />
								Manual ordering
							</div>
							<div className={styles.chip}>
								<Search className={styles.chipIcon} />
								Search built in
							</div>
						</div>
					</div>

					<div className={styles.previewWrap}>
						<div className={styles.previewGlow} />
						<Card
							className={styles.previewCard}
							{...debugComponentAttrs("LandingPreviewCard")}
						>
							<CardHeader className={styles.previewHeader}>
								<div className={styles.previewRow}>
									<div>
										<p className={styles.previewEyebrow}>Reading list</p>
										<CardTitle className={styles.previewTitle}>
											Books to read next
										</CardTitle>
									</div>
									<div className={styles.previewBadge}>PWA</div>
								</div>
								<CardDescription className={styles.previewDescription}>
									A compact reading surface that keeps the queue legible and
									reorderable on the smallest screens.
								</CardDescription>
							</CardHeader>

							<CardContent className={styles.previewContent}>
								<div className={styles.bookList}>
									{[
										{
											title: "The Left Hand of Darkness",
											meta: "Ursula K. Le Guin",
											energy: "Move up",
											accent: styles.dotAmber,
										},
										{
											title: "Braiding Sweetgrass",
											meta: "Robin Wall Kimmerer",
											energy: "Keep steady",
											accent: styles.dotPaper,
										},
										{
											title: "A Swim in a Pond in the Rain",
											meta: "George Saunders",
											energy: "Move down",
											accent: styles.dotGreen,
										},
									].map((book, index) => (
										<div
											key={book.title}
											className={cn(
												styles.bookItem,
												index === 0
													? styles.bookItemTop
													: styles.bookItemRegular,
											)}
										>
											<div className={styles.bookRow}>
												<div className={cn(styles.bookDot, book.accent)} />
												<div className={styles.bookMetaWrap}>
													<div className={styles.bookMetaRow}>
														<div>
															<p className={styles.bookTitle}>{book.title}</p>
															<p className={styles.bookMeta}>{book.meta}</p>
														</div>
														<span className={styles.bookEnergy}>
															{book.energy}
														</span>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			<section
				id="story"
				className={styles.story}
				{...debugComponentAttrs("LandingStory")}
			>
				<div className={styles.storyGrid}>
					<div className={styles.storyIntro}>
						<p className={styles.eyebrowMuted}>What it solves</p>
						<h2 className={styles.storyTitle}>
							A reading queue with just enough ceremony.
						</h2>
						<p className={styles.storyCopy}>
							This page is designed to feel closer to a literary cover spread
							than a dashboard. It gives the app a stronger first impression
							while keeping the message direct.
						</p>
					</div>

					<div className={styles.featureGrid}>
						{features.map((feature, index) => {
							const Icon = feature.icon;

							return (
								<Card
									key={feature.title}
									className={cn(
										styles.featureCard,
										index === 1 && styles.featureCardAccent,
									)}
									{...debugComponentAttrs("LandingFeatureCard")}
								>
									<CardHeader className={styles.featureHeader}>
										<div
											className={cn(
												styles.featureIconWrap,
												index === 1 ? styles.featureIconWrapAccent : "",
											)}
										>
											<Icon className={iconStyles.size4} />
										</div>
										<CardTitle className={styles.featureTitle}>
											{feature.title}
										</CardTitle>
										<CardDescription
											className={cn(
												styles.featureDescription,
												index === 1 && styles.featureDescriptionAccent,
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

			<section
				className={styles.cta}
				{...debugComponentAttrs("LandingCallToAction")}
			>
				<Card
					className={styles.ctaCard}
					{...debugComponentAttrs("LandingCallToActionCard")}
				>
					<CardContent className={styles.ctaContent}>
						<div className={styles.ctaIntro}>
							<p className={styles.eyebrowMuted}>Ready to read</p>
							<h2 className={styles.ctaTitle}>
								Open the app and put your queue back in order.
							</h2>
							<p className={styles.ctaCopy}>
								Use this landing route as a polished front door while the main
								app continues to live elsewhere.
							</p>
						</div>

						<div className={styles.ctaActions}>
							<Link
								href="/workspace"
								className={cn(styles.buttonBase, styles.ctaPrimary)}
							>
								Start using TBR List
								<ArrowRight className={iconStyles.size4} />
							</Link>
							<a
								href="#story"
								className={cn(styles.buttonBase, styles.ctaSecondary)}
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
