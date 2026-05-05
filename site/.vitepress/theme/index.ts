import DefaultTheme from 'vitepress/theme'
import { h, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import posthog from 'posthog-js'
import HeroIllustrations from './HeroIllustrations.vue'
import HierarchySection from './HierarchySection.vue'
import WaveBackground from './WaveBackground.vue'
import LottieLogo from './LottieLogo.vue'
import CopyMarkdownButton from './CopyMarkdownButton.vue'
import NDDTryPrompt from './NDDTryPrompt.vue'
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

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(HeroIllustrations),
      'home-hero-before': () => h(WaveBackground),
      'home-features-before': () => h(HierarchySection),
      'nav-bar-title-after': () => h(LottieLogo),
      'doc-before': () => h(CopyMarkdownButton),
    })
  },
  enhanceApp({ app, router }) {
    app.component('NDDTryPrompt', NDDTryPrompt)
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
      }
    }
  },
  setup() {
    const route = useRoute()
    onMounted(() => initViewTabs())
    watch(() => route.path, () => {
      setTimeout(initViewTabs, 100)
    })
  },
}
