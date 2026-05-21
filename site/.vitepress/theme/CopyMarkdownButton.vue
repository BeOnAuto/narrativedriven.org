<script setup>
import { ref, computed } from 'vue'
import { useData } from 'vitepress'

const props = defineProps({
  placement: {
    type: String,
    default: 'doc',
  },
})

const { frontmatter } = useData()
const copied = ref(false)

const markdown = computed(() => frontmatter.value?.copyMarkdown || '')

async function copy() {
  const text = markdown.value
  if (!text) return

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1500)
  } catch (err) {
    console.error('Copy failed:', err)
  }
}
</script>

<template>
  <div
    v-if="markdown"
    :class="['copy-markdown-wrapper', `copy-markdown-wrapper--${placement}`]"
  >
    <button
      type="button"
      class="copy-markdown-btn"
      :aria-label="copied ? 'Copied to clipboard' : 'Copy page as markdown'"
      :title="copied ? 'Copied!' : 'Copy page as markdown'"
      @click="copy"
    >
      <svg
        v-if="!copied"
        class="copy-markdown-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      <svg
        v-else
        class="copy-markdown-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <span class="copy-markdown-label">{{ copied ? 'Copied!' : 'Copy markdown' }}</span>
    </button>
  </div>
</template>

<style scoped>
.copy-markdown-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.copy-markdown-wrapper--home {
  position: absolute;
  top: var(--vp-nav-height, 64px);
  right: 24px;
  margin-top: 16px;
  margin-bottom: 0;
  z-index: 10;
}

@media (min-width: 768px) {
  .copy-markdown-wrapper--home {
    right: 48px;
  }
}

@media (min-width: 960px) {
  .copy-markdown-wrapper--home {
    right: 64px;
  }
}

.copy-markdown-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  transition:
    color 0.2s,
    background-color 0.2s,
    border-color 0.2s;
}

.copy-markdown-btn:hover {
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-mute);
  border-color: var(--vp-c-brand-1, var(--vp-c-divider));
}

.copy-markdown-btn:focus-visible {
  outline: 2px solid var(--vp-c-brand-1, var(--vp-c-text-1));
  outline-offset: 2px;
}

.copy-markdown-icon {
  flex-shrink: 0;
}

.copy-markdown-label {
  white-space: nowrap;
}
</style>
