import type { WalletNamespace } from 'src/lib/wallet'

export enum SidebarView {
  Connect = 'connect',
  Portfolio = 'portfolio',
  Settings = 'settings',
}

export type SidebarState = { isOpen: boolean } & (
  | {
      view: SidebarView.Connect
      context?: { namespace?: WalletNamespace; action?: 'connect' | 'switch' }
    }
  | {
      view: Exclude<SidebarView, SidebarView.Connect>
      context?: undefined
    }
)
