import { ChainId, Token } from '@sushiswap/core-sdk'

export const USDC = new Token(ChainId.OPTIMISM, '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', 6, 'USDC', 'USD Coin')

export const DAI = new Token(
  ChainId.OPTIMISM,
  '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  18,
  'DAI',
  'Dai Stablecoin'
)

export const USDT = new Token(ChainId.OPTIMISM, '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', 6, 'USDT', 'Tether USD')

export const WBTC = new Token(
  ChainId.OPTIMISM,
  '0x68f180fcCe6836688e9084f035309E29Bf0A2095',
  8,
  'WBTC',
  'Wrapped Bitcoin'
)

export const LUSD = new Token(
  ChainId.OPTIMISM,
  '0xc40F949F8a4e094D1b49a23ea9241D289B7b2819',
  18,
  'LUSD',
  'LUSD Stablecoin'
)
