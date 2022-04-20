import { ChainId, Token } from '@sushiswap/core-sdk'

export const mCUSD = new Token(ChainId.CELO, '0x64dEFa3544c695db8c535D289d843a189aa26b98', 18, 'mCUSD', 'Moola cUSD')
export const mCELO = new Token(ChainId.CELO, '0x7037F7296B2fc7908de7b57a89efaa8319f0C500', 18, 'mCELO', 'Moola CELO')
export const mcEURO = new Token(
  ChainId.CELO,
  '0xa8d0E6799FF3Fd19c6459bf02689aE09c4d78Ba7',
  18,
  'mCEUR',
  'Moola Celo Euro'
)
export const cUSD = new Token(ChainId.CELO, '0x765DE816845861e75A25fCA122bb6898B8B1282a', 18, 'cUSD', 'Celo Dollar')
export const cEURO = new Token(ChainId.CELO, '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73', 18, 'cEUR', 'Celo Euro')
export const cBTC = new Token(ChainId.CELO, '0xD629eb00dEced2a080B7EC630eF6aC117e614f1b', 18, 'cBTC', 'Wrapped Bitcoin')
export const cETH = new Token(ChainId.CELO, '0x2DEf4285787d58a2f811AF24755A8150622f4361', 18, 'cETH', 'Wrapped Ether')
export const WETH = new Token(ChainId.CELO, '0x122013fd7dF1C6F636a5bb8f03108E876548b455', 18, 'WETH', 'WETH')
export const WBTC = new Token(ChainId.CELO, '0xBAAB46E28388d2779e6E31Fd00cF0e5Ad95E327B', 8, 'WBTC', 'WBTC')
export const USDC = new Token(ChainId.CELO, '0xef4229c8c3250C675F21BCefa42f58EfbfF6002a', 6, 'USDC', 'USD Coin')
