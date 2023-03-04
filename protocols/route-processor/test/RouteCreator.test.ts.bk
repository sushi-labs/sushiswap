import { weth9Abi } from '@sushiswap/abi'
import { ChainId } from '@sushiswap/chain'
import { SUSHI, Token, WNATIVE } from '@sushiswap/currency'
import { BentoBox, RouteCreator } from '@sushiswap/router'
import { getBigNumber, MultiRoute } from '@sushiswap/tines'
import { expect } from 'chai'
import { ethers, network } from 'hardhat'
import { HardhatNetworkConfig } from 'hardhat/types'

import { RouteProcessor__factory } from '../typechain'

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

const WRAPPED_NATIVE: Record<number, Token> = {
  [ChainId.ETHEREUM]: new Token({
    chainId: ChainId.ETHEREUM,
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  }),
  [ChainId.POLYGON]: new Token({
    chainId: ChainId.POLYGON,
    address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    decimals: 18,
    symbol: 'WMATIC',
    name: 'Wrapped Matic',
  }),
}

class BackCounter {
  start: number
  current: number

  constructor(start: number) {
    this.start = start
    this.current = start
  }

  async wait() {
    while (this.current > 0) {
      console.log(`Wait ${this.current} sec ...`)
      this.current--
      await delay(1000)
    }
  }

  reset() {
    this.current = this.start
  }
}

async function testRouteCreator(chainId: ChainId, amountIn: number, toToken: Token, swaps = 1) {
  let provider
  switch (chainId) {
    case ChainId.ETHEREUM:
      provider = new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_API_KEY)
      break
    case ChainId.POLYGON:
      provider = new ethers.providers.AlchemyProvider('matic', process.env.ALCHEMY_POLYGON_API_KEY)
      break
    default:
      throw new Error('Unsupported net!')
  }

  const amountInBN = getBigNumber(amountIn * 1e18)
  const baseWrappedToken = WRAPPED_NATIVE[chainId]

  console.log(`1. ${chainId} Find best route ...`)
  const backCounter = new BackCounter(8)
  const routeCreator = new RouteCreator(provider, chainId)
  routeCreator.startRouting(baseWrappedToken, amountInBN, toToken, 30e9)
  routeCreator.onRouteUpdate((r) => {
    console.log('Known Pools:', routeCreator.poolCodes.size)
    const printed = routeCreator.routeToString(r, baseWrappedToken, toToken)
    console.log(printed)
    backCounter.reset()
  })

  await backCounter.wait()
  routeCreator.stopRouting()

  console.log(`2. ChainId=${chainId} RouteProcessor deployment ...`)

  const RouteProcessor: RouteProcessor__factory = await ethers.getContractFactory('RouteProcessor')
  const routeProcessor = await RouteProcessor.deploy(
    BentoBox[chainId] || '0x0000000000000000000000000000000000000000',
    WRAPPED_NATIVE[chainId].address
  )
  await routeProcessor.deployed()

  console.log('3. User creation ...')
  const [Alice] = await ethers.getSigners()

  console.log(`4. Deposit user's ${amountIn} ${WNATIVE[chainId].symbol} to ${baseWrappedToken.symbol}`)
  await Alice.sendTransaction({
    to: baseWrappedToken.address,
    value: amountInBN.mul(swaps),
  })

  console.log(`5. Approve user's ${baseWrappedToken.symbol} to the route processor ...`)
  const WrappedBaseTokenContract = await new ethers.Contract(baseWrappedToken.address, weth9Abi, Alice)
  await WrappedBaseTokenContract.connect(Alice).approve(routeProcessor.address, amountInBN.mul(swaps))

  console.log('6. Create route processor code ...')
  const code = routeCreator.getRouteProcessorCodeForBestRoute(routeProcessor.address, Alice.address, 0.5)

  console.log('7. Call route processor ...')
  const route = routeCreator.getBestRoute() as MultiRoute
  const amountOutMin = route.amountOutBN.mul(getBigNumber((1 - 0.005) * 1_000_000)).div(1_000_000)

  const toTokenContract = await new ethers.Contract(toToken.address, weth9Abi, Alice)
  const balanceOutBNBefore = await toTokenContract.connect(Alice).balanceOf(Alice.address)
  const tx = await routeProcessor.processRoute(
    baseWrappedToken.address,
    route.amountInBN,
    toToken.address,
    amountOutMin,
    Alice.address,
    code
  )
  const receipt = await tx.wait()

  console.log("8. Fetching user's output balance ...")
  const balanceOutBN = (await toTokenContract.connect(Alice).balanceOf(Alice.address)).sub(balanceOutBNBefore)
  console.log(`    expected amountOut: ${route.amountOutBN.toString()}`)
  console.log(`    real amountOut:     ${balanceOutBN.toString()}`)
  const slippage = parseInt(balanceOutBN.sub(route.amountOutBN).mul(10_000).div(route.amountOutBN).toString())
  console.log(`    slippage: ${slippage / 100}%`)
  console.log(`    gas use: ${receipt.gasUsed.toString()}`)
}

describe('RouteCreator', async function () {
  it.skip('Ethereum WETH => FEI check', async function () {
    const forking_url = (network.config as HardhatNetworkConfig)?.forking?.url
    if (forking_url !== undefined && forking_url.search('eth-mainnet') >= 0) {
      expect(process.env.ALCHEMY_API_KEY).not.undefined
      const FEI = new Token({
        chainId: ChainId.ETHEREUM,
        address: '0x956F47F50A910163D8BF957Cf5846D573E7f87CA',
        decimals: 18,
        symbol: 'FEI',
        name: 'Fei USD',
      })
      await testRouteCreator(ChainId.ETHEREUM, 10, FEI)
    }
  })

  it.skip('Polygon WMATIC => SUSHI check', async function () {
    const forking_url = (network.config as HardhatNetworkConfig)?.forking?.url
    if (forking_url !== undefined && forking_url.search('polygon') >= 0) {
      expect(process.env.ALCHEMY_POLYGON_API_KEY).not.undefined
      await testRouteCreator(ChainId.POLYGON, 1_000_000, SUSHI[ChainId.POLYGON])
    }
  })
})
