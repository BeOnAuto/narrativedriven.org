<script setup>
</script>

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
  animation: heroFadeIn 0.8s ease-out;
}

@keyframes heroFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-img {
  width: 100%;
  height: auto;
  transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.hero-img-1 {
  transform: translate(0, 0);
}

.hero-img-2 {
  transform: translate(25px, 11px);
}

.hero-img-3 {
  transform: translate(0, 0);
}

.hero-img-4 {
  transform: rotate(12deg) translate(-2px, -2px);
}

.hero-illustrations:hover .hero-img-1 {
  transform: translate(-4px, -4px);
}

.hero-illustrations:hover .hero-img-2 {
  transform: translate(29px, 7px);
}

.hero-illustrations:hover .hero-img-3 {
  transform: translate(4px, 4px);
}

.hero-illustrations:hover .hero-img-4 {
  transform: rotate(16deg) translate(-6px, -6px);
}

@media (max-width: 959px) {
  .hero-illustrations {
    max-width: 320px;
    margin-top: 2rem;
  }
}

@media (max-width: 639px) {
  .hero-illustrations {
    max-width: 280px;
  }
}
</style>
