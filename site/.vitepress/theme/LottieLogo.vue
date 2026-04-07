<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
const playing = ref(false)
let dotLottie: any = null
let observer: MutationObserver | null = null

function getLogoSrc() {
  const isDark = document.documentElement.classList.contains('dark')
  return isDark ? '/animations/ndd-logo-load-dark.lottie' : '/animations/ndd-logo-load.lottie'
}

async function initLottie() {
  if (!canvas.value) return
  // Destroy previous instance
  if (dotLottie) {
    dotLottie.destroy()
    dotLottie = null
    playing.value = false
  }

  try {
    const { DotLottie } = await import('@lottiefiles/dotlottie-web')
    dotLottie = new DotLottie({
      canvas: canvas.value,
      src: getLogoSrc(),
      autoplay: false,
      loop: false,
    })
    dotLottie.addEventListener('load', () => {
      playing.value = true
      dotLottie.play()
    })
  } catch (e) {
    // Lottie failed silently
  }
}

onMounted(() => {
  // Initial load with delay
  setTimeout(initLottie, 1000)

  // Watch for dark mode toggle
  observer = new MutationObserver(() => {
    initLottie()
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onUnmounted(() => {
  observer?.disconnect()
  if (dotLottie) {
    dotLottie.destroy()
    dotLottie = null
  }
})
</script>

<template>
  <canvas
    ref="canvas"
    width="584"
    height="82"
    class="lottie-logo"
    :class="{ 'is-playing': playing }"
  />
</template>

<style scoped>
.lottie-logo {
  height: 40px;
  width: auto;
  aspect-ratio: 292 / 41;
  margin-left: -52px;
  opacity: 0;
  pointer-events: none;
}

.lottie-logo.is-playing {
  opacity: 1;
}
</style>
