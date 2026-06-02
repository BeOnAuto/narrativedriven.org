<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import posthog from 'posthog-js'

const SOURCE = 'narrativedriven.org'
const PLACEMENT = 'modal'
const ENDPOINT = (import.meta.env.VITE_FORMS_API_URL as string | undefined)
  ?? 'https://forms.on.auto/subscribe'

const open = ref(false)
const email = ref('')
const state = ref<'idle' | 'submitting' | 'done' | 'error'>('idle')
const errorMessage = ref('')
const inputEl = ref<HTMLInputElement | null>(null)

function close() {
  open.value = false
  setTimeout(() => {
    email.value = ''
    state.value = 'idle'
    errorMessage.value = ''
  }, 200)
}

async function show() {
  open.value = true
  await nextTick()
  inputEl.value?.focus()
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) close()
}

onMounted(() => {
  window.addEventListener('open-subscribe-modal', show)
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('open-subscribe-modal', show)
  window.removeEventListener('keydown', onKey)
})

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
  <Teleport to="body">
    <Transition name="ndd-modal">
      <div
        v-if="open"
        class="ndd-modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ndd-modal-title"
        @click.self="close"
      >
        <div class="ndd-modal-card">
          <button class="ndd-modal-close" aria-label="Close" @click="close">×</button>
          <div class="ndd-modal-stripe" aria-hidden="true"></div>
          <h2 id="ndd-modal-title">Stay in the loop on NDD.</h2>
          <p class="ndd-modal-sub">Updates, new guides, and case studies from teams putting narratives first.</p>
          <form v-if="state !== 'done'" class="ndd-modal-form" @submit.prevent="submit">
            <label class="ndd-sr-only" for="ndd-modal-input">Email</label>
            <input
              id="ndd-modal-input"
              ref="inputEl"
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
            <p v-if="errorMessage" class="ndd-modal-error">{{ errorMessage }}</p>
          </form>
          <p v-else class="ndd-modal-success">
            You’re in. We’ll write when there’s a story worth telling.
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.ndd-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(25, 38, 45, 0.62);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  font-family: 'Albert Sans', sans-serif;
}

.ndd-modal-card {
  position: relative;
  width: 100%;
  max-width: 480px;
  padding: 36px 32px 32px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  box-shadow: 0 30px 80px -20px rgba(25, 38, 45, 0.45);
  overflow: hidden;
}

.ndd-modal-stripe {
  position: absolute;
  inset: 0 0 auto 0;
  height: 3px;
  background: linear-gradient(90deg, var(--ndd-brand) 0%, var(--ndd-brand-secondary) 100%);
}

.ndd-modal-close {
  position: absolute;
  top: 8px;
  right: 12px;
  background: none;
  border: none;
  color: var(--vp-c-text-2);
  font-size: 26px;
  line-height: 1;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  transition: color 0.15s ease, background 0.15s ease;
}

.ndd-modal-close:hover {
  color: var(--vp-c-text-1);
  background: rgba(0, 0, 0, 0.04);
}

.ndd-modal-card h2 {
  font-family: 'Barlow', sans-serif;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
  line-height: 1.25;
}

.ndd-modal-sub {
  margin: 0 0 20px;
  font-size: 15px;
  color: var(--vp-c-text-2);
  line-height: 1.55;
}

.ndd-modal-form {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.ndd-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.ndd-modal-form input {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 15px;
  color: var(--vp-c-text-1);
  font-family: inherit;
  transition: border-color var(--ndd-duration) var(--ndd-ease);
}

.ndd-modal-form input:focus {
  outline: none;
  border-color: var(--ndd-brand);
}

.ndd-modal-form button {
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

.ndd-modal-form button:hover:not(:disabled) {
  background: #e0454f;
  transform: translateY(-1px);
}

.ndd-modal-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ndd-modal-error {
  grid-column: 1 / -1;
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--ndd-brand);
}

.ndd-modal-success {
  margin: 0;
  font-size: 15px;
  color: var(--vp-c-text-1);
  padding: 14px 16px;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.ndd-modal-enter-active,
.ndd-modal-leave-active {
  transition: opacity 0.18s ease;
}
.ndd-modal-enter-active .ndd-modal-card,
.ndd-modal-leave-active .ndd-modal-card {
  transition: transform 0.24s cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.18s ease;
}

.ndd-modal-enter-from,
.ndd-modal-leave-to {
  opacity: 0;
}
.ndd-modal-enter-from .ndd-modal-card,
.ndd-modal-leave-to .ndd-modal-card {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
</style>
