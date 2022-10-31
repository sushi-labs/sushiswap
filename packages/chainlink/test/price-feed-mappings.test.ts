import { DAI, DAI_ADDRESS, USDC, USDC_ADDRESS, USDT, USDT_ADDRESS, WNATIVE, WNATIVE_ADDRESS } from '@sushiswap/currency'

import { CHAINLINK_PRICE_FEED_MAP, CHAINLINK_SUPPORTED_CHAIN_IDS } from '../src'
describe('price feed mappings', () => {
  it('validates', () => {
    for (const chainId of CHAINLINK_SUPPORTED_CHAIN_IDS) {
      for (const [key, priceFeed] of Object.entries(CHAINLINK_PRICE_FEED_MAP[chainId])) {
        if (priceFeed.to === '0x0000000000000000000000000000000000000001') {
          expect(priceFeed.toDecimals).toEqual(8)
        }
        if (priceFeed.from === WNATIVE_ADDRESS[chainId]) {
          expect(priceFeed.fromDecimals).toEqual(WNATIVE[chainId].decimals)
        }
        if (priceFeed.to === WNATIVE_ADDRESS[chainId]) {
          expect(priceFeed.toDecimals).toEqual(WNATIVE[chainId].decimals)
        }
        if (priceFeed.from === USDC_ADDRESS[chainId]) {
          expect(priceFeed.fromDecimals).toEqual(USDC[chainId].decimals)
        }
        if (priceFeed.to === USDT_ADDRESS[chainId]) {
          expect(priceFeed.toDecimals).toEqual(USDT[chainId].decimals)
        }
        if (priceFeed.to === DAI_ADDRESS[chainId]) {
          expect(priceFeed.toDecimals).toEqual(DAI[chainId].decimals)
        }
        // Always expect decimals (oracle decimals) to equal toDecimals
        if (priceFeed.decimals !== priceFeed.toDecimals) console.log(chainId, key, priceFeed)
        expect(priceFeed.decimals).toEqual(priceFeed.toDecimals)
      }
    }
  })
})
