import type { Metadata } from "next";
import { Lora, Nunito_Sans } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
import { Providers } from "./providers";

const lora = Lora({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	style: ["normal", "italic"],
	variable: "--app-font-serif",
	display: "swap",
});

const nunitoSans = Nunito_Sans({
	subsets: ["latin"],
	weight: ["300", "400", "600", "700", "800"],
	variable: "--app-font-sans",
	display: "swap",
});

export const metadata: Metadata = {
	title: {
		default: "TBR List",
		template: "%s | TBR List",
	},
	description: "A mobile-first reading list for books you want to tackle next.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${styles.html} ${lora.variable} ${nunitoSans.variable}`}
		>
			<body className={styles.body}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
