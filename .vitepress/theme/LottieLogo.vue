<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
const playing = ref(false)
let dotLottie: any = null

onMounted(async () => {
  if (!canvas.value || typeof window === 'undefined') return
  try {
    const { DotLottie } = await import('@lottiefiles/dotlottie-web')
    dotLottie = new DotLottie({
      canvas: canvas.value,
      src: '/animations/ndd-logo-load.lottie',
      autoplay: false,
      loop: false,
    })
    dotLottie.addEventListener('load', () => {
      setTimeout(() => {
        playing.value = true
        dotLottie.play()
      }, 1000)
    })
  } catch (e) {
    // Lottie failed silently
  }
})

onUnmounted(() => {
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

/* Hide in dark mode — needs dark Lottie variant */
:global(.dark) .lottie-logo {
  display: none;
}
</style>
