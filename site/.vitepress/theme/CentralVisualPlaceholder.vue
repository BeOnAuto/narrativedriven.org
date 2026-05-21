<script setup lang="ts">
import { useData } from 'vitepress'

const { isDark } = useData()
</script>

<template>
  <section id="chat-loses-intent" class="intent-contrast" aria-label="Chat-driven building compared with narrative-driven building">
    <div class="intent-contrast-header">
      <p class="intent-contrast-eyebrow">Why the second version breaks</p>
      <h2 class="intent-contrast-title">Chat loses product intent.</h2>
      <p class="intent-contrast-body">
        When intent lives in chat, decisions get buried in corrections, screenshots, and half-remembered context. NDD
        turns the intent into a narrative people can review before build.
      </p>
    </div>

    <div class="intent-contrast-grid">
      <article class="intent-contrast-panel intent-contrast-panel--lost">
        <p class="intent-contrast-kicker">Chat-driven building</p>
        <h3 class="intent-contrast-heading">Intent gets lost.</h3>
        <p class="intent-contrast-description">
          Conversations are unstructured. Important decisions get buried, missed, or forgotten.
        </p>

        <div class="intent-contrast-image-wrap">
          <ClientOnly>
            <img
              class="intent-contrast-image"
              :src="isDark ? '/images/home/ndd-agent-loses-the-plot-dark.png' : '/images/home/ndd-agent-loses-the-plot.png'"
              alt="A chat history leads to a broken app interface."
              loading="lazy"
              decoding="async"
            />
            <template #fallback>
              <img
                class="intent-contrast-image"
                src="/images/home/ndd-agent-loses-the-plot.png"
                alt="A chat history leads to a broken app interface."
                loading="lazy"
                decoding="async"
              />
            </template>
          </ClientOnly>
        </div>
      </article>

      <article class="intent-contrast-panel intent-contrast-panel--kept">
        <p class="intent-contrast-kicker">Narrative-driven building</p>
        <h3 class="intent-contrast-heading">Intent survives.</h3>
        <p class="intent-contrast-description">
          The narrative keeps domains, narratives, scenes, moments, rules, and examples stable for the team.
        </p>

        <div class="intent-contrast-image-wrap">
          <ClientOnly>
            <img
              class="intent-contrast-image"
              :src="isDark ? '/images/home/ndd-narrative-model-dark.png' : '/images/home/ndd-narrative-model.png'"
              alt="A narrative guides a team toward a coherent app interface."
              loading="lazy"
              decoding="async"
            />
            <template #fallback>
              <img
                class="intent-contrast-image"
                src="/images/home/ndd-narrative-model.png"
                alt="A narrative guides a team toward a coherent app interface."
                loading="lazy"
                decoding="async"
              />
            </template>
          </ClientOnly>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.intent-contrast {
  width: min(1200px, calc(100vw - 64px));
  max-width: 1200px;
  margin: 0 0 0 50%;
  padding: 96px 32px 64px;
  transform: translateX(-50%);
}

.intent-contrast-header {
  max-width: 760px;
  margin: 0 auto 56px;
  text-align: center;
}

.intent-contrast-eyebrow {
  margin: 0 0 18px;
  color: var(--ndd-brand);
  font-family: 'Albert Sans', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  line-height: 1;
  text-transform: uppercase;
}

.intent-contrast-title {
  margin: 0 0 16px;
  border-top: 0;
  padding-top: 0;
  color: var(--vp-c-text-1);
  font-family: 'Barlow', sans-serif;
  font-size: clamp(1.95rem, 3.4vw, 2.9rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.05;
}

.intent-contrast-body {
  max-width: 650px;
  margin: 0 auto;
  color: var(--vp-c-text-2);
  font-family: 'Albert Sans', sans-serif;
  font-size: 1.08rem;
  line-height: 1.65;
}

.intent-contrast-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 32px;
  align-items: stretch;
}

.intent-contrast-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--vp-c-border);
  border-radius: 20px;
  background: var(--vp-c-bg);
  padding: 22px 28px 0;
  box-shadow: 0 4px 16px color-mix(in srgb, var(--ndd-brand-dark) 4%, transparent);
}

.intent-contrast-panel::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 3px;
  background: var(--accent, transparent);
}

.intent-contrast-panel--lost {
  --accent: linear-gradient(90deg, rgba(245, 83, 94, 0.9), rgba(245, 83, 94, 0.35));
}

.intent-contrast-panel--kept {
  --accent: linear-gradient(90deg, rgba(94, 199, 45, 0.85), rgba(94, 199, 45, 0.35));
  border-color: color-mix(in srgb, #5ec72d 28%, var(--vp-c-border));
}

.intent-contrast-kicker {
  margin: 0 0 14px;
  font-family: 'Albert Sans', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.intent-contrast-panel--lost .intent-contrast-kicker {
  color: var(--ndd-brand);
}

.intent-contrast-panel--kept .intent-contrast-kicker {
  color: #5ec72d;
}

.intent-contrast-heading {
  margin: 0 0 12px;
  font-family: 'Barlow', sans-serif;
  font-size: clamp(1.45rem, 2.2vw, 1.85rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.12;
  color: var(--vp-c-text-1);
}

.intent-contrast-description {
  margin: 0 0 16px;
  color: var(--vp-c-text-2);
  font-family: 'Albert Sans', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
}

.intent-contrast-image-wrap {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.intent-contrast-image {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}

:global(html.dark .intent-contrast-panel) {
  background: #141414 !important;
  border-color: #2e2e2e !important;
  box-shadow: none !important;
}

:global(html.dark .intent-contrast-panel--kept) {
  border-color: color-mix(in srgb, #5ec72d 28%, #2e2e2e) !important;
}

@media (min-width: 900px) {
  .intent-contrast-description {
    min-height: 3.2em;
  }

  .intent-contrast-image {
    max-height: 520px;
  }
}

@media (max-width: 899px) {
  .intent-contrast-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .intent-contrast-image {
    max-height: none;
  }
}

@media (max-width: 639px) {
  .intent-contrast {
    width: auto;
    margin-left: 0;
    padding: 64px 20px 40px;
    transform: none;
  }

  .intent-contrast-header {
    margin-bottom: 36px;
  }

  .intent-contrast-panel {
    padding: 22px 22px 0;
  }

  .intent-contrast-body {
    font-size: 1rem;
  }
}
</style>
