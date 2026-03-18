import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import HeroIllustrations from './HeroIllustrations.vue'
import WaveBackground from './WaveBackground.vue'
import LottieLogo from './LottieLogo.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(HeroIllustrations),
      'home-hero-before': () => h(WaveBackground),
      'nav-bar-title-after': () => h(LottieLogo),
    })
  },
}
