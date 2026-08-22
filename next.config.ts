import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "books.google.com",
			},
			{
				protocol: "https",
				hostname: "books.googleusercontent.com",
			},
			{
				protocol: "https",
				hostname: "covers.openlibrary.org",
			},
			{
				protocol: "https",
				hostname: "assets.hardcover.app",
			},
		],
	},
};

export default withSerwist(nextConfig);
