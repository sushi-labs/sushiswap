import { EvmWalletConfig } from './namespaces/evm/config'
import type { WalletConfig, WalletConnectorConfig } from './types'

const RECOMMENDED_WALLETS = [...EvmWalletConfig.recommended]
const OTHER_WALLETS = [...EvmWalletConfig.other]
const WALLETS = [...RECOMMENDED_WALLETS, ...OTHER_WALLETS]

export const UnifiedWalletConfig: WalletConnectorConfig = {
  recommended: RECOMMENDED_WALLETS,
  other: OTHER_WALLETS,
  all: WALLETS,
}

export function getWalletConfig(walletId: string): WalletConfig | undefined {
  return WALLETS.find((w) => w.id === walletId)
}
