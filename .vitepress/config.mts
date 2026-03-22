import { defineConfig } from 'vitepress'

const base = '/'
const siteUrl = 'https://www.narrativedriven.org'

export default defineConfig({
  base,
  srcDir: 'docs',
  vite: {
    server: {
      port: Number(process.env.PORT) || undefined,
      host: process.env.HOST || undefined,
    },
  },
  lang: 'en-US',
  title: 'Narrative-Driven Development',
  description: 'A narrative model for software. One shared model for storyboard, docs, code, and tests. Auto turns it into working software.',
  appearance: true,
  cleanUrls: true,

  head: [
    // Favicon
    ['link', { rel: 'icon', type: 'image/png', href: `${base}favicon.png` }],
    // Fonts (preconnect for performance)
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    // OpenGraph
    ['meta', { property: 'og:title', content: 'Narrative-Driven Development' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:description', content: 'A narrative model for software. Auto turns the model into working software.' }],
    ['meta', { property: 'og:url', content: siteUrl }],
    ['meta', { property: 'og:site_name', content: 'Narrative-Driven Development' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Narrative-Driven Development' }],
    ['meta', { name: 'twitter:description', content: 'A narrative model for software. Auto makes it real.' }],
  ],

  themeConfig: {
    siteTitle: false,

    nav: [
      { text: 'What is NDD?', link: '/what-is-ndd' },
      { text: 'How it Works', link: '/guides/narratives-to-code' },
      { text: 'Example', link: '/guides/first-narrative' },
      { text: 'Docs', items: [
        { text: 'Guides', link: '/guides/' },
        { text: 'Reference', link: '/reference/' },
        { text: 'Explanation', link: '/explanation/' },
        { text: 'Community', link: '/community' },
      ]},
      {
        text: 'Try on Auto',
        link: 'https://on.auto',
        target: '_blank',
      },
    ],

    sidebar: {
      '/what-is-ndd': [
        {
          text: 'Getting Started',
          items: [
            { text: 'What is NDD?', link: '/what-is-ndd' },
            { text: 'Your First Narrative', link: '/guides/first-narrative' },
          ],
        },
      ],

      '/guides/': [
        {
          text: 'Guides',
          items: [
            { text: 'Overview', link: '/guides/' },
            {
              text: 'Getting Started',
              items: [
                { text: 'Your First Narrative', link: '/guides/first-narrative' },
                { text: 'Build the Concert Booking Platform', link: '/guides/build-concert-platform' },
                { text: 'Structuring Narratives and Scenes', link: '/guides/structuring-narratives' },
              ],
            },
            {
              text: 'Working with NDD',
              items: [
                { text: 'Collaborative Sessions', link: '/guides/collaborative-sessions' },
                { text: 'Narratives to Running Code', link: '/guides/narratives-to-code' },
                { text: 'Prompting AI for NDD', link: '/guides/prompting-ai' },
              ],
            },
          ],
        },
      ],

      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'Overview', link: '/reference/' },
            { text: 'Moment Types', link: '/reference/moment-types' },
            { text: 'Glossary', link: '/reference/glossary' },
          ],
        },
      ],

      '/explanation/': [
        {
          text: 'Explanation',
          items: [
            { text: 'Overview', link: '/explanation/' },
            { text: 'Why Storytelling Works', link: '/explanation/why-storytelling' },
            { text: 'Data Completeness', link: '/explanation/data-completeness' },
            { text: 'One Model, Three Views', link: '/explanation/one-model-three-views' },
            { text: 'Standing on Shoulders', link: '/explanation/standing-on-shoulders' },
            { text: 'NDD as a Spec Dialect', link: '/explanation/spec-dialect' },
            { text: 'The Origin Story', link: '/explanation/origin-story' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/BeOnAuto/auto-engineer' },
      { icon: 'discord', link: 'https://discord.com/invite/B8BKcKMRm8' },
    ],

    footer: {
      message: 'A <a href="https://specdriven.com/dialects/narrative-driven">spec dialect</a> by <a href="https://on.auto">Auto</a>. Part of the <a href="https://specdriven.com">spec-driven</a> movement.',
      copyright: '© 2026 OnAuto, Inc. All rights reserved.',
    },

    search: {
      provider: 'local',
    },

    outline: 'deep',

    editLink: {
      pattern: 'https://github.com/BeOnAuto/narrativedriven.org/edit/main/docs/:path',
      text: 'See an error? Edit this page on GitHub',
    },
  },
})
