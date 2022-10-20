import { CHAINLINK_PRICE_FEED_MAP, CHAINLINK_SUPPORTED_CHAIN_IDS } from '../src'
describe('price feed mappings', () => {
  it('validates', () => {
    for (const chainId of CHAINLINK_SUPPORTED_CHAIN_IDS) {
      for (const priceFeed of Object.values(CHAINLINK_PRICE_FEED_MAP[chainId])) {
        if (priceFeed.to === '0x0000000000000000000000000000000000000001') {
          expect(priceFeed.toDecimals).toEqual(8)
        }
      }
    }
  })
})
