import type { BladeChainId } from '@sushiswap/graph-client/data-api'
import { EvmChainId, EvmToken, STABLES } from 'sushi/evm'

export type BladePoolTokensGrouped = {
  tokens: EvmToken[]
  stablecoinUsdTokens: EvmToken[]
}

export const BLADE_STABLES: Record<BladeChainId, EvmToken[]> = {
  ...STABLES,
  [EvmChainId.KATANA]: [
    ...STABLES[EvmChainId.KATANA],
    new EvmToken({
      address: '0x62d6a123e8d19d06d68cf0d2294f9a3a0362c6b3',
      chainId: EvmChainId.KATANA,
      decimals: 18,
      symbol: 'vbUSDS',
      name: 'Vault Bridge USDS',
    }),
  ],
  [EvmChainId.POLYGON]: [
    ...STABLES[EvmChainId.POLYGON],
    new EvmToken({
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      chainId: EvmChainId.POLYGON,
      decimals: 6,
      symbol: 'USDC',
      name: 'USD Coin (PoS)',
    }),
  ],
  [EvmChainId.ARBITRUM]: [
    ...STABLES[EvmChainId.ARBITRUM],
    new EvmToken({
      address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      chainId: EvmChainId.ARBITRUM,
      decimals: 6,
      symbol: 'USDC',
      name: 'USD Coin (Arb1)',
    }),
  ],
  [EvmChainId.OPTIMISM]: [
    ...STABLES[EvmChainId.OPTIMISM],
    new EvmToken({
      address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
      chainId: EvmChainId.OPTIMISM,
      decimals: 6,
      symbol: 'USDC',
      name: 'USD Coin',
    }),
  ],
  [EvmChainId.MANTLE]: [
    ...STABLES[EvmChainId.MANTLE],
    new EvmToken({
      address: '0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE',
      chainId: EvmChainId.MANTLE,
      decimals: 6,
      symbol: 'USDT',
      name: 'Tether USD',
    }),
  ],
}
