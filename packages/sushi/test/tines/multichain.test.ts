import seedrandom from 'seedrandom'
import { expect, it } from 'vitest'
import { NetworkInfo, findMultiRouteExactIn } from '../../src/tines/index.js'
import {
  Network,
  TToken,
  checkRoute,
  createMultipleNetworks,
  createMultipleNetworksWithStargateBridge,
  getRandom,
} from './utils.js'

function chooseRandomTokenWithChainId(
  rnd: () => number,
  network: Network,
  chainId?: number,
) {
  const tokens = network.tokens.filter((t) => t.chainId === chainId)
  expect(tokens.length).toBeGreaterThan(0)
  return tokens[Math.floor(rnd() * tokens.length)]
}

function setRandomBaseTokenInNetworkInfo(
  rnd: () => number,
  network: Network,
  networksInfo: NetworkInfo,
  gasPrice: number,
) {
  const randomToken = chooseRandomTokenWithChainId(
    rnd,
    network,
    networksInfo.chainId as number,
  ) as TToken
  networksInfo.baseToken = randomToken
  //networksInfo.baseTokenPrice = randomToken.price
  networksInfo.gasPrice = gasPrice * 10 ** (randomToken.decimals - 18)
}

it('two chains with pool bridge', () => {
  const testSeed = '1' // Change it to change random generator values
  const rnd: () => number = seedrandom(testSeed) // random [0, 1)

  for (let i = 0; i < 10; ++i) {
    const { pools, network, networksInfo } = createMultipleNetworks(
      rnd,
      [
        {
          tokenNumber: 5,
          density: 0.6,
          gasPrice: 100e9,
        },
        {
          tokenNumber: 5,
          density: 0.6,
          gasPrice: 50e9,
        },
      ],
      2,
    )

    for (let j = 0; j < 10; ++j) {
      setRandomBaseTokenInNetworkInfo(
        rnd,
        network,
        networksInfo[0] as NetworkInfo,
        100e9,
      )
      setRandomBaseTokenInNetworkInfo(
        rnd,
        network,
        networksInfo[1] as NetworkInfo,
        50e9,
      )

      const fromToken = chooseRandomTokenWithChainId(
        rnd,
        network,
        (networksInfo[0] as NetworkInfo).chainId as number,
      ) as TToken
      const toToken = chooseRandomTokenWithChainId(
        rnd,
        network,
        (networksInfo[1] as NetworkInfo).chainId as number,
      ) as TToken
      const shift = Math.min(fromToken.price, 1)
      const amountIn = getRandom(rnd, 1e9 / shift, 1e24 / shift)

      const route = findMultiRouteExactIn(
        fromToken,
        toToken,
        amountIn,
        pools,
        networksInfo,
      )
      checkRoute(route, network, fromToken, toToken, amountIn, networksInfo)
    }
  }
})

it('two chains with Stargate bridge', () => {
  const testSeed = '0' // Change it to change random generator values
  const rnd: () => number = seedrandom(testSeed) // random [0, 1)

  for (let i = 0; i < 10; ++i) {
    const { pools, network, networksInfo } =
      createMultipleNetworksWithStargateBridge(rnd, [
        {
          tokenNumber: 8,
          density: 0.6,
          gasPrice: 100e9,
        },
        {
          tokenNumber: 8,
          density: 0.6,
          gasPrice: 50e9,
        },
      ])

    for (let j = 0; j < 10; ++j) {
      setRandomBaseTokenInNetworkInfo(
        rnd,
        network,
        networksInfo[0] as NetworkInfo,
        100e9,
      )
      setRandomBaseTokenInNetworkInfo(
        rnd,
        network,
        networksInfo[1] as NetworkInfo,
        50e9,
      )

      const fromToken = chooseRandomTokenWithChainId(
        rnd,
        network,
        (networksInfo[0] as NetworkInfo).chainId as number,
      ) as TToken
      const toToken = chooseRandomTokenWithChainId(
        rnd,
        network,
        (networksInfo[1] as NetworkInfo).chainId as number,
      ) as TToken
      const shift = Math.min(fromToken.price, 1)
      const amountIn = getRandom(rnd, 1e9 / shift, 1e24 / shift)

      const route = findMultiRouteExactIn(
        fromToken,
        toToken,
        amountIn,
        pools,
        networksInfo,
      )

      // const bridge = route.legs.filter((l) => l.poolAddress.startsWith('Bridge'))
      // if (bridge.length > 0)
      //   console.log(
      //     bridge.map((b) => `${b.poolAddress} ${b.absolutePortion * 100}% ${b.assumedAmountIn}->${b.assumedAmountOut}`)
      //   )

      checkRoute(route, network, fromToken, toToken, amountIn, networksInfo)
    }
  }
})
