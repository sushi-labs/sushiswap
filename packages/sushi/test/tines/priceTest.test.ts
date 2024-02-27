import seedrandom from 'seedrandom'
import { expect, it } from 'vitest'
import { calcTokenPrices } from '../../src/tines/index.js'
import {
  MAX_POOL_IMBALANCE,
  TToken,
  createNetwork,
  expectCloseValues,
} from './utils.js'

const GAS_PRICE = 50 * 1e-9

const testSeed = '1' // Change it to change random generator values
const rnd: () => number = seedrandom(testSeed) // random [0, 1)

const network = createNetwork(rnd, 100, 0.05, GAS_PRICE)

it('Token price calculation is correct for minLiquidity = 0', () => {
  const baseToken = network.tokens[0] as TToken
  const prices = calcTokenPrices(network.pools, baseToken)
  Array.from(prices.keys()).forEach((v) => {
    const t = network.tokens.find((t) => t.tokenId === v.tokenId) as TToken
    const price = (v as TToken).price
    if (v.tokenId === baseToken.tokenId) {
      expectCloseValues(price, 1, 1e-10)
    }
    if (price !== 0) {
      expectCloseValues(
        price,
        t.price / baseToken.price,
        5 * (MAX_POOL_IMBALANCE - 1),
      )
    }
  })
  expect(prices.size).toEqual(network.tokens.length)
})

it('Token price calculation is correct for minLiquidity != 0', () => {
  const baseToken = network.tokens[0] as TToken
  const prices = calcTokenPrices(network.pools, baseToken, 1e26)
  Array.from(prices.keys()).forEach((v) => {
    const t = network.tokens.find((t) => t.tokenId === v.tokenId) as TToken
    const price = (v as TToken).price
    if (v.tokenId === baseToken.tokenId) {
      expectCloseValues(price, 1, 1e-10)
    }
    if (price !== 0) {
      expectCloseValues(
        price,
        t.price / baseToken.price,
        5 * (MAX_POOL_IMBALANCE - 1),
      )
    }
  })
  expect(prices.size).toBeLessThan(network.tokens.length)
})
