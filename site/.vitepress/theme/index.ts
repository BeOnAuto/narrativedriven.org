import DefaultTheme from 'vitepress/theme'
import { h, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import posthog from 'posthog-js'
import HeroIllustrations from './HeroIllustrations.vue'
import WaveBackground from './WaveBackground.vue'
import LottieLogo from './LottieLogo.vue'
import CopyMarkdownButton from './CopyMarkdownButton.vue'
import NDDTryPrompt from './NDDTryPrompt.vue'
import CentralVisualPlaceholder from './CentralVisualPlaceholder.vue'
import './custom.css'

function initViewTabs() {
  document.querySelectorAll('.view-tabs').forEach((tabGroup) => {
    const strip = tabGroup.closest('.example-strip')
    if (!strip) return
    const tabs = tabGroup.querySelectorAll('.view-tab')
    const panels = strip.querySelectorAll('.view-panel')

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const view = tab.getAttribute('data-view')
        tabs.forEach((t) => t.classList.remove('active'))
        panels.forEach((p) => p.classList.remove('active'))
        tab.classList.add('active')
        const target = strip.querySelector(`.view-panel[data-view="${view}"]`)
        if (target) target.classList.add('active')
      })
    })
  })
}

function classifyOutbound(href: string): 'auto' | null {
  try {
    const url = new URL(href, window.location.origin)
    if (url.origin === window.location.origin) return null
    if (url.hostname === 'on.auto' || url.hostname.endsWith('.on.auto')) return 'auto'
  } catch {
    return null
  }
  return null
}

function installOutboundTracking() {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null
    if (!target) return
    const anchor = target.closest('a[href]') as HTMLAnchorElement | null
    if (!anchor) return
    const href = anchor.getAttribute('href')
    if (!href) return
    const kind = classifyOutbound(href)
    if (!kind) return
    posthog.capture('outbound_to_auto', {
      href,
      path: window.location.pathname,
      text: anchor.textContent?.trim().slice(0, 80) ?? '',
    })
  })
}

const firedScrollEvents = new Set<string>()

function installWalkthroughScrollTracking(path: string) {
  if (path !== '/using-ndd-without-auto' && path !== '/using-ndd-without-auto.html') return

  const observe = (selector: string, event_name: string) => {
    const key = `${path}::${event_name}`
    if (firedScrollEvents.has(key)) return
    const el = document.querySelector(selector)
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!firedScrollEvents.has(key)) {
              firedScrollEvents.add(key)
              posthog.capture(event_name, { path })
            }
            observer.disconnect()
          }
        }
      },
      { rootMargin: '0px 0px -25% 0px' },
    )
    observer.observe(el)
  }

  observe('#quick-proof', 'walkthrough_started')
  observe('#when-to-use-auto', 'quick_proof_completed_scroll')
}

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(HeroIllustrations),
      'home-hero-before': () => h(WaveBackground),
      'nav-bar-title-after': () => h(LottieLogo),
      'doc-before': () => h(CopyMarkdownButton),
    })
  },
  enhanceApp({ app, router }) {
    app.component('NDDTryPrompt', NDDTryPrompt)
    app.component('CentralVisualPlaceholder', CentralVisualPlaceholder)
    if (typeof window !== 'undefined') {
      const isLocal = window.location.hostname === 'localhost'

      posthog.init('phc_tH8umYQXocGH62N6Bb3GTuwzEfecfpxDpYfpXUqQZAug', {
        api_host: isLocal ? 'https://us.i.posthog.com' : '/idata',
        capture_pageview: false,
        persistence: isLocal ? 'memory' : 'localStorage+cookie',
      })

      posthog.register({ environment: isLocal ? 'development' : 'production' })
      posthog.capture('$pageview', { path: window.location.pathname })

      router.onAfterRouteChanged = (to) => {
        posthog.capture('$pageview', { path: to })
        setTimeout(() => installWalkthroughScrollTracking(to), 100)
      }

      installOutboundTracking()
    }
  },
  setup() {
    const route = useRoute()
    onMounted(() => {
      initViewTabs()
      installWalkthroughScrollTracking(route.path)
    })
    watch(() => route.path, (path) => {
      setTimeout(() => {
        initViewTabs()
        installWalkthroughScrollTracking(path)
      }, 100)
    })
  },
}
