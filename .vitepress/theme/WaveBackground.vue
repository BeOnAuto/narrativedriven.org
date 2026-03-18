<script setup>
</script>

<template>
  <div class="wave-background" aria-hidden="true">
    <svg viewBox="0 0 1707 1320" preserveAspectRatio="none" class="wave-svg">
      <defs>
        <linearGradient id="wave-grad-0" x1="384.5" y1="40" x2="384.5" y2="934.5">
          <stop offset="0" class="wave-stop-white" />
          <stop offset="1" class="wave-stop-blue-1" />
        </linearGradient>
        <linearGradient id="wave-grad-1" x1="760.5" y1="510.6" x2="760.5" y2="-103.9">
          <stop offset="0" class="wave-stop-white" />
          <stop offset="1" class="wave-stop-blue-2" />
        </linearGradient>
      </defs>
      <path
        class="wave-path wave-path-1"
        fill="url(#wave-grad-0)"
        fill-opacity="0.5"
        d="M-40,200 C200,100 400,300 600,250 C800,200 1000,50 1200,150 C1400,250 1600,100 1750,200 L1750,900 C1500,800 1200,950 900,850 C600,750 300,900 -40,800 Z"
      />
      <path
        class="wave-path wave-path-2"
        fill="url(#wave-grad-1)"
        fill-opacity="0.5"
        d="M-40,350 C150,250 400,400 650,350 C900,300 1100,150 1350,250 C1500,310 1650,200 1750,300 L1750,1000 C1500,900 1200,1050 900,950 C600,850 300,1000 -40,900 Z"
      />
    </svg>
  </div>
</template>

<style scoped>
.wave-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}

.wave-svg {
  width: 100%;
  height: 100%;
  min-height: 100vh;
}

.wave-stop-white {
  stop-color: var(--vp-c-bg);
}

.wave-stop-blue-1 {
  stop-color: var(--ndd-wave-1, #a0ddff);
}

.wave-stop-blue-2 {
  stop-color: var(--ndd-wave-2, #abdaf3);
}

.wave-path {
  animation: waveFloat 35s ease-in-out infinite;
}

.wave-path-2 {
  animation-delay: -8s;
  animation-duration: 30s;
}

@keyframes waveFloat {
  0%, 100% {
    transform: translateX(0) translateY(0);
  }
  25% {
    transform: translateX(-30px) translateY(15px);
  }
  50% {
    transform: translateX(20px) translateY(-10px);
  }
  75% {
    transform: translateX(-15px) translateY(20px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .wave-path {
    animation: none;
  }
}
</style>
