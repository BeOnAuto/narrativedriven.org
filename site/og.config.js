// Open Graph config — read by `og generate` (@beonauto/og) and by
// .vitepress/config.mts. The social card's copy comes from the homepage hero in
// docs/index.md; only fields the frontmatter can't express live here.

export default {
	siteUrl: "https://narrativedriven.org",
	srcDir: "docs",
	siteName: "Narrative-Driven Development",
	ogImagePath: "/og-image.png",

	fallbacks: {
		// Keep the established "Stories" wording in the title; the description and
		// the rest derive from the hero (text + tagline), so they stay in sync
		// with the homepage and mention intent.
		title: "Narrative-Driven Development. Specify Software as Stories",
	},

	generate: {
		root: ".",
		template: "scripts/og/template.html",
		outputDir: "docs/public",
		variants: [
			{ theme: "dark", output: "og-dark.png" },
			{ theme: "light", output: "og-light.png" },
		],
		defaultOutput: "og-light.png",
	},
};
