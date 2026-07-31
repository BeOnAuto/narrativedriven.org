import { readFileSync } from "node:fs";
import { join } from "node:path";
import { siteCard } from "@beonauto/og/meta";
import { defineConfig } from "vitepress";
import { cleanMarkdown } from "./clean-markdown";
import ogConfig from "../og.config.js";

const base = "/";
const siteUrl = ogConfig.siteUrl;

// One source of truth for the social card: the homepage hero in docs/index.md.
// The same `og.config.js` feeds scripts/og/template.html via `og generate`, so
// the image and the meta tags can't drift apart.
const ogCard = siteCard({
	siteUrl,
	srcDir: ogConfig.srcDir,
	siteName: ogConfig.siteName,
	image: ogConfig.ogImagePath,
	fallbacks: ogConfig.fallbacks,
});

function methodSidebar() {
	return [
		{
			text: "The Method",
			items: [
				{ text: "What is NDD?", link: "/what-is-ndd" },
				{
					text: "Anatomy of a Product Model",
					link: "/explanation/anatomy-of-a-product-model",
				},
				{ text: "Using NDD without Auto", link: "/using-ndd-without-auto.html" },
				{
					text: "What Makes a Narrative Buildable?",
					link: "/what-makes-a-narrative-buildable",
				},
				{ text: "How it Works", link: "/how-it-works" },
			],
		},
		{
			text: "Next Steps",
			items: [
				{ text: "Your First Narrative", link: "/guides/first-narrative" },
				{
					text: "Build the Concert Booking Platform",
					link: "/guides/build-concert-platform",
				},
				{
					text: "Model the Lens Rental Marketplace",
					link: "/guides/lens-rental-marketplace",
				},
				{ text: "Reference", link: "/reference/" },
			],
		},
	];
}

export default defineConfig({
	base,
	srcDir: "docs",
	vite: {
		server: {
			port: Number(process.env.PORT) || undefined,
			host: process.env.HOST || undefined,
			allowedHosts: [".ngrok.pizza"],
		},
	},
	lang: "en-US",
	title: "Narrative-Driven Development",
	description: ogCard.description,
	appearance: true,
	cleanUrls: true,

	transformPageData(pageData, { siteConfig }) {
		try {
			const filePath = join(siteConfig.srcDir, pageData.relativePath);
			const raw = readFileSync(filePath, "utf8");
			pageData.frontmatter = {
				...pageData.frontmatter,
				copyMarkdown: cleanMarkdown(raw),
			};
		} catch {
			// Non-file pages (e.g. dynamic routes)— silently skip.
		}
	},

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
		// Open Graph + Twitter — derived from the homepage hero (see ogCard above)
		...ogCard.head,
	],

	themeConfig: {
		siteTitle: false,

		nav: [
			{ text: "What is NDD?", link: "/what-is-ndd" },
			{ text: "Product Model", link: "/explanation/anatomy-of-a-product-model" },
			{
				text: "Examples",
				items: [
					{
						text: "Your First Narrative",
						link: "/guides/first-narrative",
					},
					{
						text: "Concert Booking",
						link: "/guides/build-concert-platform",
					},
					{
						text: "Lens Rental Marketplace",
						link: "/guides/lens-rental-marketplace",
					},
				],
			},
			{ text: "Use without Auto", link: "/using-ndd-without-auto.html" },
			{ text: "Reference", link: "/reference/" },
			{ text: "Try Auto early →", link: "https://on.auto" },
		],

		sidebar: {
			"/what-is-ndd": methodSidebar(),
			"/using-ndd-without-auto": methodSidebar(),
			"/using-ndd-without-auto.html": methodSidebar(),
			"/what-makes-a-narrative-buildable": methodSidebar(),
			"/how-it-works": methodSidebar(),
			"/for-practitioners": methodSidebar(),

			"/guides/": [
				{
					text: "Guides",
					items: [
						{ text: "Overview", link: "/guides/" },
						{
							text: "Understand the Method",
							items: [
								{
									text: "What is NDD?",
									link: "/what-is-ndd",
								},
								{
									text: "Anatomy of a Product Model",
									link: "/explanation/anatomy-of-a-product-model",
								},
								{
									text: "What Makes a Narrative Buildable?",
									link: "/what-makes-a-narrative-buildable",
								},
								{
									text: "How it Works",
									link: "/how-it-works",
								},
							],
						},
						{
							text: "Use NDD without Auto",
							items: [
								{
									text: "Using NDD without Auto",
									link: "/using-ndd-without-auto.html",
								},
								{
									text: "Prompting AI for NDD",
									link: "/guides/prompting-ai",
								},
								{
									text: "Review a Narrative",
									link: "/guides/review-a-narrative",
								},
							],
						},
						{
							text: "Study the Example",
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
									text: "Model the Lens Rental Marketplace",
									link: "/guides/lens-rental-marketplace",
								},
								{
									text: "Structuring Domains, Narratives, and Scenes",
									link: "/guides/structuring-narratives",
								},
							],
						},
						{
							text: "Go Deeper",
							items: [
								{
									text: "Explanation",
									link: "/explanation/",
								},
								{
									text: "Reference",
									link: "/reference/",
								},
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
							text: "Anatomy of a Product Model",
							link: "/explanation/anatomy-of-a-product-model",
						},
						{
							text: "Data Completeness",
							link: "/explanation/data-completeness",
						},
						{
							text: "Cohesion",
							link: "/explanation/cohesion",
						},
						{
							text: "Narrative Review Views",
							link: "/explanation/one-model-three-views",
						},
						{
							text: "Progressive Control",
							link: "/explanation/progressive-control",
						},
						{
							text: "NDD as a Spec Dialect",
							link: "/explanation/spec-dialect",
						},
						{
							text: "Background",
							items: [
								{
									text: "Standing on Shoulders",
									link: "/explanation/standing-on-shoulders",
								},
								{
									text: "The Origin Story",
									link: "/explanation/origin-story",
								},
							],
						},
					],
				},
			],
		},

		socialLinks: [
			{ icon: "discord", link: "https://discord.com/invite/B8BKcKMRm8" },
		],

		footer: {
			message:
				'NDD is the open product modeling technique. <a href="https://on.auto">Auto productizes the workflow.</a> Part of the <a href="https://specdriven.com">spec-driven</a> movement.',
			copyright: "© 2026 OnAuto, Inc. All rights reserved.",
		},

		search: {
			provider: "local",
		},

		outline: "deep",

		editLink: {
			pattern:
				"https://github.com/BeOnAuto/narrativedriven.org/edit/main/site/docs/:path",
			text: "See an error? Edit this page on GitHub",
		},
	},
});
