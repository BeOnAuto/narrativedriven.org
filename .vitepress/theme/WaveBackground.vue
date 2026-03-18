<script setup>
</script>

<template>
  <div class="wave-bg" aria-hidden="true">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1707 1320"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      class="wave-svg"
    >
      <defs>
        <linearGradient id="wg0" x1="384.5" y1="40" x2="384.5" y2="934.5" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#fff" stop-opacity="0" />
          <stop offset="1" class="wave-end-1" />
        </linearGradient>
        <linearGradient id="wg1" x1="760.5" y1="510.6" x2="760.5" y2="-103.9" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#fff" stop-opacity="0" />
          <stop offset="1" class="wave-end-2" />
        </linearGradient>
      </defs>
      <!-- Upper diagonal band -->
      <path
        d="M1707 577.2c-1053.8 383.8-1034.5-396.1-1707-350.7v-226.5h1707v577.2Z"
        fill="url(#wg0)"
        fill-opacity="0.5"
      />
      <!-- Lower diagonal band -->
      <path
        d="M0 .1v601.9h1707v-316c-730-582.5-1054.5 111.5-1707-285.9Z"
        fill="url(#wg1)"
        fill-opacity="0.5"
        transform="translate(0, 680)"
      />
    </svg>
  </div>
</template>

<style scoped>
.wave-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 140vh;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.wave-svg {
  width: 100%;
  height: 100%;
}

/* Light mode wave colors */
.wave-end-1 {
  stop-color: #a0ddff;
}

.wave-end-2 {
  stop-color: #abdaf3;
}

/* Dark mode wave colors */
:global(.dark) .wave-end-1 {
  stop-color: #1a3a4d;
}

:global(.dark) .wave-end-2 {
  stop-color: #1a3347;
}
</style>
