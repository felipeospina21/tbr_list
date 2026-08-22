import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "My Reading List App",
		short_name: "ReadingList",
		description: "Track and manage your books and reading lists",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#000000",
		icons: [
			{
				src: "/tbr_icon_192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/tbr_icon_512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
