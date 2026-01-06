import type { WalletConnectAction, WalletNamespace } from 'src/lib/wallet'

export enum SidebarView {
  Connect = 'connect',
  Portfolio = 'portfolio',
  Settings = 'settings',
}

export type SidebarState = { isOpen: boolean } & (
  | {
      view: SidebarView.Connect
      context?: {
        namespace?: WalletNamespace
        action?: WalletConnectAction
      }
    }
  | {
      view: Exclude<SidebarView, SidebarView.Connect>
      context?: undefined
    }
)
