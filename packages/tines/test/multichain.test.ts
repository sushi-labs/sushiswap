// @ts-nocheck
import seedrandom from 'seedrandom'
import { findMultiRouteExactIn, NetworkInfo } from '../src'
import { checkRoute, createMultipleNetworks, getRandom, Network } from './utils'

function chooseRandomTokenWithChainId(rnd: () => number, network: Network, chainId?: number) {
  const tokens = network.tokens.filter((t) => t.chainId == chainId)
  expect(tokens.length).toBeGreaterThan(0)
  return tokens[Math.floor(rnd() * tokens.length)]
}

function setRandomBaseTokenInNetworkInfo(
  rnd: () => number,
  network: Network,
  networksInfo: NetworkInfo,
  gasPrice: number
) {
  const randomToken = chooseRandomTokenWithChainId(rnd, network, networksInfo.chainId)
  networksInfo.baseToken = randomToken
  networksInfo.baseTokenPrice = randomToken.price
  networksInfo.gasPrice = gasPrice * Math.pow(10, randomToken.decimals - 18)
}

it('two chains', () => {
  const testSeed = '0' // Change it to change random generator values
  const rnd: () => number = seedrandom(testSeed) // random [0, 1)

  const { pools, network, networksInfo } = createMultipleNetworks(rnd, [
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
  setRandomBaseTokenInNetworkInfo(rnd, network, networksInfo[0], 100e9)
  setRandomBaseTokenInNetworkInfo(rnd, network, networksInfo[1], 50e9)

  const fromToken = chooseRandomTokenWithChainId(rnd, network, networksInfo[0].chainId)
  const toToken = chooseRandomTokenWithChainId(rnd, network, networksInfo[1].chainId)
  const amountIn = getRandom(rnd, 1e6, 1e24)

  const route = findMultiRouteExactIn(fromToken, toToken, amountIn, pools, networksInfo)
  checkRoute(route, network, fromToken, toToken, amountIn, networksInfo)
})
