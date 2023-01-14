import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { erc20Abi, weth9Abi } from '@sushiswap/abi'
import { ChainId, chainName } from '@sushiswap/chain'
import { DAI, Native, SUSHI, Token, Type, USDC, USDT, WNATIVE } from '@sushiswap/currency'
import { BentoBox, DataFetcher, findSpecialRoute, PoolFilter, Router } from '@sushiswap/router'
import { LiquidityProviders } from '@sushiswap/router/dist/liquidity-providers/LiquidityProviderMC'
import { BridgeBento, getBigNumber, MultiRoute, RPool, StableSwapRPool } from '@sushiswap/tines'
import { expect } from 'chai'
import { BigNumber, Contract } from 'ethers'
import { ethers, network } from 'hardhat'

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
  const routeProcessor = await RouteProcessor.deploy(BentoBox[chainId] || '0x0000000000000000000000000000000000000000')
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

  before(async () => {
    env = await getTestEnvironment()
    chainId = env.chainId
  })

  it('Native => SUSHI => Native', async function () {
    intermidiateResult[0] = getBigNumber(1000000 * 1e18)
    intermidiateResult = await updMakeSwap(env, Native.onChain(chainId), SUSHI[chainId], intermidiateResult)
    intermidiateResult = await updMakeSwap(env, SUSHI[chainId], Native.onChain(chainId), intermidiateResult)
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

  it('Special Router', async function () {
    env.dataFetcher.fetchPoolsForToken(Native.onChain(chainId), SUSHI[chainId])
    const route = findSpecialRoute(
      env.dataFetcher,
      Native.onChain(chainId),
      getBigNumber(1 * 1e18),
      SUSHI[chainId],
      30e9
    )
    // if (route.priceImpact !== undefined && route.priceImpact < 0.005) {
    //   // All pools should be from preferrable list
    //   const pools = env.dataFetcher.getCurrentPoolCodeList(PreferrableLiquidityProviders).map((pc) => pc.pool.address)
    //   const poolSet = new Set(pools)
    //   route.legs.forEach((l) => expect(poolSet.has(l.poolAddress)).true)
    // }
    expect(route).not.undefined
  })
})
