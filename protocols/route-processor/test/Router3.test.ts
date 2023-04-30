import { Interface } from '@ethersproject/abi'
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
import {
  BridgeBento,
  BridgeUnlimited,
  ConstantProductRPool,
  getBigNumber,
  RouteStatus,
  RPool,
  StableSwapRPool,
  toShareBN,
  UniV3Pool,
} from '@sushiswap/tines'
import { expect } from 'chai'
import { signERC2612Permit } from 'eth-permit'
import { BigNumber, Contract } from 'ethers'
import { ethers, network } from 'hardhat'
import seedrandom from 'seedrandom'
import { createPublicClient } from 'viem'
import { custom } from 'viem'
import { hardhat } from 'viem/chains'

import { loadPoolSnapshot, savePoolSnapshot } from './utils/poolSerializer'

// Updating  pools' state allows to test DF updating ability, but makes tests very-very slow (
const UPDATE_POOL_STATES = false

function getRandomExp(rnd: () => number, min: number, max: number) {
  const minL = Math.log(min)
  const maxL = Math.log(max)
  const v = rnd() * (maxL - minL) + minL
  const res = Math.exp(v)
  console.assert(res <= max && res >= min, 'Random value is out of the range')
  return res
}

const POLLING_INTERVAL = process.env.ALCHEMY_ID ? 1_000 : 10_000

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

function closeValues(_a: number | BigNumber, _b: number | BigNumber, accuracy: number, absolute: number): boolean {
  const a: number = typeof _a == 'number' ? _a : parseInt(_a.toString())
  const b: number = typeof _b == 'number' ? _b : parseInt(_b.toString())
  if (accuracy === 0) return a === b
  if (Math.abs(a - b) < absolute) return true
  // if (Math.abs(a) < 1 / accuracy) return Math.abs(a - b) <= 10
  // if (Math.abs(b) < 1 / accuracy) return Math.abs(a - b) <= 10
  return Math.abs(a / b - 1) < accuracy
}

function expectCloseValues(
  _a: number | BigNumber,
  _b: number | BigNumber,
  accuracy: number,
  absolute: number,
  logInfoIfFalse = ''
) {
  const res = closeValues(_a, _b, accuracy, absolute)
  if (!res) {
    console.log(`Expected close: ${_a}, ${_b}, ${accuracy} ${logInfoIfFalse}`)
    // debugger
    expect(res).equal(true)
  }
  return res
}

export async function checkPoolsState(pools: Map<string, PoolCode>, env: TestEnvironment) {
  const bentoAddress = bentoBoxV1Address[env.chainId as BentoBoxV1ChainId]
  const bentoContract = new Contract(
    bentoAddress,
    ['function totals(address) view returns (uint128, uint128)'],
    env.user
  )

  const addresses = Array.from(pools.keys())
  for (let i = 0; i < addresses.length; ++i) {
    const addr = addresses[i]
    const pool = (pools.get(addr) as PoolCode).pool
    if (pool instanceof StableSwapRPool) {
      const poolContract = new Contract(addr, ['function getReserves() view returns (uint256, uint256)'], env.user)

      const totals0 = await bentoContract.totals(pool.token0.address)
      const token0 = pool.token0.symbol
      expectCloseValues(pool.getTotal0().elastic, totals0[0], 1e-10, 10, `StableSwapRPool ${addr} ${token0}.elastic`)
      expectCloseValues(pool.getTotal0().base, totals0[1], 1e-10, 10, `StableSwapRPool ${addr} ${token0}.base`)

      const totals1 = await bentoContract.totals(pool.token1.address)
      const token1 = pool.token1.symbol
      expectCloseValues(pool.getTotal1().elastic, totals1[0], 1e-10, 10, `StableSwapRPool ${addr} ${token1}.elastic`)
      expectCloseValues(pool.getTotal1().base, totals1[1], 1e-10, 10, `StableSwapRPool ${addr} ${token1}.base`)

      const reserves = await poolContract.getReserves()
      expectCloseValues(
        pool.getReserve0(),
        toShareBN(reserves[0], pool.getTotal0()),
        1e-10,
        1e6,
        `StableSwapRPool ${addr} reserve0`
      )
      expectCloseValues(
        pool.getReserve1(),
        toShareBN(reserves[1], pool.getTotal1()),
        1e-10,
        1e6,
        `StableSwapRPool ${addr} reserve1`
      )
    } else if (pool instanceof ConstantProductRPool) {
      const poolContract = new Contract(addr, ['function getReserves() view returns (uint112, uint112)'], env.user)
      const reserves = await poolContract.getReserves()
      expectCloseValues(pool.getReserve0(), reserves[0], 1e-10, 10, `CP ${addr} reserve0`)
      expectCloseValues(pool.getReserve1(), reserves[1], 1e-10, 10, `CP ${addr} reserve1`)
    } else if (pool instanceof BridgeBento) {
      const totals = await bentoContract.totals(pool.token1.address)
      expectCloseValues(pool.elastic, totals[0], 1e-10, 10, `BentoBridge ${pool.token1.symbol} elastic`)
      expectCloseValues(pool.base, totals[1], 1e-10, 10, `BentoBridge ${pool.token1.symbol} base`)
    } else if (pool instanceof BridgeUnlimited) {
      // native - skip
    } else if (pool instanceof UniV3Pool) {
      // TODO: add pool check
    } else {
      console.log('Unknown pool: ', pool.address)
    }
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

async function switchMulticallToEthers(client: any) {
  //const oldFunction = client.multicall
  const [user] = await ethers.getSigners()
  const multicallContract = new Contract(
    '0xca11bde05977b3631167028862be2a173976ca11',
    [
      'function aggregate3(tuple(address target, bool allowFailure, bytes callData)[] calls) payable returns (tuple(bool success, bytes returnData)[] returnData)',
    ],
    user
  )
  client.multicall = async (arg: any) => {
    const ifaces: Interface[] = []
    const calls = arg.contracts.map((call: any, i: number) => {
      const iface = new ethers.utils.Interface(call.abi)
      ifaces[i] = iface
      const callData = iface.encodeFunctionData(call.functionName, call.args)
      return {
        target: call.address,
        allowFailure: arg.allowFailure,
        callData,
      }
    })

    const result0 = await multicallContract.callStatic.aggregate3(calls, { gasLimit: 1_000_000_000 })
    const result = result0.map((res: any, i: number) => {
      try {
        const result0 = ifaces[i].decodeFunctionResult(arg.contracts[i].functionName, res.returnData)
        let result = []
        for (let i = 0; i < result0.length; ++i) {
          if (result0[i] === undefined) continue
          result[i] = result0[i] instanceof BigNumber ? result0[i].toBigInt() : result0[i]
        }
        if (result.length == 1) result = result[0]
        return {
          result,
          status: res.success ? 'success' : 'failure',
        }
      } catch (e) {
        return {
          result: undefined,
          status: 'failure',
        }
      }
    })

    // correctness check
    // const etalon = await oldFunction(arg)
    // if (etalon.length !== result.length) console.error('Length wrong')
    // etalon.forEach((e: any, j: number) => {
    //   const r = result[j]
    //   if (e.status !== r.status) console.error('Status wrong', j, e, r)
    //   if (e.result instanceof Array) {
    //     e.result.forEach((a, i) => {
    //       if (a !== r.result[i]) console.error('Result wrong 1', j, i, e, r)
    //     })
    //   } else if (e.result !== r.result) console.error('Result wrong 0', j, e, r)
    // })

    return result
  }
}

async function getAllPoolCodes(
  dataFetcher: DataFetcher,
  chainId: ChainId,
  blockNumber: number | undefined
): Promise<PoolCode[]> {
  let poolCodes = loadPoolSnapshot(chainId, blockNumber)
  if (poolCodes === undefined) {
    const fetchedTokens: Token[] = [
      WNATIVE[chainId],
      SUSHI[chainId as keyof typeof SUSHI_ADDRESS],
      USDC[chainId as keyof typeof USDC_ADDRESS],
      USDT[chainId as keyof typeof USDT_ADDRESS],
      DAI[chainId as keyof typeof DAI_ADDRESS],
      FRAX[chainId as keyof typeof FRAX_ADDRESS],
      FXS[chainId as keyof typeof FXS_ADDRESS],
    ]
    const foundPools: Set<string> = new Set()
    poolCodes = []

    console.log('  Fetching pools data ...')
    for (let i = 0; i < fetchedTokens.length; ++i) {
      for (let j = i + 1; j < fetchedTokens.length; ++j) {
        console.log(`    ${fetchedTokens[i].symbol} - ${fetchedTokens[j].symbol}`)
        for (let p = 0; p < dataFetcher.providers.length; ++p) {
          const provider = dataFetcher.providers[p]
          await provider.fetchPoolsForToken(fetchedTokens[i], fetchedTokens[j], foundPools)
          const pc = provider.getCurrentPoolList(fetchedTokens[i], fetchedTokens[j])
          let newPools = 0
          pc.forEach((p) => {
            if (!foundPools.has(p.pool.address)) {
              ;(poolCodes as PoolCode[]).push(p)
              foundPools.add(p.pool.address)
              ++newPools
            }
          })
          if (newPools) console.log(`      ${provider.getPoolProviderName()} pools: ${newPools}`)
        }
      }
    }
    savePoolSnapshot(poolCodes, chainId, blockNumber)
  }
  const providers = new Map<LiquidityProviders, number>()
  poolCodes.forEach((p) => {
    const count = providers.get(p.liquidityProvider) || 0
    providers.set(p.liquidityProvider, count + 1)
  })
  Array.from(providers.entries()).forEach(([provider, count]) => console.log(`    ${provider} pools: ${count}`))
  console.log('    All providers pools:', poolCodes.length)

  return poolCodes as PoolCode[]
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
    const pc = await getAllPoolCodes(dataFetcher, chainId, network.config.forking?.blockNumber)
    pc.forEach((p) => poolCodes.set(p.pool.address, p))
  }

  const RouteProcessor = await ethers.getContractFactory('RouteProcessor3')
  const routeProcessor = await RouteProcessor.deploy(bentoBoxV1Address[chainId as BentoBoxV1ChainId], [])
  await routeProcessor.deployed()
  //console.log('    Block Number:', provider.blockNumber)

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
  //await checkPoolsState(pcMap, env)

  const route = Router.findBestRoute(pcMap, env.chainId, fromToken, amountIn, toToken, 30e9, providers, poolFilter)
  //console.log(Router.routeToHumanString(pcMap, route, fromToken, toToken))
  // console.log(
  //   'ROUTE:',
  //   route.legs.map(
  //     (l) =>
  //       l.tokenFrom.symbol +
  //       ' -> ' +
  //       l.tokenTo.symbol +
  //       '  ' +
  //       l.poolAddress +
  //       '  ' +
  //       l.assumedAmountIn +
  //       ' ->' +
  //       l.assumedAmountOut
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
        ])
        amountAndBlock = await updMakeSwap(env, USDC[chainId], Native.onChain(chainId), amountAndBlock, usedPools, [
          LiquidityProviders.UniswapV3,
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
    for (let i = 0; i < 100; ++i) {
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
          intermidiateResult
        )
        currentToken = nextToken
        if (currentToken === 0) break
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
