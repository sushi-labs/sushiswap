import {
  EvmAdapterConfig,
  type EvmAdapterId,
  EvmWalletConfig,
} from './namespaces/evm/config'
import type {
  Wallet,
  WalletAdapter,
  WalletAdapterContext,
  WalletConnectorConfig,
} from './types'

const RECOMMENDED_WALLETS = [...EvmWalletConfig.recommended]
const OTHER_WALLETS = [...EvmWalletConfig.other]
const WALLETS = [...RECOMMENDED_WALLETS, ...OTHER_WALLETS]

export const WalletConfig: WalletConnectorConfig = {
  recommended: RECOMMENDED_WALLETS,
  other: OTHER_WALLETS,
  all: WALLETS,
}

export type AdapterId = EvmAdapterId

export const AdapterConfig: Record<
  AdapterId,
  (ctx?: WalletAdapterContext) => Promise<WalletAdapter>
> = EvmAdapterConfig
