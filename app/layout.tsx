import type { Metadata } from "next";
import "./globals.css";
import styles from "./layout.module.css";
import { Providers } from "./providers";

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
		<html lang="en" className={styles.html}>
			<body className={styles.body}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
