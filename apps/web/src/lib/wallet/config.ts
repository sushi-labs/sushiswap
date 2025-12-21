import { EvmWalletConfig } from './namespaces/evm/config'
import type { WalletConnectorConfig } from './types'

const RECOMMENDED_WALLETS = [...EvmWalletConfig.recommended]
const OTHER_WALLETS = [...EvmWalletConfig.other]
const WALLETS = [...RECOMMENDED_WALLETS, ...OTHER_WALLETS]

export const WalletConfig: WalletConnectorConfig = {
  recommended: RECOMMENDED_WALLETS,
  other: OTHER_WALLETS,
  all: WALLETS,
}
