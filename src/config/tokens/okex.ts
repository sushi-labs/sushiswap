import { ChainId, Token } from '@sushiswap/core-sdk'

export const DAI = new Token(ChainId.OKEX, '0x21cDE7E32a6CAF4742d00d44B07279e7596d26B9', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.OKEX, '0xc946DAf81b08146B1C7A8Da2A851Ddf2B3EAaf85', 18, 'USDC', 'USD Coin')
export const USDT = new Token(ChainId.OKEX, '0x382bB369d343125BfB2117af9c149795C6C65C50', 18, 'USDT', 'Tether USD')
export const WBTC = new Token(ChainId.OKEX, '0x506f731F7656e2FB34b587B912808f2a7aB640BD', 18, 'WBTC', 'Wrapped Bitcoin')
export const WETH = new Token(ChainId.OKEX, '0xEF71CA2EE68F45B9Ad6F72fbdb33d707b872315C', 18, 'WETH', 'Wrapped Ether')
