<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isDark = ref(false)
let observer: MutationObserver | null = null

function checkDark() {
  isDark.value = document.documentElement.classList.contains('dark')
}

onMounted(() => {
  checkDark()
  observer = new MutationObserver(checkDark)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div class="hero-illustrations">
    <!-- Desktop / 2x2 grid: subtle dotted flow connectors intent → model → spec → execution -->
    <svg class="hero-flow hero-flow-grid" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="M 38 22 C 50 18, 50 18, 62 22" stroke="currentColor" stroke-width="0.4" fill="none" stroke-dasharray="1.4 1.6" stroke-linecap="round" />
      <path d="M 70 38 C 60 50, 40 50, 30 62" stroke="currentColor" stroke-width="0.4" fill="none" stroke-dasharray="1.4 1.6" stroke-linecap="round" />
      <path d="M 38 78 C 50 82, 50 82, 62 78" stroke="currentColor" stroke-width="0.4" fill="none" stroke-dasharray="1.4 1.6" stroke-linecap="round" />
    </svg>
    <!-- Tablet / vertical staggered column: zig-zag connectors hero-1 → hero-2 → hero-3 → hero-4 -->
    <svg class="hero-flow hero-flow-stagger" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <!-- hero-1 (left) → hero-2 (right): down-right diagonal -->
      <path d="M 30 18 C 50 22, 50 22, 70 32" stroke="currentColor" stroke-width="0.4" fill="none" stroke-dasharray="1.4 1.6" stroke-linecap="round" />
      <!-- hero-2 (right) → hero-3 (left): down-left diagonal -->
      <path d="M 70 44 C 50 50, 50 50, 30 56" stroke="currentColor" stroke-width="0.4" fill="none" stroke-dasharray="1.4 1.6" stroke-linecap="round" />
      <!-- hero-3 (left) → hero-4 (right): down-right diagonal -->
      <path d="M 30 70 C 50 76, 50 76, 70 82" stroke="currentColor" stroke-width="0.4" fill="none" stroke-dasharray="1.4 1.6" stroke-linecap="round" />
    </svg>
    <img :src="isDark ? '/images/hero-1-dark.png' : '/images/hero-1.png'" class="hero-img hero-img-1" alt="" />
    <img :src="isDark ? '/images/hero-2-dark.png' : '/images/hero-2.png'" class="hero-img hero-img-2" alt="" />
    <img :src="isDark ? '/images/hero-3-dark.png' : '/images/hero-3.png'" class="hero-img hero-img-3" alt="" />
    <img :src="isDark ? '/images/hero-4-dark.png' : '/images/hero-4.png'" class="hero-img hero-img-4" alt="" />
  </div>
</template>

<style scoped>
/* MOBILE-FIRST base: compact 2x2 grid below the headline.
   Sized to fit even the narrowest phone, then scaled up at each breakpoint. */
.hero-illustrations {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0;
  max-width: 260px;
  margin: 1rem auto 0;
}

.hero-flow {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  color: var(--vp-c-text-3);
  opacity: 0.55;
  z-index: 0;
}

/* Default (mobile + desktop): show 2x2 grid connectors, hide stagger connectors */
.hero-flow-stagger { display: none; }

.hero-img {
  position: relative;
  z-index: 1;
}

.hero-img {
  width: 100%;
  height: auto;
}

.hero-img-1 {
  width: 65%;
  justify-self: center;
  align-self: center;
}

.hero-img-2 {
  width: 90%;
  justify-self: center;
  align-self: center;
  left: -20px
}

.hero-img-3 {
  width: 80%;
  justify-self: center;
  align-self: center;
}

.hero-img-4 {
  width: 100%;
  justify-self: center;
  align-self: center;
}

.hero-img-1 { animation: float1 6s ease-in-out infinite; }
.hero-img-2 { animation: float2 7s ease-in-out infinite; }
.hero-img-3 { animation: float3 8s ease-in-out infinite; }
.hero-img-4 { animation: float4 6.5s ease-in-out infinite; }

@keyframes float1 {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(-5px, -8px); }
  66% { transform: translate(3px, -4px); }
}

@keyframes float2 {
  0%, 100% { transform: translate(25px, 11px); }
  33% { transform: translate(20px, 4px); }
  66% { transform: translate(30px, 8px); }
}

@keyframes float3 {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(5px, -6px); }
  66% { transform: translate(-3px, -3px); }
}

@keyframes float4 {
  0%, 100% { transform: rotate(12deg) translate(-2px, -2px); }
  33% { transform: rotate(14deg) translate(-6px, -8px); }
  66% { transform: rotate(10deg) translate(2px, -5px); }
}

@media (prefers-reduced-motion: reduce) {
  .hero-img { animation: none !important; }
}

/* Larger phones */
@media (min-width: 420px) {
  .hero-illustrations {
    max-width: 320px;
  }
  /* Per-image overrides for larger phones (uncomment to tweak) */
  /* .hero-illustrations .hero-img-1 { width: 80%; } */
  /* .hero-illustrations .hero-img-2 { width: 100%; } */
  /* .hero-illustrations .hero-img-3 { width: 80%; } */
  /* .hero-illustrations .hero-img-4 { width: 100%; } */
}

/* Tablet: swap connectors — hide grid connectors, show stagger connectors */
@media (min-width: 640px) and (max-width: 959px) {
  .hero-flow-grid { display: none; }
  .hero-flow-stagger {
    display: block;
    width: 80%;
    left: 5%;
    inset: 0 5%;
  }
}

/* Tablet: side-by-side with hero text. Vertical staggered column,
   alternating left / right / left / right, big images. */
@media (min-width: 640px) and (max-width: 959px) {
  .hero-illustrations {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto;
    max-width: 100%;
    margin: 0;
    padding: 16px 0;
  }
  .hero-illustrations .hero-img {
    width: 56%;
    max-width: 56%;
    justify-self: start;
    align-self: start;
    margin-top: -36px;
    margin-bottom: -36px;
  }
  .hero-illustrations .hero-img-1 { width: 30%; margin-left: 0; margin-top: 0; top: -15px/* width: 56%; */ }
  .hero-illustrations .hero-img-2 { width: 50%; margin-left: 40%; top: -20px; /* width: 56%; */ }
  .hero-illustrations .hero-img-3 { width: 35%; margin-left: 0; top: 25px;  /* width: 56%; */ }
  .hero-illustrations .hero-img-4 { width: 70%; margin-left: 45%; margin-bottom: 0; top: 40px; /* width: 56%; */ }
  /* Per-image width overrides for tablet — uncomment & tweak above to resize individuals.
     Note: .hero-illustrations .hero-img { width: 56% } above sets the default for all four. */
}


/* Desktop: original 2x2 grid.
   Per-image sizing: see .hero-img-1 / .hero-img-3 base rules above (width: 80%).
   For desktop-only tweaks add rules here, e.g.
     .hero-illustrations .hero-img-2 { width: 100%; }
*/
@media (min-width: 960px) {
  .hero-illustrations {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    max-width: 392px;
    margin: 0 auto 0 max(2rem, 8%);
    padding: 0;
  }
}
</style>
