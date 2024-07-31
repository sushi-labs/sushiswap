import {
  SnapshotRestorer,
  takeSnapshot,
} from '@nomicfoundation/hardhat-network-helpers'
import {
  getBalance,
  setTokenBalance,
  tokenContract,
} from '@sushiswap/tines-sandbox'
import { expect } from 'chai'
import { signERC2612Permit } from 'eth-permit'
import hre from 'hardhat'
import seedrandom from 'seedrandom'
import { erc20Abi, routeProcessor5Abi, weth9Abi } from 'sushi/abi'
import { ChainId, chainName } from 'sushi/chain'
import { BENTOBOX_ADDRESS, BentoBoxChainId } from 'sushi/config'
import {
  DAI,
  DAI_ADDRESS,
  FRAX,
  FRAX_ADDRESS,
  FXS,
  FXS_ADDRESS,
  LINK,
  LINK_ADDRESS,
  MIM,
  MIM_ADDRESS,
  Native,
  SUSHI,
  SUSHI_ADDRESS,
  Token,
  Type,
  USDC,
  USDC_ADDRESS,
  USDT,
  USDT_ADDRESS,
  WBTC,
  WBTC_ADDRESS,
  WNATIVE,
} from 'sushi/currency'
import { abs } from 'sushi/math'
import { PoolCode } from 'sushi/router'
import {
  DataFetcher,
  LiquidityProviders,
  NativeWrapBridgePoolCode,
  PermitData,
  PoolFilter,
  Router,
  sETH,
} from 'sushi/router'
import {
  BridgeBento,
  MultiRoute,
  PoolType,
  RPool,
  RToken,
  RouteLeg,
  RouteStatus,
  StableSwapRPool,
  getBigInt,
} from 'sushi/tines'
import { type Contract } from 'sushi/types'
import {
  Address,
  Client,
  HDAccount,
  Hex,
  PublicClient,
  createPublicClient,
  custom,
  testActions,
  walletActions,
} from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import { hardhat } from 'viem/chains'

import path from 'path'
import { fileURLToPath } from 'url'
import RouteProcessor5 from '../artifacts/contracts/RouteProcessor5.sol/RouteProcessor5.json' assert {
  type: 'json',
}
import { getAllPoolCodes } from './utils/getAllPoolCodes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const snapshotDir = path.resolve(__dirname, './pool-snapshots/')

const { config, network } = hre

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

async function setRouterPrimaryBalance(
  client: Client,
  router: Address,
  token?: Address,
  amount = 1n,
): Promise<boolean> {
  if (token) {
    return await setTokenBalance(
      token,
      router,
      amount,
      client as PublicClient,
      network.provider,
    )
  }
  return false
}

const slippageIsOkDefault = (
  r: MultiRoute,
  slippage: number,
  env: { poolCodes: Map<string, PoolCode> },
) => {
  let minAmount = r.amountIn
  let hasBentoTokens = false
  let hasOverusedConcentrated = false
  r.legs.forEach((l) => {
    minAmount = Math.min(l.assumedAmountOut, l.assumedAmountIn, minAmount)
    if (l.tokenTo.symbol.startsWith('Bento')) hasBentoTokens = true
    if (l.poolType === PoolType.Concentrated) {
      const pool = env.poolCodes.get(l.poolAddress)?.pool
      if (pool) {
        try {
          pool.calcOutByIn(
            l.assumedAmountIn,
            l.tokenFrom.address === pool.token0.address,
          )
        } catch (_e) {
          hasOverusedConcentrated = true
        }
      }
    }
  })
  const maxSlippage = Math.max(4 / minAmount, 0.0001)
  if (hasBentoTokens) {
    // Bento has much liquidity we can sweep
    process.stdout.write('Bento ')
    return slippage >= -maxSlippage
  }
  if (hasOverusedConcentrated) {
    // UniV3 pool can use ticks outside of ticks range known by router (usually ±10%)
    process.stdout.write('UniV3 overuse ')
    return slippage >= -maxSlippage
  }
  return Math.abs(slippage) <= maxSlippage
}

async function getTestEnvironment() {
  const client = createPublicClient({
    batch: {
      multicall: {
        batchSize: 2048,
        wait: 1,
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
    .extend(testActions({ mode: 'hardhat' }))
    .extend(walletActions)

  const accounts = config.networks.hardhat.accounts as { mnemonic: string }

  const user = mnemonicToAccount(accounts.mnemonic, { accountIndex: 0 })
  const user2 = mnemonicToAccount(accounts.mnemonic, { accountIndex: 1 })

  const chainId = network.config.chainId as ChainId
  const dataFetcher = new DataFetcher(chainId, client)

  dataFetcher.startDataFetching()
  const poolCodes = new Map<string, PoolCode>()
  let poolList: PoolCode[] = []
  if (!UPDATE_POOL_STATES) {
    poolList = await getAllPoolCodes(
      dataFetcher,
      chainId,
      (network.config as { forking: { blockNumber?: number } }).forking
        ?.blockNumber,
      snapshotDir,
    )
    // n<0 for bridges
    const goodLiquidity = (n: bigint): boolean => n > 1000n || n < 0
    poolList
      .filter(
        // filter out empty pools
        ({ pool }) =>
          goodLiquidity(pool.getReserve0()) &&
          goodLiquidity(pool.getReserve1()),
      )
      .forEach((p) => poolCodes.set(p.pool.uniqueID(), p))
  }

  const RouteProcessorTx = await client.deployContract({
    chain: null,
    abi: routeProcessor5Abi,
    bytecode: RouteProcessor5.bytecode as Hex,
    account: user.address,
    args: [BENTOBOX_ADDRESS[chainId as BentoBoxChainId], []],
  })
  const RouteProcessorAddress = (
    await client.waitForTransactionReceipt({ hash: RouteProcessorTx })
  ).contractAddress
  if (!RouteProcessorAddress)
    throw new Error('RouteProcessorAddress is undefined')
  const RouteProcessor = {
    address: RouteProcessorAddress,
    abi: routeProcessor5Abi,
  }

  // saturate router balance with wei of tokens
  await Promise.all([
    setRouterPrimaryBalance(
      client,
      RouteProcessorAddress,
      WNATIVE[chainId].address as Address,
    ),
    setRouterPrimaryBalance(
      client,
      RouteProcessorAddress,
      SUSHI_ADDRESS[chainId as keyof typeof SUSHI_ADDRESS],
    ),
    setRouterPrimaryBalance(
      client,
      RouteProcessorAddress,
      USDC_ADDRESS[chainId as keyof typeof USDC_ADDRESS],
    ),
    setRouterPrimaryBalance(
      client,
      RouteProcessorAddress,
      USDT_ADDRESS[chainId as keyof typeof USDT_ADDRESS],
    ),
    setRouterPrimaryBalance(
      client,
      RouteProcessorAddress,
      DAI_ADDRESS[chainId as keyof typeof DAI_ADDRESS],
    ),
    setRouterPrimaryBalance(
      client,
      RouteProcessorAddress,
      FRAX_ADDRESS[chainId as keyof typeof FRAX_ADDRESS],
    ),
    setRouterPrimaryBalance(
      client,
      RouteProcessorAddress,
      FXS_ADDRESS[chainId as keyof typeof FXS_ADDRESS],
    ),
    setRouterPrimaryBalance(
      client,
      RouteProcessorAddress,
      WBTC_ADDRESS[chainId as keyof typeof WBTC_ADDRESS],
    ),
  ])

  console.log(
    `  Network: ${
      chainName[chainId]
    }, Forked Block: ${await client.getBlockNumber()}`,
  )
  //console.log('    User creation ...')

  return {
    chainId,
    client,
    rp: RouteProcessor,
    user,
    user2,
    dataFetcher,
    poolCodes,
    poolList,
    snapshot: await takeSnapshot(),
  } satisfies {
    chainId: ChainId
    client: Client
    rp: Contract<typeof routeProcessor5Abi>
    user: HDAccount
    user2: HDAccount
    dataFetcher: DataFetcher
    poolCodes: Map<string, PoolCode>
    poolList: PoolCode[]
    snapshot: SnapshotRestorer
  }
}

type TestEnvironment = Awaited<ReturnType<typeof getTestEnvironment>>

async function makePermit(
  env: TestEnvironment,
  token: Token,
  amount: bigint,
): Promise<PermitData> {
  const result = await signERC2612Permit(
    network.provider,
    token.address,
    env.user.address,
    env.rp.address,
    String(amount),
  )
  return {
    value: BigInt(result.value),
    deadline: BigInt(result.deadline),
    v: result.v,
    r: result.r,
    s: result.s,
  }
}

// all pool data assumed to be updated
async function makeSwap(
  env: TestEnvironment,
  fromToken: Type,
  amountIn: bigint,
  toToken: Type,
  usedPools: Set<string>,
  providers?: LiquidityProviders[],
  poolFilter?: PoolFilter,
  permits: PermitData[] = [],
  throwAtNoWay = true,
  slippageIsOk = slippageIsOkDefault,
): Promise<[bigint, bigint, number] | undefined> {
  // console.log(`Make swap ${fromToken.symbol} -> ${toToken.symbol} amount: ${amountIn.toString()}`)

  if (fromToken instanceof Token && permits.length === 0) {
    await env.client.writeContract({
      chain: null,
      abi: erc20Abi,
      address: fromToken.address as Address,
      account: env.user.address,
      functionName: 'approve',
      args: [env.rp.address, amountIn],
    })
  }

  let pcMap: Map<string, PoolCode>
  if (UPDATE_POOL_STATES) {
    await env.dataFetcher.fetchPoolsForToken(fromToken, toToken)
    pcMap = env.dataFetcher.getCurrentPoolCodeMap(fromToken, toToken)
  } else {
    pcMap = new Map()
    Array.from(env.poolCodes.entries()).forEach((e) => {
      if (!usedPools.has(e[1].pool.address)) pcMap.set(e[0], e[1])
    })
  }
  //await checkPoolsState(pcMap, env.user.address, env.chainId)

  const route = Router.findBestRoute(
    pcMap,
    env.chainId,
    fromToken,
    amountIn,
    toToken,
    30e9,
    providers,
    poolFilter,
  )

  if (route.status === RouteStatus.NoWay) {
    if (throwAtNoWay) throw new Error('NoWay')
    return
  }

  const rpParams = Router.routeProcessor5Params(
    pcMap,
    route,
    fromToken,
    toToken,
    env.user.address,
    env.rp.address,
    permits,
    0.1, // test has it's own slippage control, let the contract not fail
  )
  if (rpParams === undefined) return

  // console.log('Call route processor (may take long time for the first launch)...')

  let balanceOutBIBefore: bigint
  let toTokenContract: Contract<typeof weth9Abi> | undefined = undefined
  if (toToken instanceof Token) {
    toTokenContract = {
      abi: weth9Abi,
      address: toToken.address as Address,
    }

    balanceOutBIBefore = await env.client.readContract({
      ...(toTokenContract as NonNullable<typeof toTokenContract>),
      account: env.user.address,
      functionName: 'balanceOf',
      args: [env.user.address],
    })
  } else {
    balanceOutBIBefore = await env.client.getBalance({
      address: env.user.address,
    })
  }

  let tx
  try {
    tx = await env.client.writeContract({
      chain: null,
      ...env.rp,
      functionName: 'processRoute',
      args: [
        rpParams.tokenIn as Address,
        rpParams.amountIn,
        rpParams.tokenOut as Address,
        rpParams.amountOutMin,
        rpParams.to,
        rpParams.routeCode,
      ],
      account: env.user.address,
      value: rpParams.value || 0n,
    })
  } catch (e) {
    console.log('')
    console.log(Router.routeToHumanString(pcMap, route, fromToken, toToken))
    console.log(
      'ROUTE:',
      route.legs.map(
        (l) =>
          `${l.tokenFrom.symbol} -> ${l.tokenTo.symbol}  ${l.poolAddress}  ${l.assumedAmountIn} -> ${l.assumedAmountOut}`,
      ),
    )
    throw e
  }

  const receipt = await env.client.waitForTransactionReceipt({ hash: tx })

  if (!UPDATE_POOL_STATES) {
    route.legs.forEach((l) => {
      if (!(pcMap.get(l.uniqueId) instanceof NativeWrapBridgePoolCode)) {
        usedPools.add(l.poolAddress)
      }
    })
  }

  // const trace = await network.provider.send('debug_traceTransaction', [receipt.transactionHash])
  // console.log("Fetching user's output balance ...")
  let balanceOutBI: bigint
  if (toTokenContract) {
    balanceOutBI =
      (await env.client.readContract({
        ...toTokenContract,
        functionName: 'balanceOf',
        args: [env.user.address],
      })) - balanceOutBIBefore
  } else {
    balanceOutBI =
      (await env.client.getBalance({ address: env.user.address })) -
      balanceOutBIBefore
    balanceOutBI = balanceOutBI + receipt.effectiveGasPrice * receipt.gasUsed
  }
  const slippage = Number(
    ((balanceOutBI - route.amountOutBI) * 10_000n) / route.amountOutBI,
  )

  if (abs(route.amountOutBI - balanceOutBI) > 10n) {
    if (
      (slippageIsOk && !slippageIsOk(route, slippage / 10000, env)) ||
      (!slippageIsOk && slippage < 0)
    ) {
      console.log('')
      console.log(Router.routeToHumanString(pcMap, route, fromToken, toToken))
      console.log(
        'ROUTE:',
        route.legs.map(
          (l) =>
            `${l.tokenFrom.symbol} -> ${l.tokenTo.symbol}  ${l.poolAddress}  ${l.assumedAmountIn} -> ${l.assumedAmountOut}`,
        ),
      )
      console.log(`expected amountOut: ${route.amountOutBI.toString()}`)
      console.log(`real amountOut:     ${balanceOutBI.toString()}`)
      console.log(`slippage: ${slippage / 100}%`)
      expect(true).equals(false)
    }
  }

  return [balanceOutBI, receipt.blockNumber, slippage / 100]
}

async function dataUpdated(env: TestEnvironment, minBlockNumber: bigint) {
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
  lastCallResult: bigint | [bigint | undefined, bigint, number],
  usedPools: Set<string> = new Set(),
  providers?: LiquidityProviders[],
  poolFilter?: PoolFilter,
  permits: PermitData[] = [],
  throwAtNoWay = true,
  slippageIsOk = slippageIsOkDefault,
): Promise<[bigint | undefined, bigint, number]> {
  const [amountIn, waitBlock] =
    typeof lastCallResult === 'bigint'
      ? [lastCallResult, 1n, 0]
      : lastCallResult
  if (amountIn === undefined) return [undefined, waitBlock, 0] // previous swap failed

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
    throwAtNoWay,
    slippageIsOk,
  )
  if (res === undefined) return [undefined, waitBlock, 0]
  else return res
}

async function checkTransferAndRoute(
  env: TestEnvironment,
  fromToken: Type,
  toToken: Type,
  lastCallResult: bigint | [bigint | undefined, bigint, number],
  usedPools: Set<string>,
): Promise<[bigint | undefined, bigint, number]> {
  const [amountIn, waitBlock] =
    typeof lastCallResult === 'bigint' ? [lastCallResult, 1n] : lastCallResult
  if (amountIn === undefined) return [undefined, waitBlock, 0] // previous swap failed
  await dataUpdated(env, waitBlock)

  if (fromToken instanceof Token) {
    await tokenContract(env.client, fromToken).write.approve(
      [env.rp.address, amountIn],
      { chain: null, account: env.user.address },
    )
  }

  let pcMap: Map<string, PoolCode>
  if (UPDATE_POOL_STATES) {
    await env.dataFetcher.fetchPoolsForToken(fromToken, toToken)
    pcMap = env.dataFetcher.getCurrentPoolCodeMap(fromToken, toToken)
  } else {
    pcMap = new Map()
    Array.from(env.poolCodes.entries()).forEach((e) => {
      if (!usedPools.has(e[1].pool.address)) pcMap.set(e[0], e[1])
    })
  }

  const route = Router.findBestRoute(
    pcMap,
    env.chainId,
    fromToken,
    amountIn,
    toToken,
    30e9,
  )
  const rpParams = Router.routeProcessor5Params(
    pcMap,
    route,
    fromToken,
    toToken,
    env.user.address,
    env.rp.address,
  )
  const transferValue = getBigInt(
    0.02 * 10 ** Native.onChain(env.chainId).decimals,
  )
  rpParams.value = (rpParams.value || 0n) + transferValue

  const balanceUser2Before = await env.client.getBalance({
    address: env.user2.address,
  })

  const balanceOutBIBefore = await getBalance(
    env.client,
    toToken,
    env.user.address,
  )
  const tx = await env.client.writeContract({
    ...env.rp,
    chain: null,
    functionName: 'transferValueAndprocessRoute',
    args: [
      env.user2.address,
      transferValue,
      rpParams.tokenIn,
      rpParams.amountIn,
      rpParams.tokenOut,
      rpParams.amountOutMin,
      rpParams.to,
      rpParams.routeCode,
    ],
    account: env.user.address,
    value: rpParams.value,
  })
  const receipt = await env.client.waitForTransactionReceipt({ hash: tx })

  if (!UPDATE_POOL_STATES) {
    route.legs.forEach((l) => {
      if (!(pcMap.get(l.uniqueId) instanceof NativeWrapBridgePoolCode)) {
        usedPools.add(l.poolAddress)
      }
    })
  }

  const balanceOutBIAfter = await getBalance(
    env.client,
    toToken,
    env.user.address,
  )
  const balanceOutBI =
    toToken instanceof Token
      ? balanceOutBIAfter - balanceOutBIBefore
      : balanceOutBIAfter -
        balanceOutBIBefore +
        receipt.effectiveGasPrice * receipt.gasUsed +
        transferValue
  expect(balanceOutBI >= rpParams.amountOutMin).equal(true)

  const balanceUser2After = await env.client.getBalance({
    address: env.user2.address,
  })
  const transferredValue = balanceUser2After - balanceUser2Before
  expect(transferredValue === transferValue).equal(true)

  return [balanceOutBI, receipt.blockNumber, 0]
}

async function checkTransferValueInput(
  env: TestEnvironment,
  fromToken: Type,
  toToken: Type,
  lastCallResult: bigint | [bigint | undefined, bigint, number],
  usedPools: Set<string>,
): Promise<[bigint | undefined, bigint, number]> {
  const [amountIn, waitBlock] =
    typeof lastCallResult === 'bigint' ? [lastCallResult, 1n] : lastCallResult
  if (amountIn === undefined) return [undefined, waitBlock, 0] // previous swap failed
  await dataUpdated(env, waitBlock)

  if (fromToken instanceof Token) {
    await tokenContract(env.client, fromToken).write.approve(
      [env.rp.address, amountIn],
      { chain: null, account: env.user.address },
    )
  }

  let pcMap: Map<string, PoolCode>
  if (UPDATE_POOL_STATES) {
    await env.dataFetcher.fetchPoolsForToken(fromToken, toToken)
    pcMap = env.dataFetcher.getCurrentPoolCodeMap(fromToken, toToken)
  } else {
    pcMap = new Map()
    Array.from(env.poolCodes.entries()).forEach((e) => {
      if (!usedPools.has(e[1].pool.address)) pcMap.set(e[0], e[1])
    })
  }

  const transferValue = getBigInt(Number(amountIn) * 0.01) // let's take 1% of input
  const route = Router.findBestRoute(
    pcMap,
    env.chainId,
    fromToken,
    amountIn - transferValue,
    toToken,
    30e9,
  )
  const rpParams = Router.routeProcessor5Params(
    pcMap,
    route,
    fromToken,
    toToken,
    env.user.address,
    env.rp.address,
  )

  const balanceUser2Before = await getBalance(
    env.client,
    fromToken,
    env.user2.address,
  )

  const balanceOutBIBefore = await getBalance(
    env.client,
    toToken,
    env.user.address,
  )
  const tx = await env.client.writeContract({
    ...env.rp,
    chain: null,
    functionName: 'processRouteWithTransferValueInput',
    args: [
      env.user2.address,
      transferValue,
      rpParams.tokenIn,
      rpParams.amountIn,
      rpParams.tokenOut,
      rpParams.amountOutMin,
      rpParams.to,
      rpParams.routeCode,
    ],
    account: env.user.address,
    value:
      rpParams.value === undefined ? undefined : rpParams.value + transferValue,
  })
  const receipt = await env.client.waitForTransactionReceipt({ hash: tx })

  if (!UPDATE_POOL_STATES) {
    route.legs.forEach((l) => {
      if (!(pcMap.get(l.uniqueId) instanceof NativeWrapBridgePoolCode)) {
        usedPools.add(l.poolAddress)
      }
    })
  }

  const balanceOutBIAfter = await getBalance(
    env.client,
    toToken,
    env.user.address,
  )
  const balanceOutBI =
    toToken instanceof Token
      ? balanceOutBIAfter - balanceOutBIBefore
      : balanceOutBIAfter -
        balanceOutBIBefore +
        receipt.effectiveGasPrice * receipt.gasUsed //+transferValue
  expect(balanceOutBI >= rpParams.amountOutMin).equal(true)
  const balanceUser2After = await getBalance(
    env.client,
    fromToken,
    env.user2.address,
  )
  const transferredValue = balanceUser2After - balanceUser2Before
  expect(transferredValue).equal(transferValue)

  return [balanceOutBIAfter, receipt.blockNumber, 0]
}

async function checkTransferValueOutput(
  env: TestEnvironment,
  fromToken: Type,
  toToken: Type,
  lastCallResult: bigint | [bigint | undefined, bigint, number],
  usedPools: Set<string>,
): Promise<[bigint | undefined, bigint, number]> {
  const [amountIn, waitBlock] =
    typeof lastCallResult === 'bigint' ? [lastCallResult, 1n] : lastCallResult
  if (amountIn === undefined) return [undefined, waitBlock, 0] // previous swap failed
  await dataUpdated(env, waitBlock)

  if (fromToken instanceof Token) {
    await tokenContract(env.client, fromToken).write.approve(
      [env.rp.address, amountIn],
      { chain: null, account: env.user.address },
    )
  }

  let pcMap: Map<string, PoolCode>
  if (UPDATE_POOL_STATES) {
    await env.dataFetcher.fetchPoolsForToken(fromToken, toToken)
    pcMap = env.dataFetcher.getCurrentPoolCodeMap(fromToken, toToken)
  } else {
    pcMap = new Map()
    Array.from(env.poolCodes.entries()).forEach((e) => {
      if (!usedPools.has(e[1].pool.address)) pcMap.set(e[0], e[1])
    })
  }

  const route = Router.findBestRoute(
    pcMap,
    env.chainId,
    fromToken,
    amountIn,
    toToken,
    30e9,
  )
  const rpParams = Router.routeProcessor5Params(
    pcMap,
    route,
    fromToken,
    toToken,
    env.rp.address, // !!!!!!!!!!!!!!!!!!!!! 'to' = rp
    env.rp.address,
  )
  const transferValue = getBigInt(route.amountOut * 0.01) // let's take 1% of input

  const balanceUser2Before = await getBalance(
    env.client,
    toToken,
    env.user2.address,
  )

  const balanceOutBIBefore = await getBalance(
    env.client,
    toToken,
    env.user.address,
  )
  const tx = await env.client.writeContract({
    ...env.rp,
    chain: null,
    functionName: 'processRouteWithTransferValueOutput',
    args: [
      env.user2.address,
      transferValue,
      rpParams.tokenIn,
      rpParams.amountIn,
      rpParams.tokenOut,
      rpParams.amountOutMin,
      env.user.address, // !!!!!!!!!!!!!!!!!!!!! 'to' != rpParams.to
      rpParams.routeCode,
    ],
    account: env.user.address,
    value: rpParams.value,
  })
  const receipt = await env.client.waitForTransactionReceipt({ hash: tx })

  if (!UPDATE_POOL_STATES) {
    route.legs.forEach((l) => {
      if (!(pcMap.get(l.uniqueId) instanceof NativeWrapBridgePoolCode)) {
        usedPools.add(l.poolAddress)
      }
    })
  }

  const balanceOutBIAfter = await getBalance(
    env.client,
    toToken,
    env.user.address,
  )
  const balanceOutBI =
    toToken instanceof Token
      ? balanceOutBIAfter - balanceOutBIBefore
      : balanceOutBIAfter -
        balanceOutBIBefore +
        receipt.effectiveGasPrice * receipt.gasUsed //+transferValue
  expect(balanceOutBI >= rpParams.amountOutMin - transferValue).equal(true)
  const balanceUser2After = await getBalance(
    env.client,
    toToken,
    env.user2.address,
  )
  const transferredValue = balanceUser2After - balanceUser2Before
  expect(transferredValue).equal(transferValue)

  return [balanceOutBIAfter, receipt.blockNumber, 0]
}

// skipped because took too long time. Unskip to check the RP
describe('End-to-end RouteProcessor5 test', async () => {
  let env: TestEnvironment
  let chainId: ChainId
  let intermidiateResult: [bigint | undefined, bigint, number] = [
    undefined,
    1n,
    0,
  ]
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
      // MKR[chainId as keyof typeof MKR_ADDRESS],
      // YFI[chainId as keyof typeof YFI_ADDRESS],
      // CRV[chainId as keyof typeof CRV_ADDRESS],
      // SNX[chainId as keyof typeof SNX_ADDRESS],
      // GNO[chainId as keyof typeof GNO_ADDRESS],
      // LDO[chainId as keyof typeof LDO_ADDRESS],
      // APE[chainId as keyof typeof APE_ADDRESS],
      // FEI[chainId as keyof typeof FEI_ADDRESS],
      WBTC[chainId as keyof typeof WBTC_ADDRESS],
      // UNI[chainId as keyof typeof UNI_ADDRESS],
      // BUSD[chainId as keyof typeof BUSD_ADDRESS],
      // AAVE[chainId as keyof typeof AAVE_ADDRESS],
      // COMP[chainId as keyof typeof COMP_ADDRESS],
      // LUSD[chainId as keyof typeof LUSD_ADDRESS],
      MIM[chainId as keyof typeof MIM_ADDRESS],
      LINK[chainId as keyof typeof LINK_ADDRESS],
    ]
  })

  if (network.config.chainId === 137) {
    // permit in FRAX is implemented only for POLYGON
    it('Permit: Native => FRAX => Native', async () => {
      await env.snapshot.restore()
      const usedPools = new Set<string>()
      const token = FRAX[chainId as keyof typeof FRAX_ADDRESS]
      const amountIn = BigInt('999999999999999983222784') // BigInt(1e6 * 1e18) - copied over the value from the unrefactored test
      intermidiateResult[0] = amountIn
      intermidiateResult = await updMakeSwap(
        env,
        Native.onChain(chainId),
        token,
        intermidiateResult,
        usedPools,
      )
      const permit = await makePermit(
        env,
        token,
        intermidiateResult[0] as bigint,
      )
      intermidiateResult = await updMakeSwap(
        env,
        token,
        Native.onChain(chainId),
        intermidiateResult,
        usedPools,
        undefined,
        undefined,
        [permit],
      )
    })
  }

  it('Native => SUSHI => Native', async () => {
    await env.snapshot.restore()
    const usedPools = new Set<string>()
    intermidiateResult[0] = BigInt(1e6) * BigInt(1e18)
    intermidiateResult = await updMakeSwap(
      env,
      Native.onChain(chainId),
      SUSHI_LOCAL,
      intermidiateResult,
      usedPools,
    )
    intermidiateResult = await updMakeSwap(
      env,
      SUSHI_LOCAL,
      Native.onChain(chainId),
      intermidiateResult,
      usedPools,
    )
  })

  it('Native => WrappedNative => Native', async () => {
    await env.snapshot.restore()
    const usedPools = new Set<string>()
    intermidiateResult[0] = BigInt(1e18)
    intermidiateResult = await updMakeSwap(
      env,
      Native.onChain(chainId),
      WNATIVE[chainId],
      intermidiateResult,
      usedPools,
    )
    intermidiateResult = await updMakeSwap(
      env,
      WNATIVE[chainId],
      Native.onChain(chainId),
      intermidiateResult,
      usedPools,
    )
  })


  it('Swap with not 0 liquidity on ythe router. Native => USDC => USDT', async () => {
    await env.snapshot.restore()
    const usedPools = new Set<string>()

    // transfer some native to RP
    await env.client.call({
      account: env.user,
      to: env.rp.address,
      value: getBigInt(1e18),
    })

    intermidiateResult[0] = BigInt(1e4) * BigInt(1e18)
    intermidiateResult = await updMakeSwap(
      env,
      Native.onChain(chainId),
      USDC[chainId as keyof typeof USDC_ADDRESS],
      intermidiateResult,
      usedPools,
    )

    // transfer some USDC to RP
    const RPAmount = (intermidiateResult[0] as bigint) / 10n
    expect(RPAmount).not.equal(0n)
    intermidiateResult[0] = (intermidiateResult[0] as bigint) - RPAmount
    await tokenContract(
      env.client,
      USDC[chainId as keyof typeof USDC_ADDRESS],
    ).write.transfer([env.rp.address, RPAmount], {
      chain: null,
      account: env.user.address,
    })

    intermidiateResult = await updMakeSwap(
      env,
      USDC[chainId as keyof typeof USDC_ADDRESS],
      USDT[chainId as keyof typeof USDT_ADDRESS],
      intermidiateResult,
      usedPools,
    )
  })

  if (network.config.chainId === 137) {
    // NoWay
    it.skip('StablePool Native => USDC => USDT => DAI => USDC (Polygon only)', async () => {
      const filter = (pool: RPool) =>
        pool instanceof StableSwapRPool || pool instanceof BridgeBento
      await env.snapshot.restore()
      const usedPools = new Set<string>()
      intermidiateResult[0] = BigInt(1e4) * BigInt(1e18)
      intermidiateResult = await updMakeSwap(
        env,
        Native.onChain(chainId),
        USDC[chainId as keyof typeof USDC_ADDRESS],
        intermidiateResult,
        usedPools,
      )
      intermidiateResult = await updMakeSwap(
        env,
        USDC[chainId as keyof typeof USDC_ADDRESS],
        USDT[chainId as keyof typeof USDT_ADDRESS],
        intermidiateResult,
        usedPools,
        undefined,
        filter,
      )
      intermidiateResult = await updMakeSwap(
        env,
        USDT[chainId as keyof typeof USDT_ADDRESS],
        DAI[chainId as keyof typeof DAI_ADDRESS],
        intermidiateResult,
        usedPools,
        undefined,
        filter,
      )
      intermidiateResult = await updMakeSwap(
        env,
        DAI[chainId as keyof typeof DAI_ADDRESS],
        USDC[chainId as keyof typeof USDC_ADDRESS],
        intermidiateResult,
        usedPools,
        undefined,
        filter,
      )
    })
  }

  if (process.env.ALCHEMY_ID) {
    it('V3 only,  Native => USDC => NATIVE', async () => {
      await env.snapshot.restore()
      const usedPools = new Set<string>()
      let amountAndBlock: [bigint | undefined, bigint, number] = [
        undefined,
        1n,
        0,
      ]
      const amountIn =
        chainId === ChainId.ETHEREUM ? 100 * 1e18 : 100_000 * 1e18
      amountAndBlock[0] = BigInt(amountIn) // should be partial
      amountAndBlock = await updMakeSwap(
        env,
        Native.onChain(chainId),
        USDC[chainId as keyof typeof USDC_ADDRESS],
        amountAndBlock,
        usedPools,
        [LiquidityProviders.UniswapV3, LiquidityProviders.SushiSwapV3],
      )
      amountAndBlock = await updMakeSwap(
        env,
        USDC[chainId as keyof typeof USDC_ADDRESS],
        Native.onChain(chainId),
        amountAndBlock,
        usedPools,
        [LiquidityProviders.UniswapV3, LiquidityProviders.SushiSwapV3],
      )
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

  it.skip('Random swap test', async () => {
    let routeCounter = 0
    for (let i = 0; i < 1000; ++i) {
      await env.snapshot.restore()
      const usedPools = new Set<string>()
      let currentToken = 0
      const rnd: () => number = seedrandom(`testSeed ${i}`) // random [0, 1)
      intermidiateResult[0] = getBigInt(getRandomExp(rnd, 1e15, 1e24))
      let routeLegs: RouteLeg[] = []
      for (;;) {
        const nextToken = getNextToken(rnd, currentToken)
        process.stdout.write(
          `Round # ${i + 1}, Total Route # ${++routeCounter}, ` +
            `pools: ${env.poolCodes.size - usedPools.size}/${
              env.poolCodes.size
            } ` +
            `${testTokensSet[currentToken]?.symbol} => ${testTokensSet[nextToken]?.symbol} ... `,
        )
        intermidiateResult = await updMakeSwap(
          env,
          testTokensSet[currentToken] as Type,
          testTokensSet[nextToken] as Type,
          intermidiateResult,
          usedPools,
          undefined,
          undefined,
          undefined,
          false, //throwAtNoWay
          (
            r: MultiRoute,
            slippage: number,
            env: { poolCodes: Map<string, PoolCode> },
          ) => {
            routeLegs = r.legs
            let minAmount = r.amountIn
            r.legs.forEach((l) => {
              minAmount = Math.min(
                l.assumedAmountOut,
                l.assumedAmountIn,
                minAmount,
              )
            })
            if (slippage !== 0)
              process.stdout.write(`Min route amount: ${minAmount} `)
            return slippageIsOkDefault(r, slippage, env)
          },
        )
        currentToken = nextToken
        if (
          currentToken === 0 ||
          intermidiateResult[0] === undefined ||
          intermidiateResult[0] <= 1000n
        ) {
          console.log('')
          break
        }
        console.log(`slippage: ${intermidiateResult[2]}%`)
        routeLegs.forEach((l) => {
          if (l.poolType === PoolType.Curve)
            console.log(
              'Curve',
              l.poolAddress,
              l.tokenFrom.symbol,
              '->',
              l.tokenTo.symbol,
            )
        })
      }
    }
  })

  it('Special Router', async () => {
    await env.snapshot.restore()

    let pcMap
    if (UPDATE_POOL_STATES) {
      await env.dataFetcher.fetchPoolsForToken(
        Native.onChain(chainId),
        SUSHI_LOCAL,
      )
      pcMap = env.dataFetcher.getCurrentPoolCodeMap(
        Native.onChain(chainId),
        SUSHI_LOCAL,
      )
    } else pcMap = env.poolCodes

    const route = Router.findSpecialRoute(
      pcMap,
      chainId,
      Native.onChain(chainId),
      BigInt(1e18),
      SUSHI_LOCAL,
      30e9,
    )
    expect(route).not.undefined
  })

  if (network.config.chainId === ChainId.POLYGON) {
    it('Transfer value and route 1', async () => {
      await env.snapshot.restore()
      const usedPools = new Set<string>()
      intermidiateResult[0] = BigInt(1e18)
      intermidiateResult = await checkTransferAndRoute(
        env,
        Native.onChain(chainId),
        SUSHI_LOCAL,
        intermidiateResult,
        usedPools,
      )
      intermidiateResult = await checkTransferAndRoute(
        env,
        SUSHI_LOCAL,
        USDC_LOCAL,
        intermidiateResult,
        usedPools,
      )
      intermidiateResult = await checkTransferAndRoute(
        env,
        USDC_LOCAL,
        Native.onChain(chainId),
        intermidiateResult,
        usedPools,
      )
    })

    it('Transfer value and route 2', async () => {
      await env.snapshot.restore()
      const usedPools = new Set<string>()
      intermidiateResult[0] = BigInt(1e18)
      intermidiateResult = await checkTransferAndRoute(
        env,
        Native.onChain(chainId),
        WNATIVE[chainId],
        intermidiateResult,
        usedPools,
      )
      intermidiateResult = await checkTransferAndRoute(
        env,
        WNATIVE[chainId],
        SUSHI_LOCAL,
        intermidiateResult,
        usedPools,
      )
      intermidiateResult = await checkTransferAndRoute(
        env,
        SUSHI_LOCAL,
        WNATIVE[chainId],
        intermidiateResult,
        usedPools,
      )
      intermidiateResult = await checkTransferAndRoute(
        env,
        WNATIVE[chainId],
        Native.onChain(chainId),
        intermidiateResult,
        usedPools,
      )
    })

    it('Transfer value and route 3 - check EOA', async () => {
      await env.snapshot.restore()
      const usedPools = new Set<string>()
      intermidiateResult[0] = BigInt(1e18)
      const user2Original = env.user2.address
      env.user2.address = '0x0000000000000000000000000000000000000001'
      intermidiateResult = await checkTransferAndRoute(
        env,
        Native.onChain(chainId),
        SUSHI_LOCAL,
        intermidiateResult,
        usedPools,
      )
      intermidiateResult = await checkTransferAndRoute(
        env,
        SUSHI_LOCAL,
        USDC_LOCAL,
        intermidiateResult,
        usedPools,
      )
      intermidiateResult = await checkTransferAndRoute(
        env,
        USDC_LOCAL,
        Native.onChain(chainId),
        intermidiateResult,
        usedPools,
      )
      env.user2.address = user2Original
    })

    it('Transfer value and route 4 - not payable address', async () => {
      await env.snapshot.restore()
      const usedPools = new Set<string>()
      intermidiateResult[0] = BigInt(1e18)
      const user2Original = env.user2.address
      env.user2.address = '0x597A9bc3b24C2A578CCb3aa2c2C62C39427c6a49'
      let throwed = false
      try {
        await checkTransferAndRoute(
          env,
          Native.onChain(chainId),
          SUSHI_LOCAL,
          intermidiateResult,
          usedPools,
        )
      } catch (_e) {
        throwed = true
      } finally {
        env.user2.address = user2Original
      }
      expect(
        throwed,
        'Transfer value to not payable address should fail',
      ).equal(true)
    })

    it('processRouteWithTransferValueInput Native => SUSHI => USDC => Native', async () => {
      await env.snapshot.restore()
      const usedPools = new Set<string>()
      intermidiateResult[0] = BigInt(1e18)
      intermidiateResult = await checkTransferValueInput(
        env,
        Native.onChain(chainId),
        SUSHI_LOCAL,
        intermidiateResult,
        usedPools,
      )
      intermidiateResult = await checkTransferValueInput(
        env,
        SUSHI_LOCAL,
        USDC_LOCAL,
        intermidiateResult,
        usedPools,
      )
      intermidiateResult = await checkTransferValueInput(
        env,
        USDC_LOCAL,
        Native.onChain(chainId),
        intermidiateResult,
        usedPools,
      )
    })

    it('processRouteWithTransferValueOutput Native => SUSHI => USDC => Native', async () => {
      await env.snapshot.restore()
      const usedPools = new Set<string>()
      intermidiateResult[0] = BigInt(1e18)
      intermidiateResult = await checkTransferValueOutput(
        env,
        Native.onChain(chainId),
        SUSHI_LOCAL,
        intermidiateResult,
        usedPools,
      )
      intermidiateResult = await checkTransferValueOutput(
        env,
        SUSHI_LOCAL,
        USDC_LOCAL,
        intermidiateResult,
        usedPools,
      )
      intermidiateResult = await checkTransferValueOutput(
        env,
        USDC_LOCAL,
        Native.onChain(chainId),
        intermidiateResult,
        usedPools,
      )
    })
  }

  if (network.config.chainId === 1) {
    it('Curve 3pool test using 2 pools from 3', async () => {
      await env.snapshot.restore()
      const usedPools = new Set<string>()
      intermidiateResult[0] = BigInt(1e5) * BigInt(1e18)
      intermidiateResult = await updMakeSwap(
        env,
        Native.onChain(chainId),
        USDT[chainId as keyof typeof USDT_ADDRESS],
        intermidiateResult,
        usedPools,
        [LiquidityProviders.CurveSwap, LiquidityProviders.SushiSwapV2],
      )
    })

    it('Curve pool 0xc5424b857f758e906013f3555dad202e4bdb4567: Native => sETH', async () => {
      await env.snapshot.restore()
      const usedPools = new Set<string>()
      intermidiateResult[0] = BigInt(1e3) * BigInt(1e18)
      intermidiateResult = await updMakeSwap(
        env,
        Native.onChain(chainId),
        sETH,
        intermidiateResult,
        usedPools,
        [LiquidityProviders.CurveSwap],
      )
    })

    it('Path token => ETH => token', async () => {
      await env.snapshot.restore()
      const amoutIn = BigInt(1e18)
      await setRouterPrimaryBalance(
        env.client,
        env.user.address,
        sETH.address as Address,
        amoutIn * 2n,
      )
      intermidiateResult[0] = amoutIn
      intermidiateResult = await updMakeSwap(
        env,
        sETH,
        USDC[ChainId.ETHEREUM],
        intermidiateResult,
        undefined,
        [LiquidityProviders.CurveSwap, LiquidityProviders.UniswapV2],
      )
    })

    it('Curve Native inside: sETH - Native - WETH', async () => {
      await env.snapshot.restore()
      const amoutIn = BigInt(1e18)
      await setRouterPrimaryBalance(
        env.client,
        env.user.address,
        sETH.address as Address,
        amoutIn * 2n,
      )
      intermidiateResult[0] = amoutIn
      intermidiateResult = await updMakeSwap(
        env,
        sETH,
        WNATIVE[chainId],
        intermidiateResult,
        undefined,
        [LiquidityProviders.CurveSwap],
      )
    })

    const amountInForTest: Record<Address, bigint> = {
      '0xfC636D819d1a98433402eC9dEC633d864014F28C': BigInt(1e24),
      '0x890f4e345B1dAED0367A877a1612f86A1f86985f': BigInt(1e22),
      // ???? 114 '0xC18cC39da8b11dA8c3541C598eE022258F9744da': BigInt(1e20),
    }

    const CURVE_POOLS_FOR_TEST = 20

    function sortDecrByParam<T>(arr: T[], param: (t: T) => number): T[] {
      let sortArr = arr.map((a) => [param(a), a]) as [number, T][]
      sortArr = sortArr.sort((a, b) => b[0] - a[0])
      return sortArr.map((s) => s[1])
    }

    function RToken2Type(t: RToken): Type {
      if (t.address && t.address.length === 42)
        return new Token({
          chainId: Number(t.chainId ?? 1),
          address: t.address,
          symbol: t.symbol,
          name: t.name,
          decimals: t.decimals,
        })
      else return Native.onChain(Number(t.chainId ?? 1))
    }

    it(`Most liquidable ${CURVE_POOLS_FOR_TEST} Curve pools`, async () => {
      const curvePools = Array.from(env.poolCodes.values())
        .map((p) => p.pool)
        .filter((p) => p.poolType() === PoolType.Curve)
      const pools = sortDecrByParam(curvePools, (p) =>
        Number(p.getReserve0() + p.getReserve1()),
      )
      for (let i = 0; i < CURVE_POOLS_FOR_TEST && i < pools.length; ++i) {
        const from = RToken2Type(pools[i].token0)
        const to = RToken2Type(pools[i].token1)
        console.log(i, from.symbol, '->', to.symbol, 'pool:', pools[i].address)
        await env.snapshot.restore()
        const amoutIn =
          amountInForTest[pools[i].address] ??
          BigInt(
            Math.min(1e18, Math.round(Number(pools[i].getReserve0()) / 10)),
          )
        if (from instanceof Token)
          await setRouterPrimaryBalance(
            env.client,
            env.user.address,
            from.address as Address,
            amoutIn * 2n,
          )
        intermidiateResult[0] = amoutIn
        intermidiateResult = await updMakeSwap(
          env,
          from,
          to,
          intermidiateResult,
          undefined,
          [LiquidityProviders.CurveSwap],
        )
      }
    })
  }
})
