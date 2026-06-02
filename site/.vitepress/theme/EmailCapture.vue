<script setup lang="ts">
import { ref } from 'vue'
import posthog from 'posthog-js'

const SOURCE = 'narrativedriven.org'
const PLACEMENT = 'footer'
const ENDPOINT = (import.meta.env.VITE_FORMS_API_URL as string | undefined)
  ?? 'https://forms.on.auto/subscribe'

const email = ref('')
const state = ref<'idle' | 'submitting' | 'done' | 'error'>('idle')
const errorMessage = ref('')

async function submit() {
  if (state.value === 'submitting') return
  state.value = 'submitting'
  errorMessage.value = ''

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value.trim(),
        source: SOURCE,
        placement: PLACEMENT,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      errorMessage.value = body?.error === 'invalid email'
        ? 'That email doesn’t look right. Try again?'
        : 'Something went wrong. Try again in a moment.'
      state.value = 'error'
      return
    }

    posthog.identify(email.value.trim().toLowerCase(), { source: SOURCE })
    posthog.capture('newsletter_signup', { source: SOURCE, placement: PLACEMENT })
    state.value = 'done'
  } catch {
    errorMessage.value = 'Network error. Try again in a moment.'
    state.value = 'error'
  }
}
</script>

<template>
  <section id="subscribe" class="ndd-subscribe">
    <div class="ndd-subscribe-inner">
      <div class="ndd-subscribe-copy">
        <h2>Stay in the loop on NDD.</h2>
        <p>Updates, new guides, and case studies from teams putting narratives first.</p>
      </div>
      <form v-if="state !== 'done'" class="ndd-subscribe-form" @submit.prevent="submit">
        <label class="ndd-subscribe-label" for="ndd-subscribe-input">Email</label>
        <input
          id="ndd-subscribe-input"
          v-model="email"
          type="email"
          required
          autocomplete="email"
          placeholder="you@studio.com"
          :disabled="state === 'submitting'"
        />
        <button type="submit" :disabled="state === 'submitting'">
          {{ state === 'submitting' ? 'Subscribing…' : 'Subscribe' }}
        </button>
        <p v-if="errorMessage" class="ndd-subscribe-error">{{ errorMessage }}</p>
      </form>
      <p v-else class="ndd-subscribe-success">
        You’re in. We’ll write when there’s a story worth telling.
      </p>
    </div>
  </section>
</template>

<style scoped>
.ndd-subscribe {
  position: relative;
  padding: 64px 24px;
  background: var(--vp-c-bg-alt);
  border-top: 1px solid var(--vp-c-divider);
  font-family: 'Albert Sans', sans-serif;
}

.ndd-subscribe::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 3px;
  background: linear-gradient(90deg, var(--ndd-brand) 0%, var(--ndd-brand-secondary) 100%);
}

.ndd-subscribe-inner {
  max-width: 880px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 40px;
  align-items: center;
}

@media (max-width: 720px) {
  .ndd-subscribe-inner {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

.ndd-subscribe-copy h2 {
  font-family: 'Barlow', sans-serif;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
  line-height: 1.25;
}

.ndd-subscribe-copy p {
  margin: 0;
  font-size: 15px;
  color: var(--vp-c-text-2);
  line-height: 1.55;
}

.ndd-subscribe-form {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.ndd-subscribe-label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.ndd-subscribe-form input {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 15px;
  color: var(--vp-c-text-1);
  font-family: inherit;
  transition: border-color var(--ndd-duration) var(--ndd-ease);
}

.ndd-subscribe-form input:focus {
  outline: none;
  border-color: var(--ndd-brand);
}

.ndd-subscribe-form button {
  background: var(--ndd-brand);
  color: var(--ndd-white);
  border: none;
  border-radius: 8px;
  padding: 12px 22px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: transform var(--ndd-duration) var(--ndd-ease), background var(--ndd-duration) var(--ndd-ease);
}

.ndd-subscribe-form button:hover:not(:disabled) {
  background: #e0454f;
  transform: translateY(-1px);
}

.ndd-subscribe-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ndd-subscribe-error {
  grid-column: 1 / -1;
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--ndd-brand);
}

.ndd-subscribe-success {
  margin: 0;
  font-size: 15px;
  color: var(--vp-c-text-1);
  padding: 14px 16px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}
</style>
