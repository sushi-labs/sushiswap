import { flag } from 'flags/next'

export const showBladeFlag = flag<boolean>({
  key: 'show-blade',
  async decide() {
    return process.env.FLAG_SHOW_BLADE === 'true'
  },
  description: 'Show Blade pools throughout the app',
})

export const showHiddenBladeChainsFlag = flag<boolean>({
  key: 'show-hidden-blade-chains',
  async decide() {
    return process.env.FLAG_SHOW_HIDDEN_BLADE_CHAINS === 'true'
  },
  description: 'Show supported Blade chains that are not public',
})
