import { ChainId, Token } from '@sushiswap/core-sdk'

export const DAI = new Token(ChainId.HECO, '0x3D760a45D0887DFD89A2F5385a236B29Cb46ED2a', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.HECO, '0x9362Bbef4B8313A8Aa9f0c9808B80577Aa26B73B', 18, 'USDC', 'USD Coin')
export const USDT = new Token(ChainId.HECO, '0xa71EdC38d189767582C38A3145b5873052c3e47a', 18, 'USDT', 'Tether USD')
export const WBTC = new Token(ChainId.HECO, '0x66a79D23E58475D2738179Ca52cd0b41d73f0BEa', 18, 'WBTC', 'Wrapped Bitcoin')
export const WETH = new Token(ChainId.HECO, '0x64FF637fB478863B7468bc97D30a5bF3A428a1fD', 18, 'WETH', 'Wrapped Ether')
