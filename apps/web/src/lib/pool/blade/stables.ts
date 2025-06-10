import type { BladeChainId } from '@sushiswap/graph-client/data-api'
import { EvmChainId } from 'sushi'
import { STABLES } from 'sushi/config'
import { Token } from 'sushi/currency'

export type BladePoolTokensGrouped = {
  tokens: Token[]
  stablecoinUsdTokens: Token[]
}

export const BLADE_STABLES: Record<BladeChainId, Token[]> = {
  ...STABLES,
  [EvmChainId.ARBITRUM]: [
    ...STABLES[EvmChainId.ARBITRUM],
    new Token({
      address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      chainId: EvmChainId.ARBITRUM,
      decimals: 6,
      symbol: 'USDC',
      name: 'USD Coin (Arb1)',
    }),
  ],
  [EvmChainId.OPTIMISM]: [
    ...STABLES[EvmChainId.OPTIMISM],
    new Token({
      address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
      chainId: EvmChainId.OPTIMISM,
      decimals: 6,
      symbol: 'USDC',
      name: 'USD Coin',
    }),
  ],
  [EvmChainId.MANTLE]: [
    ...STABLES[EvmChainId.MANTLE],
    new Token({
      address: '0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE',
      chainId: EvmChainId.MANTLE,
      decimals: 6,
      symbol: 'USDT',
      name: 'Tether USD',
    }),
  ],
}
