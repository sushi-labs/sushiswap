import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { erc20Abi, weth9Abi } from '@sushiswap/abi'
import { BENTOBOX_ADDRESS } from '@sushiswap/address'
import { ChainId, chainName } from '@sushiswap/chain'
import {
  DAI,
  DAI_ADDRESS,
  FRAX,
  FRAX_ADDRESS,
  FXS,
  FXS_ADDRESS,
  Native,
  SUSHI,
  SUSHI_ADDRESS,
  Token,
  Type,
  USDC,
  USDC_ADDRESS,
  USDT,
  USDT_ADDRESS,
  WNATIVE,
} from '@sushiswap/currency'
import { DataFetcher, findSpecialRoute, PoolFilter, Router } from '@sushiswap/router'
import { LiquidityProviders } from '@sushiswap/router/dist/liquidity-providers/LiquidityProviderMC'
import { BridgeBento, getBigNumber, MultiRoute, RPool, StableSwapRPool } from '@sushiswap/tines'
import { expect } from 'chai'
import { BigNumber, Contract } from 'ethers'
import { ethers, network } from 'hardhat'
import seedrandom from 'seedrandom'

function getRandomExp(rnd: () => number, min: number, max: number) {
  const minL = Math.log(min)
  const maxL = Math.log(max)
  const v = rnd() * (maxL - minL) + minL
  const res = Math.exp(v)
  console.assert(res <= max && res >= min, 'Random value is out of the range')
  return res
}

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

class Waiter {
  resolved = false

  async wait() {
    while (!this.resolved) {
      await delay(500)
    }
  }

  resolve() {
    this.resolved = true
  }
}

interface TestEnvironment {
  chainId: ChainId
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider: any
  rp: Contract
  user: SignerWithAddress
  dataFetcher: DataFetcher
}

async function getTestEnvironment(): Promise<TestEnvironment> {
  //console.log('Prepare Environment:')

  //console.log('    Create DataFetcher ...')
  const provider = ethers.provider
  const chainId = network.config.chainId as ChainId
  const dataFetcher = new DataFetcher(provider, chainId)
  dataFetcher.startDataFetching()

  //console.log(`    ChainId=${chainId} RouteProcessor deployment (may take long time for the first launch)...`)
  const RouteProcessor = await ethers.getContractFactory('RouteProcessor')
  const routeProcessor = await RouteProcessor.deploy(BENTOBOX_ADDRESS[chainId])
  await routeProcessor.deployed()
  //console.log('    Block Number:', provider.blockNumber)

  console.log(`Network: ${chainName[chainId]}, Forked Block: ${provider.blockNumber}`)
  //console.log('    User creation ...')
  const [Alice] = await ethers.getSigners()

  return {
    chainId,
    provider,
    rp: routeProcessor,
    user: Alice,
    dataFetcher,
  }
}

// all pool data assumed to be updated
async function makeSwap(
  env: TestEnvironment,
  fromToken: Type,
  amountIn: BigNumber,
  toToken: Type,
  providers?: LiquidityProviders[],
  poolFilter?: PoolFilter
): Promise<[BigNumber, number] | undefined> {
  //console.log(`Make swap ${fromToken.symbol} -> ${toToken.symbol} amount: ${amountIn.toString()}`)

  if (fromToken instanceof Token) {
    //console.log(`Approve user's ${fromToken.symbol} to the route processor ...`)
    const WrappedBaseTokenContract = await new ethers.Contract(fromToken.address, erc20Abi, env.user)
    await WrappedBaseTokenContract.connect(env.user).approve(env.rp.address, amountIn)
  }

  //console.log('Create Route ...')
  env.dataFetcher.fetchPoolsForToken(fromToken, toToken)
  const waiter = new Waiter()
  const router = new Router(env.dataFetcher, fromToken, amountIn, toToken, 30e9, providers, poolFilter)
  router.startRouting(() => {
    //console.log('Known Pools:', dataFetcher.poolCodes.reduce((a, b) => ))
    const printed = router.getCurrentRouteHumanString()
    console.log(printed)
    waiter.resolve()
  })
  await waiter.wait()
  router.stopRouting()

  //console.log('Create route processor code ...')
  const rpParams = router.getCurrentRouteRPParams(env.user.address, env.rp.address)
  if (rpParams === undefined) return

  //console.log('Call route processor (may take long time for the first launch)...')
  const route = router.getBestRoute() as MultiRoute
  let balanceOutBNBefore: BigNumber
  let toTokenContract: Contract | undefined = undefined
  if (toToken instanceof Token) {
    toTokenContract = await new ethers.Contract(toToken.address, weth9Abi, env.user)
    balanceOutBNBefore = await toTokenContract.connect(env.user).balanceOf(env.user.address)
  } else {
    balanceOutBNBefore = await env.user.getBalance()
  }
  let tx
  if (rpParams.value)
    tx = await env.rp.processRoute(
      rpParams.tokenIn,
      rpParams.amountIn,
      rpParams.tokenOut,
      rpParams.amountOutMin,
      rpParams.to,
      rpParams.routeCode,
      { value: rpParams.value }
    )
  else
    tx = await env.rp.processRoute(
      rpParams.tokenIn,
      rpParams.amountIn,
      rpParams.tokenOut,
      rpParams.amountOutMin,
      rpParams.to,
      rpParams.routeCode
    )
  const receipt = await tx.wait()

  // const trace = await network.provider.send('debug_traceTransaction', [receipt.transactionHash])
  // printGasUsage(trace)

  //console.log("Fetching user's output balance ...")
  let balanceOutBN: BigNumber
  if (toTokenContract) {
    balanceOutBN = (await toTokenContract.connect(env.user).balanceOf(env.user.address)).sub(balanceOutBNBefore)
  } else {
    balanceOutBN = (await env.user.getBalance()).sub(balanceOutBNBefore)
    balanceOutBN = balanceOutBN.add(receipt.effectiveGasPrice.mul(receipt.gasUsed))
  }
  const slippage = parseInt(balanceOutBN.sub(route.amountOutBN).mul(10_000).div(route.amountOutBN).toString())

  if (slippage !== 0) {
    console.log(`expected amountOut: ${route.amountOutBN.toString()}`)
    console.log(`real amountOut:     ${balanceOutBN.toString()}`)
    console.log(`slippage: ${slippage / 100}%`)
  }
  console.log(`gas use: ${receipt.gasUsed.toString()}`)
  expect(slippage).equal(0)

  return [balanceOutBN, receipt.blockNumber]
}

async function dataUpdated(env: TestEnvironment, minBlockNumber: number) {
  for (;;) {
    if (env.dataFetcher.getLastUpdateBlock() >= minBlockNumber) return
    await delay(500)
  }
}

async function updMakeSwap(
  env: TestEnvironment,
  fromToken: Type,
  toToken: Type,
  lastCallResult: BigNumber | [BigNumber | undefined, number],
  providers?: LiquidityProviders[],
  poolFilter?: PoolFilter
): Promise<[BigNumber | undefined, number]> {
  const [amountIn, waitBlock] = lastCallResult instanceof BigNumber ? [lastCallResult, 1] : lastCallResult
  if (amountIn === undefined) return [undefined, waitBlock] // previous swap failed

  console.log('')
  //console.log('Wait data update for min block', waitBlock)
  await dataUpdated(env, waitBlock)
  const res = await makeSwap(env, fromToken, amountIn, toToken, providers, poolFilter)
  expect(res).not.undefined
  if (res === undefined) return [undefined, waitBlock]
  else return res
}

// skipped because took too long time. Unskip to check the RP
describe('End-to-end Router test', async function () {
  let env: TestEnvironment
  let chainId: ChainId
  let intermidiateResult: [BigNumber | undefined, number] = [undefined, 1]
  let testTokensSet: (Type | undefined)[]
  let SUSHI_LOCAL: Token

  before(async () => {
    env = await getTestEnvironment()
    chainId = env.chainId

    type SUSHI_CHAINS = keyof typeof SUSHI_ADDRESS
    type USDC_CHAINS = keyof typeof USDC_ADDRESS
    type USDT_CHAINS = keyof typeof USDT_ADDRESS
    type DAI_CHAINS = keyof typeof DAI_ADDRESS
    type FRAX_CHAINS = keyof typeof FRAX_ADDRESS
    type FXS_CHAINS = keyof typeof FXS_ADDRESS
    SUSHI_LOCAL = SUSHI[chainId as SUSHI_CHAINS]
    testTokensSet = [
      Native.onChain(chainId),
      WNATIVE[chainId],
      SUSHI[chainId as SUSHI_CHAINS],
      USDC[chainId as USDC_CHAINS],
      USDT[chainId as USDT_CHAINS],
      DAI[chainId as DAI_CHAINS],
      FRAX[chainId as FRAX_CHAINS],
      FXS[chainId as FXS_CHAINS],
    ]
  })

  it('Native => SUSHI => Native', async function () {
    intermidiateResult[0] = getBigNumber(1000000 * 1e18)
    intermidiateResult = await updMakeSwap(env, Native.onChain(chainId), SUSHI_LOCAL, intermidiateResult)
    intermidiateResult = await updMakeSwap(env, SUSHI_LOCAL, Native.onChain(chainId), intermidiateResult)
  })

  it('Native => WrappedNative => Native', async function () {
    intermidiateResult[0] = getBigNumber(1 * 1e18)
    intermidiateResult = await updMakeSwap(env, Native.onChain(chainId), WNATIVE[chainId], intermidiateResult)
    intermidiateResult = await updMakeSwap(env, WNATIVE[chainId], Native.onChain(chainId), intermidiateResult)
  })

  it('Trident Native => SUSHI => Native (Polygon only)', async function () {
    if (chainId == ChainId.POLYGON) {
      intermidiateResult[0] = getBigNumber(10_000 * 1e18)
      intermidiateResult = await updMakeSwap(env, Native.onChain(chainId), SUSHI[chainId], intermidiateResult, [
        LiquidityProviders.Trident,
      ])
      intermidiateResult = await updMakeSwap(env, SUSHI[chainId], Native.onChain(chainId), intermidiateResult, [
        LiquidityProviders.Trident,
      ])
    }
  })

  it('StablePool Native => USDC => USDT => DAI => USDC (Polygon only)', async function () {
    const filter = (pool: RPool) => pool instanceof StableSwapRPool || pool instanceof BridgeBento
    if (chainId == ChainId.POLYGON) {
      intermidiateResult[0] = getBigNumber(10_000 * 1e18)
      intermidiateResult = await updMakeSwap(env, Native.onChain(chainId), USDC[chainId], intermidiateResult)
      intermidiateResult = await updMakeSwap(env, USDC[chainId], USDT[chainId], intermidiateResult, undefined, filter)
      intermidiateResult = await updMakeSwap(env, USDT[chainId], DAI[chainId], intermidiateResult, undefined, filter)
      intermidiateResult = await updMakeSwap(env, DAI[chainId], USDC[chainId], intermidiateResult, undefined, filter)
    }
  })

  function getNextToken(rnd: () => number, previousTokenIndex: number): number {
    for (;;) {
      const next = Math.floor(rnd() * testTokensSet.length)
      if (next == previousTokenIndex) continue
      if (testTokensSet[next] === undefined) continue
      return next
    }
  }

  it.skip('Random swap test', async function () {
    const testSeed = '10' // Change it to change random generator values
    const rnd: () => number = seedrandom(testSeed) // random [0, 1)
    let routeCounter = 0
    for (let i = 0; i < 100; ++i) {
      let currentToken = 0
      intermidiateResult[0] = getBigNumber(getRandomExp(rnd, 1e15, 1e24))
      for (;;) {
        const nextToken = getNextToken(rnd, currentToken)
        console.log('Round # ', i + 1, ' Total Route # ', ++routeCounter)
        intermidiateResult = await updMakeSwap(
          env,
          testTokensSet[currentToken] as Type,
          testTokensSet[nextToken] as Type,
          intermidiateResult
        )
        currentToken = nextToken
        if (currentToken == 0) break
      }
    }
  })

  it('Special Router', async function () {
    env.dataFetcher.fetchPoolsForToken(Native.onChain(chainId), SUSHI_LOCAL)
    const route = findSpecialRoute(env.dataFetcher, Native.onChain(chainId), getBigNumber(1 * 1e18), SUSHI_LOCAL, 30e9)
    // if (route.priceImpact !== undefined && route.priceImpact < 0.005) {
    //   // All pools should be from preferrable list
    //   const pools = env.dataFetcher.getCurrentPoolCodeList(PreferrableLiquidityProviders).map((pc) => pc.pool.address)
    //   const poolSet = new Set(pools)
    //   route.legs.forEach((l) => expect(poolSet.has(l.poolAddress)).true)
    // }
    expect(route).not.undefined
  })
})
