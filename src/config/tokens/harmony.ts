import { ChainId, Token } from '@sushiswap/core-sdk'

export const DAI = new Token(ChainId.HARMONY, '0xEf977d2f931C1978Db5F6747666fa1eACB0d0339', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.HARMONY, '0x985458E523dB3d53125813eD68c274899e9DfAb4', 6, 'USDC', 'USD Coin')
export const USDT = new Token(ChainId.HARMONY, '0x3C2B8Be99c50593081EAA2A724F0B8285F5aba8f', 6, 'USDT', 'Tether USD')
export const WBTC = new Token(
  ChainId.HARMONY,
  '0x3095c7557bCb296ccc6e363DE01b760bA031F2d9',
  8,
  'WBTC',
  'Wrapped Bitcoin'
)
export const WETH = new Token(
  ChainId.HARMONY,
  '0x6983D1E6DEf3690C4d616b13597A09e6193EA013',
  18,
  'WETH',
  'Wrapped Ether'
)
export const FRAX = new Token(ChainId.HARMONY, '0xFa7191D292d5633f702B0bd7E3E3BcCC0e633200', 18, 'FRAX', 'Frax')
export const FXS = new Token(ChainId.HARMONY, '0x0767D8E1b05eFA8d6A301a65b324B6b66A1CC14c', 18, 'FXS', 'Frax Share')
