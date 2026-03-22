import DefaultTheme from 'vitepress/theme'
import { h, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import HeroIllustrations from './HeroIllustrations.vue'
import WaveBackground from './WaveBackground.vue'
import LottieLogo from './LottieLogo.vue'
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
      'nav-bar-title-after': () => h(LottieLogo),
    })
  },
  setup() {
    const route = useRoute()
    onMounted(() => initViewTabs())
    watch(() => route.path, () => {
      setTimeout(initViewTabs, 100)
    })
  },
}
