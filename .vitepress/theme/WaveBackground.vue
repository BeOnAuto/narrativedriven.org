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
          <stop offset="0" class="wave-start" />
          <stop offset="1" class="wave-end-1" />
        </linearGradient>
        <linearGradient id="wg1" x1="760.5" y1="510.6" x2="760.5" y2="-103.9" gradientUnits="userSpaceOnUse">
          <stop offset="0" class="wave-start" />
          <stop offset="1" class="wave-end-2" />
        </linearGradient>
      </defs>

      <path
        fill="url(#wg0)"
        fill-opacity="0.5"
        d="M1707,577.2C653.2,961,672.5,181.1,0,226.5L0,0L1707,0L1707,577.2Z"
      >
        <animate
          attributeName="d"
          dur="35s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
          values="
            M1707,577.2C653.2,961,672.5,181.1,0,226.5L0,0L1707,0L1707,577.2Z;
            M1707,577.2C1693,577.2,1383.5,87,0,226.5L0,0L1707,0L1707,573.2Z;
            M1707,192.2C1693,192.2,191,241.5,0,226.5L0,0L1707,0L1707,188.2Z;
            M1707,192.2C794.5,267.5,906,611,0,508.5L0,0L1707,0L1707,188.2Z;
            M1707,192.2C1250.5,508.5,205.5,508.5,0,508.5L0,0L1707,0L1707,188.2Z;
            M1707,577.2C653.2,961,672.5,181.1,0,226.5L0,0L1707,0L1707,577.2Z
          "
        />
      </path>

      <path
        fill="url(#wg1)"
        fill-opacity="0.5"
        d="M0,.1L0,602L1707,602L1707,286C977,-296.5,652.5,397.5,0,.1Z"
        transform="translate(0, 680)"
      >
        <animate
          attributeName="d"
          dur="35s"
          repeatCount="indefinite"
          calcMode="linear"
          values="
            M0,.1L0,602L1707,602L1707,286C977,-296.5,652.5,397.5,0,.1Z;
            M0,.1L0,602L1707,602L1707,286C949.5,286,539.5,.1,0,.1Z;
            M0,.1L0,602L1707,602L1707,286C373.5,286,12,.1,0,.1Z;
            M0,.1L0,602L1707,602L1707,286C931,118.5,1066,486.5,0,.1Z;
            M0,.1L0,602L1707,602L1707,286C977,-296.5,652.5,397.5,0,.1Z
          "
        />
      </path>
    </svg>
  </div>
</template>

<style scoped>
.wave-bg {
  position: absolute;
  top: -200px;
  left: 0;
  width: 100%;
  height: 1320px;
  overflow: hidden;
  pointer-events: none;
  z-index: -10;
}

.wave-svg {
  width: 100%;
  height: 100%;
}

/* Light mode */
.wave-start { stop-color: #ffffff; }
.wave-end-1 { stop-color: #a0ddff; }
.wave-end-2 { stop-color: #abdaf3; }

/* Dark mode */
:global(.dark) .wave-start { stop-color: #1a1a1a; }
:global(.dark) .wave-end-1 { stop-color: #1e3040; }
:global(.dark) .wave-end-2 { stop-color: #1a2d3a; }

@media (prefers-reduced-motion: reduce) {
  .wave-bg animate { display: none; }
}
</style>
