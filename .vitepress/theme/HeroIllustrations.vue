<template>
  <div class="hero-illustrations">
    <img src="/images/hero-1.png" class="hero-img hero-img-1" alt="" />
    <img src="/images/hero-2.png" class="hero-img hero-img-2" alt="" />
    <img src="/images/hero-3.png" class="hero-img hero-img-3" alt="" />
    <img src="/images/hero-4.png" class="hero-img hero-img-4" alt="" />
  </div>
</template>

<style scoped>
.hero-illustrations {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0;
  max-width: 420px;
  margin: 0 auto;
}

.hero-img {
  width: 100%;
  height: auto;
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

@media (max-width: 959px) {
  .hero-illustrations { max-width: 320px; margin-top: 2rem; }
}

@media (max-width: 639px) {
  .hero-illustrations { max-width: 280px; }
}
</style>
