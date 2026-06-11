/* ─────────────────────────────────────────────
   MIDNIGHT-LIBRARY TOKENS (mirrored from CSS vars)
   Used inline where CSS vars can't reach styled-components or motion values.
───────────────────────────────────────────── */
export const T = {
	night: "#13171c",
	surface: "#1a1f26",
	surfaceRaised: "#212830",
	surfaceHigh: "#2a323c",
	stone: "#3a4552",
	stoneLight: "#4d5a68",
	paper: "#e8e0d0",
	paperDim: "#b8ad9e",
	amber: "#c98a38",
	amberBright: "#e8a84a",
	amberDim: "rgba(201,138,56,0.18)",
	ember: "#8b3a2a",
	emberBg: "rgba(139,58,42,0.18)",
};

export const INITIAL_BOOKS: Book[] = [
	{
		id: "1",
		title: "The Midnight Library",
		author: "Matt Haig",
		img_url:
			"https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_66037916a7_adc57fa29f766a59.png",
		genre: "Literary Fiction",
		pages: 304,
		pagesRead: 187,
		rating: 4,
		mood: ["contemplative", "hopeful"],
		year: 2020,
		shelf: "reading",
	},
	{
		id: "2",
		title: "Piranesi",
		author: "Susanna Clarke",
		img_url:
			"https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_8a088cb961_b628e3f4e568bba3.png",
		genre: "Fantasy",
		pages: 272,
		pagesRead: 0,
		mood: ["mysterious", "calm"],
		year: 2020,
		shelf: "tbr",
	},
	{
		id: "3",
		title: "Crying in H Mart",
		author: "Michelle Zauner",
		img_url:
			"https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_f0091b14dd_48c0a2893479091a.png",
		genre: "Memoir",
		pages: 256,
		pagesRead: 0,
		mood: ["melancholic", "tender"],
		year: 2021,
		shelf: "tbr",
	},
	{
		id: "4",
		title: "The Overstory",
		author: "Richard Powers",
		img_url:
			"https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_4c2ece04f7_90a42d84fc901ded.png",
		genre: "Literary Fiction",
		pages: 502,
		pagesRead: 0,
		mood: ["contemplative", "hopeful"],
		year: 2018,
		shelf: "tbr",
	},
	{
		id: "5",
		title: "My Year of Rest",
		author: "Ottessa Moshfegh",
		img_url:
			"https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_4570640476_0a9e758f007076b8.png",
		genre: "Literary Fiction",
		pages: 289,
		pagesRead: 0,
		mood: ["melancholic", "contemplative"],
		year: 2018,
		shelf: "tbr",
	},
	{
		id: "6",
		title: "Mexican Gothic",
		author: "Silvia Moreno-Garcia",
		img_url:
			"https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_a45856aa96_5fb2ef2909266f0b.png",
		genre: "Gothic Horror",
		pages: 301,
		pagesRead: 22,
		mood: ["mysterious", "tense"],
		year: 2020,
		shelf: "reading",
	},
	{
		id: "7",
		title: "Kafka on the Shore",
		author: "Haruki Murakami",
		img_url:
			"https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_675ceff3d2_f17f690705d9e6b5.png",
		genre: "Magical Realism",
		pages: 505,
		pagesRead: 0,
		mood: ["mysterious", "contemplative"],
		year: 2002,
		shelf: "dnf",
	},
	{
		id: "8",
		title: "Lincoln in the Bardo",
		author: "George Saunders",
		img_url:
			"https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_263b834ded_d180483722993207.png",
		genre: "Historical Fiction",
		pages: 368,
		pagesRead: 0,
		mood: ["melancholic"],
		year: 2017,
		shelf: "dnf",
	},
];
