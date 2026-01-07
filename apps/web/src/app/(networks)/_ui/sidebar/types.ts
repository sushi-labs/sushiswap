import type { WalletConnectAction, WalletNamespace } from 'src/lib/wallet'

export const SidebarView = {
  Connect: 'connect',
  Portfolio: 'portfolio',
  Settings: 'settings',
} as const

export const DefaultSidebarView = SidebarView.Portfolio

export type SidebarView = (typeof SidebarView)[keyof typeof SidebarView]

export type SidebarState = { isOpen: boolean } & (
  | {
      view: 'connect'
      context?: {
        namespace?: WalletNamespace
        action?: WalletConnectAction
      }
    }
  | {
      view: Exclude<SidebarView, 'connect'>
      context?: undefined
    }
)
