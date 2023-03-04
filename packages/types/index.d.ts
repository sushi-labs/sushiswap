import type { Address } from '@wagmi/core'

export type CurrencyId = Address | 'ETH' | 'WETH' | 'USDC' | 'DAI' | 'USDT' | 'WBTC' | 'WETH9'

export type HexString = `0x${string}`

export type Id = `0x${string}_${number}`
