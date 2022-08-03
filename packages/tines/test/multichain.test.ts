// @ts-nocheck
import seedrandom from 'seedrandom'
import { findMultiRouteExactIn } from '../src'
import { chooseRandomToken, createMultipleNetworks, getRandom } from './utils'

function getBasePrice(network: Network, t: TToken) {
  return network.gasPrice * Math.pow(10, t.decimals - 18)
}

it('two chains', () => {
  const testSeed = '0' // Change it to change random generator values
  const rnd: () => number = seedrandom(testSeed) // random [0, 1)

  const { pools, networks, networksInfo } = createMultipleNetworks(rnd, [
    {
      tokenNumber: 5,
      density: 0.4,
      gasPrice: 100e9,
    },
    {
      tokenNumber: 5,
      density: 0.4,
      gasPrice: 50e9,
    },
  ])
  const baseToken0 = chooseRandomToken(rnd, networks[0])
  const gasPrice0 = getBasePrice(networks[0], baseToken0)

  const baseToken1 = chooseRandomToken(rnd, networks[1])
  const gasPrice1 = getBasePrice(networks[1], baseToken1)

  const fromToken = chooseRandomToken(rnd, networks[0])
  const toToken = chooseRandomToken(rnd, networks[1])
  const amountIn = getRandom(rnd, 1e6, 1e24)

  const route = findMultiRouteExactIn(fromToken, toToken, amountIn, pools, networksInfo)
})
