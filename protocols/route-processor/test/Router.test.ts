import { ChainId } from '@sushiswap/chain'
import { Native, SUSHI, Token, WNATIVE } from '@sushiswap/currency'
import { getBigNumber, MultiRoute } from '@sushiswap/tines'
import { expect } from 'chai'
import { ethers, network } from 'hardhat'
import { HardhatNetworkConfig } from 'hardhat/types'

import { WETH9ABI } from '../ABI/WETH9'
import { DataFetcher } from '../scripts/DataFetcher'
import { BentoBox } from '../scripts/liquidityProviders/Trident'
import { Router } from '../scripts/Router'
import { getRouteProcessorCode } from '../scripts/TinesToRouteProcessor'
import { RouteProcessor__factory } from '../typechain/index'

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

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

  reset(startdiff = 0) {
    this.start += startdiff
    if (this.start < 0) this.start = 0
    this.current = this.start
  }
}

async function testRouter(chainId: ChainId, amountIn: number, toToken: Token, swapFromWrapped = true, swaps = 1) {
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
  const baseWrappedToken = WNATIVE[chainId]
  const native = Native.onChain(chainId)
  const fromToken = swapFromWrapped ? baseWrappedToken : native

  console.log(`1. ${chainId} Find best route ...`)
  const backCounter = new BackCounter(4)
  const dataFetcher = new DataFetcher(provider, chainId)
  dataFetcher.startDataFetching()
  dataFetcher.fetchPoolsForToken(fromToken, toToken)
  const router = new Router(dataFetcher, fromToken, amountInBN, toToken, 30e9)
  router.startRouting(() => {
    //console.log('Known Pools:', dataFetcher.poolCodes.reduce((a, b) => ))
    const printed = router.getCurrentRouteHumanString()
    console.log(printed)
    backCounter.reset(-1)
  })

  await backCounter.wait()
  router.stopRouting()
  dataFetcher.stopDataFetching()

  console.log(`2. ChainId=${chainId} RouteProcessor deployment ...`)

  const RouteProcessor = await ethers.getContractFactory('RouteProcessor')
  const routeProcessor = await RouteProcessor.deploy(
    BentoBox[chainId] || '0x0000000000000000000000000000000000000000',
    WNATIVE[chainId].address
  )
  await routeProcessor.deployed()

  console.log('3. User creation ...')
  const [Alice] = await ethers.getSigners()

  if (swapFromWrapped) {
    console.log(`4. Deposit user's ${amountIn} ${WNATIVE[chainId].symbol} to ${baseWrappedToken.symbol}`)
    await Alice.sendTransaction({
      to: baseWrappedToken.address,
      value: amountInBN.mul(swaps),
    })

    console.log(`5. Approve user's ${baseWrappedToken.symbol} to the route processor ...`)
    const WrappedBaseTokenContract = await new ethers.Contract(baseWrappedToken.address, WETH9ABI, Alice)
    await WrappedBaseTokenContract.connect(Alice).approve(routeProcessor.address, amountInBN.mul(swaps))
  }

  console.log('6. Create route processor code ...')
  const route = router.getBestRoute() as MultiRoute
  const rpParams = router.getCurrentRouteRPParams(Alice.address, routeProcessor.address)
  if (rpParams === undefined) {
    throw new Error('route is not created')
  }

  console.log('7. Call route processor ...')
  const toTokenContract = await new ethers.Contract(toToken.address, WETH9ABI, Alice)
  const balanceOutBNBefore = await toTokenContract.connect(Alice).balanceOf(Alice.address)
  let tx
  if (rpParams.value)
    tx = await routeProcessor.processRoute(
      rpParams.tokenIn,
      rpParams.amountIn,
      rpParams.tokenOut,
      rpParams.amountOutMin,
      rpParams.to,
      rpParams.routeCode,
      { value: rpParams.value }
    )
  else
    tx = await routeProcessor.processRoute(
      rpParams.tokenIn,
      rpParams.amountIn,
      rpParams.tokenOut,
      rpParams.amountOutMin,
      rpParams.to,
      rpParams.routeCode
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
  it('Ethereum WETH => FEI check', async function () {
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
      await testRouter(ChainId.ETHEREUM, 10, FEI)
    }
  })

  it.skip('Polygon WMATIC => SUSHI check', async function () {
    const forking_url = (network.config as HardhatNetworkConfig)?.forking?.url
    if (forking_url !== undefined && forking_url.search('polygon') >= 0) {
      expect(process.env.ALCHEMY_API_KEY).not.undefined
      await testRouter(ChainId.POLYGON, 1_000_000, SUSHI[ChainId.POLYGON])
    }
  })

  it.skip('Polygon MATIC => WMATIC check', async function () {
    const forking_url = (network.config as HardhatNetworkConfig)?.forking?.url
    if (forking_url !== undefined && forking_url.search('polygon') >= 0) {
      expect(process.env.ALCHEMY_API_KEY).not.undefined
      await testRouter(ChainId.POLYGON, 1_000_000, WNATIVE[ChainId.POLYGON], false)
    }
  })

  it('Polygon MATIC => SUSHI check', async function () {
    const forking_url = (network.config as HardhatNetworkConfig)?.forking?.url
    if (forking_url !== undefined && forking_url.search('polygon') >= 0) {
      expect(process.env.ALCHEMY_API_KEY).not.undefined
      await testRouter(ChainId.POLYGON, 1_000_000, SUSHI[ChainId.POLYGON], false)
    }
  })
})
