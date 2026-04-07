import { defineConfig } from "vitepress";

const base = "/";
const siteUrl = "https://www.narrativedriven.org";

export default defineConfig({
	base,
	srcDir: "docs",
	vite: {
		server: {
			port: Number(process.env.PORT) || undefined,
			host: process.env.HOST || undefined,
		},
	},
	lang: "en-US",
	title: "Narrative-Driven Development",
	description:
		"Specify software as narratives. One model for storyboard, docs, code, and tests. Auto turns it into working software.",
	appearance: true,
	cleanUrls: true,

	head: [
		// Favicon
		["link", { rel: "icon", type: "image/png", href: `${base}favicon.png` }],
		// Fonts (preconnect for performance)
		["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
		[
			"link",
			{ rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
		],
		[
			"link",
			{
				href: "https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;600&display=swap",
				rel: "stylesheet",
			},
		],
		// OpenGraph
		[
			"meta",
			{
				property: "og:title",
				content: "Narrative-Driven Development — Specify Software as Stories",
			},
		],
		["meta", { property: "og:type", content: "website" }],
		[
			"meta",
			{
				property: "og:description",
				content:
					"One model for storyboard, docs, code, and tests. Specify software as structured narratives — reviewable, testable, and executable.",
			},
		],
		["meta", { property: "og:url", content: siteUrl }],
		[
			"meta",
			{ property: "og:site_name", content: "Narrative-Driven Development" },
		],
		["meta", { property: "og:image", content: `${siteUrl}/og-image.png` }],
		["meta", { property: "og:image:width", content: "1200" }],
		["meta", { property: "og:image:height", content: "630" }],
		[
			"meta",
			{
				property: "og:image:alt",
				content:
					"Narrative-Driven Development — Tell the story. Build the software.",
			},
		],
		["meta", { name: "twitter:card", content: "summary_large_image" }],
		[
			"meta",
			{
				name: "twitter:title",
				content: "Narrative-Driven Development — Specify Software as Stories",
			},
		],
		[
			"meta",
			{
				name: "twitter:description",
				content:
					"One model for storyboard, docs, code, and tests. Specify software as structured narratives — reviewable, testable, and executable.",
			},
		],
		["meta", { name: "twitter:image", content: `${siteUrl}/og-image.png` }],
	],

	themeConfig: {
		siteTitle: false,

		nav: [
			{ text: "What is NDD?", link: "/what-is-ndd" },
			{ text: "How it Works", link: "/guides/narratives-to-code" },
			{ text: "Example", link: "/guides/first-narrative" },
			{
				text: "Learn",
				items: [
					{ text: "Guides", link: "/guides/" },
					{ text: "Reference", link: "/reference/" },
					{ text: "Explanation", link: "/explanation/" },
					{ text: "Community", link: "/community" },
				],
			},
			{
				text: "Try on Auto",
				link: "https://on.auto",
				target: "_blank",
			},
		],

		sidebar: {
			"/what-is-ndd": [
				{
					text: "Getting Started",
					items: [
						{ text: "What is NDD?", link: "/what-is-ndd" },
						{ text: "Your First Narrative", link: "/guides/first-narrative" },
					],
				},
			],

			"/guides/": [
				{
					text: "Guides",
					items: [
						{ text: "Overview", link: "/guides/" },
						{
							text: "Getting Started",
							items: [
								{
									text: "Your First Narrative",
									link: "/guides/first-narrative",
								},
								{
									text: "Build the Concert Booking Platform",
									link: "/guides/build-concert-platform",
								},
								{
									text: "Structuring Narratives and Scenes",
									link: "/guides/structuring-narratives",
								},
							],
						},
						{
							text: "Working with NDD",
							items: [
								{
									text: "Collaborative Sessions",
									link: "/guides/collaborative-sessions",
								},
								{
									text: "Narratives to Running Code",
									link: "/guides/narratives-to-code",
								},
								{ text: "Prompting AI for NDD", link: "/guides/prompting-ai" },
							],
						},
					],
				},
			],

			"/reference/": [
				{
					text: "Reference",
					items: [
						{ text: "Overview", link: "/reference/" },
						{ text: "Moment Types", link: "/reference/moment-types" },
						{ text: "Glossary", link: "/reference/glossary" },
					],
				},
			],

			"/explanation/": [
				{
					text: "Explanation",
					items: [
						{ text: "Overview", link: "/explanation/" },
						{
							text: "Why Storytelling Works",
							link: "/explanation/why-storytelling",
						},
						{
							text: "Data Completeness",
							link: "/explanation/data-completeness",
						},
						{
							text: "One Model, Three Views",
							link: "/explanation/one-model-three-views",
						},
						{
							text: "Standing on Shoulders",
							link: "/explanation/standing-on-shoulders",
						},
						{
							text: "NDD as a Spec Dialect",
							link: "/explanation/spec-dialect",
						},
						{ text: "The Origin Story", link: "/explanation/origin-story" },
					],
				},
			],
		},

		socialLinks: [
			{
				icon: "github",
				link: "https://github.com/BeOnAuto/narrativedriven.org",
			},
			{ icon: "discord", link: "https://discord.com/invite/B8BKcKMRm8" },
		],

		footer: {
			message:
				'A <a href="https://specdriven.com/dialects/narrative-driven">spec dialect</a> by <a href="https://on.auto">Auto</a>. Part of the <a href="https://specdriven.com">spec-driven</a> movement.',
			copyright: "© 2026 OnAuto, Inc. All rights reserved.",
		},

		search: {
			provider: "local",
		},

		outline: "deep",

		editLink: {
			pattern:
				"https://github.com/BeOnAuto/narrativedriven.org/edit/main/docs/:path",
			text: "See an error? Edit this page on GitHub",
		},
	},
});
