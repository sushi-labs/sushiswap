import { ChainId, Token } from '@sushiswap/core-sdk'

export const WETH = new Token(ChainId.TELOS, '0xfA9343C3897324496A05fC75abeD6bAC29f8A40f', 18, 'WETH', 'Wrapped Ether')
export const WBTC = new Token(ChainId.TELOS, '0xf390830DF829cf22c53c8840554B98eafC5dCBc2', 8, 'WBTC', 'Wrapped Bitcoin')
export const USDC = new Token(ChainId.TELOS, '0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b', 6, 'USDC', 'USD Coin')
export const USDT = new Token(ChainId.TELOS, '0xeFAeeE334F0Fd1712f9a8cc375f427D9Cdd40d73', 8, 'USDT', 'Tether USD')
