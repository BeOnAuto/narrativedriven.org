<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
let dotLottie: any = null

onMounted(async () => {
  if (!canvas.value) return
  try {
    const { DotLottie } = await import('@lottiefiles/dotlottie-web')
    dotLottie = new DotLottie({
      canvas: canvas.value,
      src: '/animations/ndd-logo-load.lottie',
      autoplay: true,
      loop: false,
    })
  } catch (e) {
    // Lottie failed to load — static logo fallback is fine
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
  <div class="lottie-logo-wrapper">
    <canvas ref="canvas" class="lottie-logo-canvas" />
  </div>
</template>

<style scoped>
.lottie-logo-wrapper {
  display: flex;
  align-items: center;
  height: 28px;
  width: 200px;
}

.lottie-logo-canvas {
  height: 28px;
  width: 200px;
}
</style>
