import { ChainId, Token } from '@sushiswap/core-sdk'

export const USDC = new Token(ChainId.XDAI, '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83', 6, 'USDC', 'USD Coin')
export const USDT = new Token(ChainId.XDAI, '0x4ECaBa5870353805a9F068101A40E0f32ed605C6', 6, 'USDT', 'Tether USD')
export const WBTC = new Token(ChainId.XDAI, '0x8e5bBbb09Ed1ebdE8674Cda39A0c169401db4252', 8, 'WBTC', 'Wrapped Bitcoin')
export const WETH = new Token(ChainId.XDAI, '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1', 18, 'WETH', 'Wrapped Ether')
export const GNO = new Token(ChainId.XDAI, '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb', 18, 'GNO', 'Gnosis Token')
