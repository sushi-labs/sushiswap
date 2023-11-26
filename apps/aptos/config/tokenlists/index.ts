import { NetworkName } from '@aptos-labs/wallet-adapter-core'
import { SupportedNetwork } from 'config/chains'
import { testnet } from './testnet'
import { mainnet } from './mainnet'

export const tokenlists = {
  [NetworkName.Mainnet]: mainnet,
  [NetworkName.Testnet]: testnet,
} as const satisfies Record<SupportedNetwork, unknown>
