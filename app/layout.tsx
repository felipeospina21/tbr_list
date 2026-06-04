import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "TBR List",
	description: "A mobile-first reading list for books you want to tackle next.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="h-full antialiased">
			<body className="min-h-full flex flex-col">{children}</body>
		</html>
	);
}
