<script setup>
import DefaultTheme from 'vitepress/theme'
import HeroIllustrations from './HeroIllustrations.vue'
import HierarchySection from './HierarchySection.vue'
import WaveBackground from './WaveBackground.vue'
import LottieLogo from './LottieLogo.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #home-hero-image>
      <HeroIllustrations />
    </template>

    <template #home-hero-before>
      <WaveBackground />
    </template>

    <template #home-features-before>
      <HierarchySection />
    </template>

    <template #nav-bar-title-after>
      <LottieLogo />
    </template>
  </Layout>
</template>
