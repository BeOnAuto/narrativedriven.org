<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import HeroIllustrations from './HeroIllustrations.vue'
import WaveBackground from './WaveBackground.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <Layout>
    <template #home-hero-image>
      <HeroIllustrations />
    </template>

    <template #layout-top>
      <WaveBackground v-if="frontmatter.layout === 'home'" />
    </template>
  </Layout>
</template>
