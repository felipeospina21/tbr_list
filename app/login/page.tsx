import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { getAuthOptions } from "@/auth";
import { SectionBackdrop } from "@/components/SectionBackdrop";
import { LoginPanel } from "@/features/auth/components/LoginPanel";
import styles from "./page.module.css";

export const metadata: Metadata = {
	title: "Sign In",
	description: "Sign in to access your private reading list.",
};

export const dynamic = "force-dynamic";

type LoginPageProps = {
	searchParams?: {
		callbackUrl?: string;
	};
};

function normalizeCallbackUrl(callbackUrl?: string) {
	if (!callbackUrl) {
		return "/reading-list";
	}

	if (callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")) {
		return callbackUrl;
	}

	return "/reading-list";
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
	const session = await getServerSession(getAuthOptions());

	if (session) {
		redirect(normalizeCallbackUrl(searchParams?.callbackUrl));
	}

	const callbackUrl = normalizeCallbackUrl(searchParams?.callbackUrl);

	return (
		<main className={styles.main}>
			<SectionBackdrop />
			<div className={styles.shell}>
				<LoginPanel callbackUrl={callbackUrl} />
			</div>
		</main>
	);
}
