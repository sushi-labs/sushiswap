import { SnapshotRestorer, takeSnapshot } from '@nomicfoundation/hardhat-network-helpers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { erc20Abi, weth9Abi } from '@sushiswap/abi'
import { bentoBoxV1Address, BentoBoxV1ChainId } from '@sushiswap/bentobox'
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
  WBTC_ADDRESS,
  WNATIVE,
} from '@sushiswap/currency'
import {
  DataFetcher,
  LiquidityProviders,
  NativeWrapBridgePoolCode,
  PermitData,
  PoolFilter,
  Router,
} from '@sushiswap/router'
import { PoolCode } from '@sushiswap/router/dist/pools/PoolCode'
import { BridgeBento, getBigNumber, RouteStatus, RPool, StableSwapRPool } from '@sushiswap/tines'
import { setTokenBalance } from '@sushiswap/tines-sandbox'
import { expect } from 'chai'
import { signERC2612Permit } from 'eth-permit'
import { BigNumber, Contract } from 'ethers'
import { ethers, network } from 'hardhat'
import seedrandom from 'seedrandom'
import { createPublicClient } from 'viem'
import { custom } from 'viem'
import { hardhat } from 'viem/chains'

import { getAllPoolCodes } from './utils/getAllPoolCodes'

// Updating  pools' state allows to test DF updating ability, but makes tests very-very slow (
const UPDATE_POOL_STATES = false
const POLLING_INTERVAL = process.env.ALCHEMY_ID ? 1_000 : 10_000
const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

function getRandomExp(rnd: () => number, min: number, max: number) {
  const minL = Math.log(min)
  const maxL = Math.log(max)
  const v = rnd() * (maxL - minL) + minL
  const res = Math.exp(v)
  console.assert(res <= max && res >= min, 'Random value is out of the range')
  return res
}

async function setRouterPrimaryBalance(router: string, token?: string): Promise<void> {
  if (token) {
    await setTokenBalance(token, router, 1n)
  }
}

interface TestEnvironment {
  chainId: ChainId
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider: any
  rp: Contract
  user: SignerWithAddress
  user2: SignerWithAddress
  dataFetcher: DataFetcher
  poolCodes: Map<string, PoolCode>
  snapshot: SnapshotRestorer
}

async function getTestEnvironment(): Promise<TestEnvironment> {
  const client = createPublicClient({
    batch: {
      multicall: {
        batchSize: 2048,
        wait: 16,
      },
    },
    chain: {
      ...hardhat,
      contracts: {
        multicall3: {
          address: '0xca11bde05977b3631167028862be2a173976ca11',
          blockCreated: 25770160,
        },
      },
      pollingInterval: POLLING_INTERVAL,
    },
    transport: custom(network.provider),
  })
  //await switchMulticallToEthers(client)

  const provider = ethers.provider
  const chainId = network.config.chainId as ChainId
  const dataFetcher = new DataFetcher(chainId, client)

  dataFetcher.startDataFetching()
  const poolCodes = new Map<string, PoolCode>()
  if (!UPDATE_POOL_STATES) {
    const pc = await getAllPoolCodes(
      dataFetcher,
      chainId,
      (network.config as { forking: { blockNumber?: number } }).forking?.blockNumber
    )
    pc.forEach((p) => poolCodes.set(p.pool.address, p))
  }

  const RouteProcessor = await ethers.getContractFactory('RouteProcessor3')
  const routeProcessor = await RouteProcessor.deploy(bentoBoxV1Address[chainId as BentoBoxV1ChainId], [])
  await routeProcessor.deployed()
  //console.log('    Block Number:', provider.blockNumber)

  // saturate router balance with wei of tokens
  await setRouterPrimaryBalance(routeProcessor.address, WNATIVE[chainId].address)
  await setRouterPrimaryBalance(routeProcessor.address, SUSHI_ADDRESS[chainId as keyof typeof SUSHI_ADDRESS])
  await setRouterPrimaryBalance(routeProcessor.address, USDC_ADDRESS[chainId as keyof typeof USDC_ADDRESS])
  await setRouterPrimaryBalance(routeProcessor.address, USDT_ADDRESS[chainId as keyof typeof USDT_ADDRESS])
  await setRouterPrimaryBalance(routeProcessor.address, DAI_ADDRESS[chainId as keyof typeof DAI_ADDRESS])
  await setRouterPrimaryBalance(routeProcessor.address, FRAX_ADDRESS[chainId as keyof typeof FRAX_ADDRESS])
  await setRouterPrimaryBalance(routeProcessor.address, FXS_ADDRESS[chainId as keyof typeof FXS_ADDRESS])
  await setRouterPrimaryBalance(routeProcessor.address, WBTC_ADDRESS[chainId as keyof typeof WBTC_ADDRESS])

  console.log(`  Network: ${chainName[chainId]}, Forked Block: ${provider.blockNumber}`)
  //console.log('    User creation ...')
  const [Alice, Bob] = await ethers.getSigners()

  return {
    chainId,
    provider,
    rp: routeProcessor,
    user: Alice,
    user2: Bob,
    dataFetcher,
    poolCodes,
    snapshot: await takeSnapshot(),
  }
}

async function makePermit(env: TestEnvironment, token: Token, amount: BigNumber): Promise<PermitData> {
  const userAddress = await env.user.getAddress()
  const result = await signERC2612Permit(env.user, token.address, userAddress, env.rp.address, amount.toHexString())
  return {
    value: BigNumber.from(result.value),
    deadline: BigNumber.from(result.deadline),
    v: result.v,
    r: result.r,
    s: result.s,
  }
}

// all pool data assumed to be updated
async function makeSwap(
  env: TestEnvironment,
  fromToken: Type,
  amountIn: BigNumber,
  toToken: Type,
  usedPools: Set<string>,
  providers?: LiquidityProviders[],
  poolFilter?: PoolFilter,
  permits: PermitData[] = [],
  makeSankeyDiagram = false
): Promise<[BigNumber, number] | undefined> {
  // console.log(`Make swap ${fromToken.symbol} -> ${toToken.symbol} amount: ${amountIn.toString()}`)

  if (fromToken instanceof Token && permits.length == 0) {
    //console.log(`Approve user's ${fromToken.symbol} to the route processor ...`)
    const WrappedBaseTokenContract = new ethers.Contract(fromToken.address, erc20Abi, env.user)
    await WrappedBaseTokenContract.connect(env.user).approve(env.rp.address, amountIn)
  }

  let pcMap: Map<string, PoolCode>
  if (UPDATE_POOL_STATES) {
    await env.dataFetcher.fetchPoolsForToken(fromToken, toToken)
    pcMap = env.dataFetcher.getCurrentPoolCodeMap(fromToken, toToken)
  } else {
    pcMap = new Map()
    Array.from(env.poolCodes.entries()).forEach((e) => {
      if (!usedPools.has(e[0])) pcMap.set(e[0], e[1])
    })
  }
  //await checkPoolsState(pcMap, env.user, env.chainId)

  const route = Router.findBestRoute(pcMap, env.chainId, fromToken, amountIn, toToken, 30e9, providers, poolFilter)
  // console.log(Router.routeToHumanString(pcMap, route, fromToken, toToken))
  // console.log(
  //   'ROUTE:',
  //   route.legs.map(
  //     (l) =>
  //       `${l.tokenFrom.symbol} -> ${l.tokenTo.symbol}  ${l.poolAddress}  ${l.assumedAmountIn} -> ${l.assumedAmountOut}`
  //   )
  // )
  if (route.status == RouteStatus.NoWay) return

  const rpParams = Router.routeProcessor2Params(
    pcMap,
    route,
    fromToken,
    toToken,
    env.user.address,
    env.rp.address,
    permits
  )
  if (rpParams === undefined) return

  // console.log('Call route processor (may take long time for the first launch)...')

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

  if (!UPDATE_POOL_STATES) {
    route.legs.forEach((l) => {
      if (!(pcMap.get(l.poolAddress) instanceof NativeWrapBridgePoolCode)) {
        usedPools.add(l.poolAddress)
      }
    })
  }

  // const trace = await network.provider.send('debug_traceTransaction', [receipt.transactionHash])
  // printGasUsage(trace)

  // console.log("Fetching user's output balance ...")
  let balanceOutBN: BigNumber
  if (toTokenContract) {
    balanceOutBN = (await toTokenContract.connect(env.user).balanceOf(env.user.address)).sub(balanceOutBNBefore)
  } else {
    balanceOutBN = (await env.user.getBalance()).sub(balanceOutBNBefore)
    balanceOutBN = balanceOutBN.add(receipt.effectiveGasPrice.mul(receipt.gasUsed))
  }
  const slippage = parseInt(balanceOutBN.sub(route.amountOutBN).mul(10_000).div(route.amountOutBN).toString())

  if (route.amountOutBN.sub(balanceOutBN).abs().gt(10)) {
    if (slippage < 0) {
      console.log(`expected amountOut: ${route.amountOutBN.toString()}`)
      console.log(`real amountOut:     ${balanceOutBN.toString()}`)
      console.log(`slippage: ${slippage / 100}%`)
    }
    expect(slippage).greaterThanOrEqual(0) // positive slippage could be if we 'gather' some liquidity on the route
  }

  return [balanceOutBN, receipt.blockNumber]
}

async function dataUpdated(env: TestEnvironment, minBlockNumber: number) {
  if (UPDATE_POOL_STATES)
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
  usedPools: Set<string> = new Set(),
  providers?: LiquidityProviders[],
  poolFilter?: PoolFilter,
  permits: PermitData[] = [],
  makeSankeyDiagram = false
): Promise<[BigNumber | undefined, number]> {
  const [amountIn, waitBlock] = lastCallResult instanceof BigNumber ? [lastCallResult, 1] : lastCallResult
  if (amountIn === undefined) return [undefined, waitBlock] // previous swap failed

  //console.log('Wait data update for min block', waitBlock)
  await dataUpdated(env, waitBlock)

  const res = await makeSwap(
    env,
    fromToken,
    amountIn,
    toToken,
    usedPools,
    providers,
    poolFilter,
    permits,
    makeSankeyDiagram
  )
  if (res === undefined) return [undefined, waitBlock]
  else return res
}

async function checkTransferAndRoute(
  env: TestEnvironment,
  fromToken: Type,
  toToken: Type,
  lastCallResult: BigNumber | [BigNumber | undefined, number],
  usedPools: Set<string>
): Promise<[BigNumber | undefined, number]> {
  const [amountIn, waitBlock] = lastCallResult instanceof BigNumber ? [lastCallResult, 1] : lastCallResult
  if (amountIn === undefined) return [undefined, waitBlock] // previous swap failed
  await dataUpdated(env, waitBlock)

  if (fromToken instanceof Token) {
    const WrappedBaseTokenContract = await new ethers.Contract(fromToken.address, erc20Abi, env.user)
    await WrappedBaseTokenContract.connect(env.user).approve(env.rp.address, amountIn)
  }

  let pcMap: Map<string, PoolCode>
  if (UPDATE_POOL_STATES) {
    await env.dataFetcher.fetchPoolsForToken(fromToken, toToken)
    pcMap = env.dataFetcher.getCurrentPoolCodeMap(fromToken, toToken)
  } else {
    pcMap = new Map()
    Array.from(env.poolCodes.entries()).forEach((e) => {
      if (!usedPools.has(e[0])) pcMap.set(e[0], e[1])
    })
  }

  const route = Router.findBestRoute(pcMap, env.chainId, fromToken, amountIn, toToken, 30e9)
  const rpParams = Router.routeProcessor2Params(pcMap, route, fromToken, toToken, env.user.address, env.rp.address)
  const transferValue = getBigNumber(0.02 * Math.pow(10, Native.onChain(env.chainId).decimals))
  rpParams.value = (rpParams.value || BigNumber.from(0)).add(transferValue)

  const balanceUser2Before = await env.user2.getBalance()

  let balanceOutBNBefore: BigNumber
  let toTokenContract: Contract | undefined = undefined
  if (toToken instanceof Token) {
    toTokenContract = await new ethers.Contract(toToken.address, weth9Abi, env.user)
    balanceOutBNBefore = await toTokenContract.connect(env.user).balanceOf(env.user.address)
  } else {
    balanceOutBNBefore = await env.user.getBalance()
  }
  const tx = await env.rp.transferValueAndprocessRoute(
    env.user2.address,
    transferValue,
    rpParams.tokenIn,
    rpParams.amountIn,
    rpParams.tokenOut,
    rpParams.amountOutMin,
    rpParams.to,
    rpParams.routeCode,
    { value: rpParams.value }
  )
  const receipt = await tx.wait()

  if (!UPDATE_POOL_STATES) {
    route.legs.forEach((l) => {
      if (!(pcMap.get(l.poolAddress) instanceof NativeWrapBridgePoolCode)) {
        usedPools.add(l.poolAddress)
      }
    })
  }

  let balanceOutBN: BigNumber
  if (toTokenContract) {
    balanceOutBN = (await toTokenContract.connect(env.user).balanceOf(env.user.address)).sub(balanceOutBNBefore)
  } else {
    balanceOutBN = (await env.user.getBalance()).sub(balanceOutBNBefore)
    balanceOutBN = balanceOutBN.add(receipt.effectiveGasPrice.mul(receipt.gasUsed))
    balanceOutBN = balanceOutBN.add(transferValue)
  }
  expect(balanceOutBN.gte(rpParams.amountOutMin)).equal(true)

  const balanceUser2After = await env.user2.getBalance()
  const transferredValue = balanceUser2After.sub(balanceUser2Before)
  expect(transferredValue.eq(transferValue)).equal(true)

  return [balanceOutBN, receipt.blockNumber]
}

// skipped because took too long time. Unskip to check the RP
describe('End-to-end RouteProcessor3 test', async function () {
  let env: TestEnvironment
  let chainId: ChainId
  let intermidiateResult: [BigNumber | undefined, number] = [undefined, 1]
  let testTokensSet: (Type | undefined)[]
  let SUSHI_LOCAL: Token
  let USDC_LOCAL: Token

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
    USDC_LOCAL = USDC[chainId as USDC_CHAINS]
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

  it('Permit: Native => FRAX => Native', async function () {
    await env.snapshot.restore()
    const usedPools = new Set<string>()
    const token = FRAX[chainId as keyof typeof FRAX_ADDRESS]
    const amountIn = getBigNumber(1000000 * 1e18)
    intermidiateResult[0] = amountIn
    intermidiateResult = await updMakeSwap(env, Native.onChain(chainId), token, intermidiateResult, usedPools)
    const permit = await makePermit(env, token, intermidiateResult[0] as BigNumber)
    intermidiateResult = await updMakeSwap(
      env,
      token,
      Native.onChain(chainId),
      intermidiateResult,
      usedPools,
      undefined,
      undefined,
      [permit]
    )
  })

  it('Native => SUSHI => Native', async function () {
    await env.snapshot.restore()
    const usedPools = new Set<string>()
    intermidiateResult[0] = getBigNumber(1000000 * 1e18)
    intermidiateResult = await updMakeSwap(env, Native.onChain(chainId), SUSHI_LOCAL, intermidiateResult, usedPools)
    intermidiateResult = await updMakeSwap(env, SUSHI_LOCAL, Native.onChain(chainId), intermidiateResult, usedPools)
  })

  it('Native => WrappedNative => Native', async function () {
    await env.snapshot.restore()
    const usedPools = new Set<string>()
    intermidiateResult[0] = getBigNumber(1 * 1e18)
    intermidiateResult = await updMakeSwap(
      env,
      Native.onChain(chainId),
      WNATIVE[chainId],
      intermidiateResult,
      usedPools
    )
    intermidiateResult = await updMakeSwap(
      env,
      WNATIVE[chainId],
      Native.onChain(chainId),
      intermidiateResult,
      usedPools
    )
  })

  it('Trident Native => SUSHI => Native (Polygon only)', async function () {
    if (chainId === ChainId.POLYGON) {
      await env.snapshot.restore()
      const usedPools = new Set<string>()
      intermidiateResult[0] = getBigNumber(10_000 * 1e18)
      intermidiateResult = await updMakeSwap(
        env,
        Native.onChain(chainId),
        SUSHI[chainId],
        intermidiateResult,
        usedPools,
        [LiquidityProviders.Trident]
      )
      intermidiateResult = await updMakeSwap(
        env,
        SUSHI[chainId],
        Native.onChain(chainId),
        intermidiateResult,
        usedPools,
        [LiquidityProviders.Trident]
      )
    }
  })

  it('StablePool Native => USDC => USDT => DAI => USDC (Polygon only)', async function () {
    const filter = (pool: RPool) => pool instanceof StableSwapRPool || pool instanceof BridgeBento

    if (chainId === ChainId.POLYGON) {
      await env.snapshot.restore()
      const usedPools = new Set<string>()
      intermidiateResult[0] = getBigNumber(10_000 * 1e18)
      intermidiateResult = await updMakeSwap(env, Native.onChain(chainId), USDC[chainId], intermidiateResult, usedPools)
      intermidiateResult = await updMakeSwap(
        env,
        USDC[chainId],
        USDT[chainId],
        intermidiateResult,
        usedPools,
        undefined,
        filter
      )
      intermidiateResult = await updMakeSwap(
        env,
        USDT[chainId],
        DAI[chainId],
        intermidiateResult,
        usedPools,
        undefined,
        filter
      )
      intermidiateResult = await updMakeSwap(
        env,
        DAI[chainId],
        USDC[chainId],
        intermidiateResult,
        usedPools,
        undefined,
        filter
      )
    }
  })

  if (process.env.ALCHEMY_ID) {
    it('V3,  Native => USDC => NATIVE', async function () {
      if (chainId === ChainId.POLYGON) {
        await env.snapshot.restore()
        const usedPools = new Set<string>()
        let amountAndBlock: [BigNumber | undefined, number] = [undefined, 1]
        amountAndBlock[0] = getBigNumber(10_000_000 * 1e18) // should be partial
        amountAndBlock = await updMakeSwap(env, Native.onChain(chainId), USDC[chainId], amountAndBlock, usedPools, [
          LiquidityProviders.UniswapV3,
          LiquidityProviders.SushiSwapV3,
        ])
        amountAndBlock = await updMakeSwap(env, USDC[chainId], Native.onChain(chainId), amountAndBlock, usedPools, [
          LiquidityProviders.UniswapV3,
          LiquidityProviders.SushiSwapV3,
        ])
      }
    })
  }

  function getNextToken(rnd: () => number, previousTokenIndex: number): number {
    for (;;) {
      const next = Math.floor(rnd() * testTokensSet.length)
      if (next === previousTokenIndex) continue
      if (testTokensSet[next] === undefined) continue
      return next
    }
  }

  it.skip('Random swap test', async function () {
    let routeCounter = 0
    for (let i = 0; i < 1000; ++i) {
      await env.snapshot.restore()
      const usedPools = new Set<string>()
      let currentToken = 0
      const rnd: () => number = seedrandom(`testSeed ${i}`) // random [0, 1)
      intermidiateResult[0] = getBigNumber(getRandomExp(rnd, 1e15, 1e24))
      for (;;) {
        const nextToken = getNextToken(rnd, currentToken)
        console.log('Round # ', i + 1, ' Total Route # ', ++routeCounter)
        intermidiateResult = await updMakeSwap(
          env,
          testTokensSet[currentToken] as Type,
          testTokensSet[nextToken] as Type,
          intermidiateResult,
          usedPools
        )
        currentToken = nextToken
        if (currentToken === 0 || intermidiateResult[0] == undefined || intermidiateResult[0].lte(1000)) break
      }
    }
  })

  it('Special Router', async function () {
    await env.snapshot.restore()

    let pcMap
    if (UPDATE_POOL_STATES) {
      await env.dataFetcher.fetchPoolsForToken(Native.onChain(chainId), SUSHI_LOCAL)
      pcMap = env.dataFetcher.getCurrentPoolCodeMap(Native.onChain(chainId), SUSHI_LOCAL)
    } else pcMap = env.poolCodes

    const route = Router.findSpecialRoute(
      pcMap,
      chainId,
      Native.onChain(chainId),
      getBigNumber(1 * 1e18),
      SUSHI_LOCAL,
      30e9
    )
    expect(route).not.undefined
  })

  if (network.config.chainId === ChainId.POLYGON) {
    it('Transfer value and route 1', async function () {
      await env.snapshot.restore()
      const usedPools = new Set<string>()
      intermidiateResult[0] = getBigNumber(1e18)
      intermidiateResult = await checkTransferAndRoute(
        env,
        Native.onChain(chainId),
        SUSHI_LOCAL,
        intermidiateResult,
        usedPools
      )
      intermidiateResult = await checkTransferAndRoute(env, SUSHI_LOCAL, USDC_LOCAL, intermidiateResult, usedPools)
      intermidiateResult = await checkTransferAndRoute(
        env,
        USDC_LOCAL,
        Native.onChain(chainId),
        intermidiateResult,
        usedPools
      )
    })

    it('Transfer value and route 2', async function () {
      await env.snapshot.restore()
      const usedPools = new Set<string>()
      intermidiateResult[0] = getBigNumber(1e18)
      intermidiateResult = await checkTransferAndRoute(
        env,
        Native.onChain(chainId),
        WNATIVE[chainId],
        intermidiateResult,
        usedPools
      )
      intermidiateResult = await checkTransferAndRoute(
        env,
        WNATIVE[chainId],
        SUSHI_LOCAL,
        intermidiateResult,
        usedPools
      )
      intermidiateResult = await checkTransferAndRoute(
        env,
        SUSHI_LOCAL,
        WNATIVE[chainId],
        intermidiateResult,
        usedPools
      )
      intermidiateResult = await checkTransferAndRoute(
        env,
        WNATIVE[chainId],
        Native.onChain(chainId),
        intermidiateResult,
        usedPools
      )
    })

    it('Transfer value and route 3 - check EOA', async function () {
      await env.snapshot.restore()
      const usedPools = new Set<string>()
      intermidiateResult[0] = getBigNumber(1e18)
      env.user2 = await ethers.getSigner('0x0000000000000000000000000000000000000001')
      intermidiateResult = await checkTransferAndRoute(
        env,
        Native.onChain(chainId),
        SUSHI_LOCAL,
        intermidiateResult,
        usedPools
      )
      intermidiateResult = await checkTransferAndRoute(env, SUSHI_LOCAL, USDC_LOCAL, intermidiateResult, usedPools)
      intermidiateResult = await checkTransferAndRoute(
        env,
        USDC_LOCAL,
        Native.onChain(chainId),
        intermidiateResult,
        usedPools
      )
    })

    it('Transfer value and route 4 - not payable address', async function () {
      await env.snapshot.restore()
      const usedPools = new Set<string>()
      intermidiateResult[0] = getBigNumber(1e18)
      env.user2 = await ethers.getSigner('0x597A9bc3b24C2A578CCb3aa2c2C62C39427c6a49')
      let throwed = false
      try {
        await checkTransferAndRoute(env, Native.onChain(chainId), SUSHI_LOCAL, intermidiateResult, usedPools)
      } catch (e) {
        throwed = true
      }
      expect(throwed, 'Transfer value to not payable address should fail').equal(true)
    })
  }
})
