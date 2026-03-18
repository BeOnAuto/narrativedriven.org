<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import HeroIllustrations from './HeroIllustrations.vue'
import WaveBackground from './WaveBackground.vue'
import LottieLogo from './LottieLogo.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <Layout>
    <template #home-hero-image>
      <HeroIllustrations />
    </template>

    <template #home-hero-before>
      <WaveBackground />
    </template>

    <!-- Lottie logo disabled for now — static SVG logo handles light/dark -->
    <!-- <template #nav-bar-title-after><LottieLogo /></template> -->
  </Layout>
</template>
