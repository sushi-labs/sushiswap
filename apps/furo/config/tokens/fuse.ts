import { ChainId, Token } from '@sushiswap/core-sdk'

export const WETH = new Token(ChainId.FUSE, '0xa722c13135930332Eb3d749B2F0906559D2C5b99', 18, 'WETH', 'Wrapped Ether')
export const WBTC = new Token(ChainId.FUSE, '0x33284f95ccb7B948d9D352e1439561CF83d8d00d', 8, 'WBTC', 'Wrapped Bitcoin')
export const USDC = new Token(ChainId.FUSE, '0x620fd5fa44BE6af63715Ef4E65DDFA0387aD13F5', 6, 'USDC', 'USD Coin')
export const USDT = new Token(ChainId.FUSE, '0xFaDbBF8Ce7D5b7041bE672561bbA99f79c532e10', 8, 'USDT', 'Tether USD')
export const DAI = new Token(ChainId.FUSE, '0x94Ba7A27c7A95863d1bdC7645AC2951E0cca06bA', 18, 'DAI', 'Dai Stablecoin')
