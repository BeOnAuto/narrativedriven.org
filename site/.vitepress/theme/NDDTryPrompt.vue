<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const prompt = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const attachTipVisible = ref(false)
let attachTipTimer: ReturnType<typeof setTimeout> | null = null

function showAttachTip() {
  if (attachTipTimer) clearTimeout(attachTipTimer)
  attachTipVisible.value = true
  attachTipTimer = setTimeout(() => { attachTipVisible.value = false }, 2000)
  document.addEventListener('click', hideAttachTip, { once: true, capture: true })
}

function hideAttachTip() {
  if (attachTipTimer) clearTimeout(attachTipTimer)
  attachTipVisible.value = false
}

const examples = [
  'A patient portal where clients can book appointments and view records',
  'A flower shop that takes orders online and manages deliveries',
  'A concert booking app where promoters list shows and sell tickets',
  'An internal tool that tracks our hiring pipeline across teams',
  'A marketplace for freelance translators with real-time bidding',
  'A membership platform for a yoga studio with class scheduling',
]

const placeholderText = ref('')
let exampleIndex = 0
let charIndex = 0
let typing = true
let animationTimer: ReturnType<typeof setTimeout> | null = null

function animatePlaceholder() {
  const current = examples[exampleIndex]
  if (typing) {
    charIndex++
    placeholderText.value = current.slice(0, charIndex)
    if (charIndex >= current.length) {
      typing = false
      animationTimer = setTimeout(animatePlaceholder, 2000)
      return
    }
    animationTimer = setTimeout(animatePlaceholder, 27)
  } else {
    charIndex--
    placeholderText.value = current.slice(0, charIndex)
    if (charIndex <= 0) {
      typing = true
      exampleIndex = (exampleIndex + 1) % examples.length
      animationTimer = setTimeout(animatePlaceholder, 400)
      return
    }
    animationTimer = setTimeout(animatePlaceholder, 10)
  }
}

function focusSoon(delay = 600) {
  setTimeout(() => textareaRef.value?.focus({ preventScroll: true }), delay)
}

function focusTextareaIfTargeted() {
  if (window.location.hash === '#try-ndd-on-auto') focusSoon(450)
}

function handleAnyClickToTarget(e: MouseEvent) {
  const a = (e.target as HTMLElement)?.closest?.('a[href="#try-ndd-on-auto"]')
  if (a) focusSoon(550)
}

onMounted(() => {
  animationTimer = setTimeout(animatePlaceholder, 800)
  if (window.location.hash === '#try-ndd-on-auto') focusSoon(400)
  window.addEventListener('hashchange', focusTextareaIfTargeted)
  document.addEventListener('click', handleAnyClickToTarget)
})

onUnmounted(() => {
  if (animationTimer) clearTimeout(animationTimer)
  window.removeEventListener('hashchange', focusTextareaIfTargeted)
  document.removeEventListener('click', handleAnyClickToTarget)
})

function handleSubmit(e: Event) {
  e.preventDefault()
  const text = prompt.value.trim()
  if (!text) return
  window.location.href = `https://app.on.auto/go?prompt=${encodeURIComponent(text)}`
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSubmit(e)
  }
}
</script>

<template>
  <div class="ndd-prompt" :class="{ 'attach-tip-active': attachTipVisible }">
    <div class="ndd-prompt-nudge" aria-hidden="true">
      <span class="ndd-prompt-nudge-text">try it now</span>
      <svg class="ndd-prompt-nudge-arrow" width="44" height="50" viewBox="0 0 44 50" fill="none">
        <defs><marker id="ndd-ah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="currentColor"/></marker></defs>
        <path d="M8 2C0 18 4 32 28 40" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" marker-end="url(#ndd-ah)"/>
      </svg>
    </div>
    <form class="ndd-prompt-card" @submit="handleSubmit">
      <textarea
        ref="textareaRef"
        v-model="prompt"
        class="ndd-prompt-textarea"
        :placeholder="placeholderText"
        @keydown="handleKeyDown"
      ></textarea>
      <div class="ndd-prompt-footer">
        <div class="ndd-prompt-footer-left">
          <button type="button" class="ndd-prompt-attach" aria-label="enter your first prompt to attach things" @click.prevent="showAttachTip">
            <svg class="ndd-prompt-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
          </button>
        </div>
        <div class="ndd-prompt-footer-right">
          <span class="ndd-prompt-hint">Enter to submit</span>
          <button type="submit" class="ndd-prompt-submit" aria-label="Submit prompt">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5m0 0-7 7m7-7 7 7"/></svg>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.ndd-prompt {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 820px;
  margin: 0 auto;
}

.ndd-prompt-nudge {
  position: absolute;
  top: -38px;
  left: -52px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: var(--vp-c-text-3);
  opacity: 0;
  animation: ndd-nudge-in 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards;
  pointer-events: none;
  z-index: 1;
}

.ndd-prompt-nudge-text {
  font-family: 'Albert Sans', 'Inter', sans-serif;
  font-size: 1.05rem;
  font-weight: 400;
  font-style: italic;
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.ndd-prompt-nudge-arrow {
  flex-shrink: 0;
  margin-left: 16px;
  margin-top: -4px;
  color: var(--vp-c-text-1);
}

@keyframes ndd-nudge-in {
  from { opacity: 0; transform: translate(-6px, -4px); }
  to   { opacity: 1; transform: translate(0, 0); }
}

@media (prefers-reduced-motion: reduce) {
  .ndd-prompt-nudge { animation: none; opacity: 1; }
}

@media (max-width: 640px) {
  .ndd-prompt-nudge { display: none; }
}

.ndd-prompt-card {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 18px;
  overflow: hidden;
  background: #111114;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.18);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  min-height: 280px;
}

.ndd-prompt-card:focus-within {
  border-color: rgba(255, 255, 255, 0.16);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.22);
}

.ndd-prompt-textarea {
  flex: 1;
  width: 100%;
  resize: none;
  border: none;
  outline: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.92);
  font-family: 'Albert Sans', 'Inter', sans-serif;
  font-size: 1.05rem;
  line-height: 1.6;
  padding: 26px;
  letter-spacing: -0.01em;
  min-height: 210px;
}

.ndd-prompt-textarea::placeholder {
  color: rgba(255, 255, 255, 0.32);
}

.ndd-prompt-textarea:focus,
.ndd-prompt-textarea:focus-visible {
  outline: none !important;
  outline-offset: 0 !important;
}

.ndd-prompt-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.ndd-prompt-footer-left { display: flex; align-items: center; gap: 4px; }

.ndd-prompt-attach {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 4px;
  cursor: not-allowed;
}

.ndd-prompt::after {
  content: 'enter your first prompt to attach things';
  position: absolute;
  bottom: -40px;
  left: 0;
  white-space: nowrap;
  font-family: 'Albert Sans', 'Inter', sans-serif;
  font-size: 0.78rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(30, 30, 35, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  opacity: 0;
  transition: opacity 0.15s ease;
  pointer-events: none;
}

@media (hover: hover) {
  .ndd-prompt:has(.ndd-prompt-attach:hover)::after {
    opacity: 1;
  }
}

.ndd-prompt.attach-tip-active::after {
  opacity: 1;
}

.ndd-prompt-icon { color: rgba(255, 255, 255, 0.28); }

.ndd-prompt-footer-right { display: flex; align-items: center; gap: 10px; }

.ndd-prompt-hint {
  font-family: 'Albert Sans', 'Inter', sans-serif;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.32);
}

.ndd-prompt-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.ndd-prompt-submit:hover {
  background: #f5535e;
  color: #fff;
}
</style>
