import type { BladeChainId } from '@sushiswap/graph-client/data-api'
import { EvmChainId, EvmToken, STABLES, USDT } from 'sushi/evm'

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
  [EvmChainId.MANTLE]: [...STABLES[EvmChainId.MANTLE], USDT[EvmChainId.MANTLE]],
  [EvmChainId.ETHEREUM]: [
    ...STABLES[EvmChainId.ETHEREUM],
    new EvmToken({
      address: '0xdc035d45d973e3ec169d2276ddab16f1e407384f',
      chainId: EvmChainId.ETHEREUM,
      decimals: 18,
      symbol: 'USDS',
      name: 'USDS Stablecoin',
    }),
  ],
}
