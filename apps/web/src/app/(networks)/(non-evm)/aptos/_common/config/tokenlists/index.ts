import { NetworkName } from '@aptos-labs/wallet-adapter-core'
import type { SupportedNetwork } from '~aptos/_common/config/chains'
import { mainnet } from './mainnet'
import { testnet } from './testnet'

export const tokenlists = {
  [NetworkName.Mainnet]: mainnet,
  [NetworkName.Testnet]: testnet,
} as const satisfies Record<SupportedNetwork, unknown>
