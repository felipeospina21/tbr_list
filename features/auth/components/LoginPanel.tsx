"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import iconStyles from "@/components/Icon.module.css";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import styles from "./LoginPanel.module.css";

type LoginPanelProps = {
	callbackUrl: string;
};

export function LoginPanel({ callbackUrl }: LoginPanelProps) {
	function handleSignIn() {
		void signIn("google", { callbackUrl });
	}

	return (
		<div className={styles.root}>
			<div className={styles.eyebrow}>
				<Sparkles className={iconStyles.size4} />
				<Badge className={styles.badge} variant="secondary">
					Private reading list
				</Badge>
			</div>

			<Card className={styles.card}>
				<CardContent className={styles.content}>
					<h1 className={styles.title}>Sign in to your reading queue.</h1>

					<p className={styles.description}>
						Each account keeps its own list. Sign in with Google to open your
						private queue, add books, and keep the order in sync across devices.
					</p>

					<div className={styles.actions}>
						<Button
							className={styles.primaryButton}
							variant="secondary"
							onClick={handleSignIn}
						>
							Sign in with Google
							<ArrowRight className={iconStyles.size4} />
						</Button>

						<Link href="/" className={styles.secondaryLink}>
							Back to landing
						</Link>
					</div>

					<p className={styles.note}>
						After sign-in, you&apos;ll return to your reading list
						automatically.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
