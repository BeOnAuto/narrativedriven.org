<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
const loaded = ref(false)
let dotLottie: any = null

onMounted(async () => {
  if (!canvas.value || typeof window === 'undefined') return
  try {
    const { DotLottie } = await import('@lottiefiles/dotlottie-web')
    dotLottie = new DotLottie({
      canvas: canvas.value,
      src: '/animations/ndd-logo-load.lottie',
      autoplay: true,
      loop: false,
    })
    dotLottie.addEventListener('load', () => {
      loaded.value = true
    })
  } catch (e) {
    // Lottie failed — static logo remains visible
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
  <div class="lottie-logo" :class="{ 'is-loaded': loaded }">
    <canvas ref="canvas" width="400" height="56" />
  </div>
</template>

<style scoped>
.lottie-logo {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 28px;
  width: 200px;
  opacity: 0;
  pointer-events: none;
  z-index: 10;
}

.lottie-logo.is-loaded {
  opacity: 1;
}

.lottie-logo canvas {
  height: 28px;
  width: 200px;
  display: block;
}
</style>
