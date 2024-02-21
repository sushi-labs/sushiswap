// 1) Create a fork with RP of needed version
// 2) launch Extractor in fork
// 3) take all it's pools
// 4) For each pool
//    - setTokenBalance - both tokens
//    - approve - both tokens
//    - make route
//    - test routing output prediction

import {
  CurveConfig,
  Extractor,
  FactoryV2,
  FactoryV3,
  LogFilterType,
} from '@sushiswap/extractor'
import { PoolCode, Router } from '@sushiswap/router'
import { BASES_TO_CHECK_TRADES_AGAINST } from '@sushiswap/router-config'
import { CurveMultitokenPool, RToken, getBigInt } from '@sushiswap/tines'
import { expect } from 'chai'
import { EthereumProvider } from 'hardhat/types'
import seedrandom from 'seedrandom'
import { erc20Abi } from 'sushi/abi'
import { ChainId } from 'sushi/chain'
import { Token } from 'sushi/currency'
import {
  Address,
  WalletClient,
  createPublicClient,
  custom,
  parseAbi,
  walletActions,
} from 'viem'
import { PublicClient } from 'viem'
import { hardhat } from 'viem/chains'
import { createHardhatProvider, setTokenBalance, takeSnapshotEnv } from '../src'

function closeValues(
  _a: number | bigint,
  _b: number | bigint,
  accuracy: number,
): boolean {
  const a = Number(_a)
  const b = Number(_b)
  if (accuracy === 0) return a === b
  if (Math.abs(a) < 1 / accuracy) return Math.abs(a - b) <= 10
  if (Math.abs(b) < 1 / accuracy) return Math.abs(a - b) <= 10
  return Math.abs(a / b - 1) < accuracy
}

function expectCloseValues(
  _a: number | bigint,
  _b: number | bigint,
  accuracy: number,
  logInfoIfFalse = '',
) {
  const res = closeValues(_a, _b, accuracy)
  if (!res) {
    console.log(`Expected close: ${_a}, ${_b}, ${accuracy} ${logInfoIfFalse}`)
    // debugger
    // expect(res).equal(true)
  }
  return res
}

export function getRandomExp(rnd: () => number, min: number, max: number) {
  const minL = Math.log(min)
  const maxL = Math.log(max)
  const v = rnd() * (maxL - minL) + minL
  const res = Math.exp(v)
  console.assert(res <= max && res >= min, 'Random value is out of the range')
  return res
}

const DEFAULT_BALANCE = 1_000_000_000n
async function prepareToken(
  client: PublicClient & WalletClient,
  provider: EthereumProvider,
  token: RToken,
  user: Address,
  approveTo: Address,
): Promise<bigint> {
  // const balance = await client.readContract({
  //   abi: erc20Abi,
  //   address: token.address as Address,
  //   functionName: 'balanceOf',
  //   args: [user],
  // })
  // if (balance > 0) return balance

  const initBalance = DEFAULT_BALANCE * 10n ** BigInt(token.decimals)
  if (isNative(token.address)) return initBalance

  const res = await setTokenBalance(
    token.address,
    user,
    initBalance,
    client,
    provider,
  )
  expect(res).equal(
    true,
    `Wrong setTokenBalance for ${token.symbol} (${token.address})`,
  )

  try {
    await client.writeContract({
      address: token.address as Address,
      abi: erc20Abi,
      account: user,
      functionName: 'approve',
      args: [approveTo, initBalance],
      chain: null,
    })
  } catch (e) {
    if (token.address !== '0xdAC17F958D2ee523a2206206994597C13D831ec7')
      // ok for USDT
      console.error(`Failed to approve token ${token.address}: ${e}`)
  }

  return initBalance
}

function isNative(addr: string) {
  return addr.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
}

async function getBalance(
  client: PublicClient,
  token: Address,
  user: Address,
): Promise<bigint> {
  if (isNative(token)) return await client.getBalance({ address: user })
  return await client.readContract({
    abi: erc20Abi,
    address: token,
    functionName: 'balanceOf',
    args: [user],
  })
}

// Makes real swap in the fork and checks consistency
async function makeSwap(
  client: PublicClient & WalletClient,
  provider: EthereumProvider,
  user: Address,
  pool: Address,
  tokens: [Address, Address], // [from, to]
  indexes: [number, number], // [from, to]
  amountIn: bigint,
) {
  const snapshot = await takeSnapshotEnv(provider)
  const balanceBefore = await getBalance(client, tokens[1], user)

  await client.writeContract({
    address: pool,
    abi: parseAbi([
      'function exchange(int128 i, int128 j, uint256 dx, uint256 min_dy) payable returns ()',
    ]),
    account: user,
    functionName: 'exchange',
    args: [BigInt(indexes[0]), BigInt(indexes[1]), amountIn, 0n],
    chain: null,
    value: isNative(tokens[0]) ? amountIn : 0n,
  })

  const balanceAfter = await getBalance(client, tokens[1], user)
  snapshot.restore()

  const realOutBI = balanceAfter - balanceBefore
  return realOutBI
}

async function checkPool(
  client: PublicClient & WalletClient,
  provider: EthereumProvider,
  user: Address,
  chainId: ChainId,
  pool: PoolCode,
  amountIn: bigint,
  direction: boolean,
) {
  const poolMap = new Map([[pool.pool.address, pool]])
  const token0 = pool.pool.token0 as Token /*isNative(pool.pool.token0.address)
    ? Native.onChain(chainId)   // TODO: is it correct ?????????????????
    : (pool.pool.token0 as Token)*/
  const token1 = pool.pool.token1 as Token /*isNative(pool.pool.token1.address)
    ? Native.onChain(chainId)
    : (pool.pool.token1 as Token)*/
  const route = Router.findBestRoute(
    poolMap,
    chainId,
    direction ? token0 : token1,
    amountIn,
    direction ? token1 : token0,
    30e9,
  )
  //console.log(route, pool.pool.token0)
  const expectedOut = route.amountOutBI

  const tokens = direction
    ? [pool.pool.token0.address, pool.pool.token1.address]
    : [pool.pool.token1.address, pool.pool.token0.address]
  let indexes = direction ? [0, 1] : [1, 0]
  if (pool.pool instanceof CurveMultitokenPool) {
    indexes = direction
      ? [pool.pool.index0, pool.pool.index1]
      : [pool.pool.index1, pool.pool.index0]
  }
  const realOut = await makeSwap(
    client,
    provider,
    user,
    pool.pool.address,
    tokens as [Address, Address],
    indexes as [number, number],
    amountIn,
  )
  //console.log('qq', tokens, indexes, amountIn, realOut)
  expectCloseValues(realOut, expectedOut, 1e-7)
}

async function allPoolsTest(args: {
  providerURL: string
  blockNumber: number
  chainId: ChainId
  factoriesV2: FactoryV2[]
  factoriesV3: FactoryV3[]
  curveConfig?: CurveConfig
  tickHelperContract: Address
  cacheDir: string
  logDepth: number
  logType?: LogFilterType
  logging?: boolean
  maxCallsInOneBatch?: number
  account?: Address
  checkTokens?: Token[]
  startFromPool?: number
}) {
  const forkProvider = await createHardhatProvider(
    args.chainId,
    args.providerURL,
    args.blockNumber,
  )
  const client = createPublicClient({
    chain: {
      ...hardhat,
      contracts: {
        multicall3: {
          address: '0xca11bde05977b3631167028862be2a173976ca11',
          blockCreated: 100,
        },
      },
      id: args.chainId,
    },
    transport: custom(forkProvider),
  }).extend(walletActions)
  const [user] = await client.getAddresses()

  const extractor = new Extractor({ ...args, client })
  await extractor.start(BASES_TO_CHECK_TRADES_AGAINST[args.chainId])

  const pools = extractor.getCurrentPoolCodes()
  for (let i = args.startFromPool ?? 0; i < pools.length; ++i) {
    const pool = pools[i].pool
    process.stdout.write(`${i + 1}/${pools.length} Pool ${pool.address} ... `)
    const testSeed = pool.address
    const rnd: () => number = seedrandom(testSeed) // random [0, 1)

    const amount0 = await prepareToken(
      client,
      forkProvider,
      pool.token0,
      user,
      pool.address,
    )
    // console.log('amount0', amount0, pool.token0.address, user, pool.address)
    const amountInPortion0 = getRandomExp(rnd, 1e-5, 0.5)
    const amountIn0 = getBigInt(amountInPortion0 * Number(pool.getReserve0()))
    expect(Number(amountIn0)).lessThan(Number(amount0))
    await checkPool(
      client,
      forkProvider,
      user,
      args.chainId,
      pools[i],
      amountIn0,
      true,
    )

    const amount1 = await prepareToken(
      client,
      forkProvider,
      pool.token1,
      user,
      pool.address,
    )
    const amountInPortion1 = getRandomExp(rnd, 1e-5, 0.5)
    const amountIn1 = getBigInt(amountInPortion1 * Number(pool.getReserve1()))
    expect(Number(amountIn1)).lessThan(Number(amount1))
    await checkPool(
      client,
      forkProvider,
      user,
      args.chainId,
      pools[i],
      amountIn1,
      false,
    )

    console.log('ok')
  }
}

it.only('Extractor Ethereum allPoolsTest test (Curve only)', async () => {
  await allPoolsTest({
    providerURL: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`,
    blockNumber: 19138000,
    chainId: ChainId.ETHEREUM,
    factoriesV2: [],
    factoriesV3: [],
    curveConfig: {
      api: 'https://api.curve.fi/api/getPools/ethereum',
      minPoolLiquidityLimitUSD: 10_000,
      poolBlackList: [
        '0x80466c64868E1ab14a1Ddf27A676C3fcBE638Fe5', // crypto pool in main list :(
        '0xDeBF20617708857ebe4F679508E7b7863a8A8EeE', // TODO: fix it !!!
        '0xA96A65c051bF88B4095Ee1f2451C2A9d43F53Ae2', // TODO: fix it !!!
        '0x79a8C46DeA5aDa233ABaFFD40F3A0A2B1e5A4F27', // TODO: fix it !!!
        '0x2dded6Da1BF5DBdF597C45fcFaa3194e53EcfeAF', // TODO: fix it !!!
        '0x06364f10B501e868329afBc005b3492902d6C763', // TODO: fix it !!!
        '0x52EA46506B9CC5Ef470C5bf89f17Dc28bB35D85C', // TODO: fix it !!!
        '0xC18cC39da8b11dA8c3541C598eE022258F9744da', // Wrong setTokenBalance for RSV (0x196f4727526eA7FB1e17b2071B3d8eAA38486988)
        '0xF9440930043eb3997fc70e1339dBb11F341de7A8', // TODO: fix it !!!
        '0x618788357D0EBd8A37e763ADab3bc575D54c2C7d', // TODO: fix it !!!
        '0xBfAb6FA95E0091ed66058ad493189D2cB29385E6', // TODO: fix it !!!
        '0x8461A004b50d321CB22B7d034969cE6803911899', // Wrong setTokenBalance for sKRW (0x269895a3dF4D73b077Fc823dD6dA1B95f72Aaf9B)
        '0xa1F8A6807c402E4A15ef4EBa36528A3FED24E577', // Expected close: 3285358155081594300, 3285468191978248192
        '0x87650D7bbfC3A9F10587d7778206671719d9910D', // Transaction reverted without a reason string
        '0x8818a9bb44Fbf33502bE7c15c500d0C783B73067', // Wrong setTokenBalance for sJPY (0xF6b1C627e95BFc3c1b4c9B825a032Ff0fBf3e07d)
        '0x3F1B0278A9ee595635B61817630cC19DE792f506', // Wrong setTokenBalance for sAUD (0xF48e200EAF9906362BB1442fca31e0835773b8B4)
        '0xD6Ac1CB9019137a896343Da59dDE6d097F710538', // Wrong setTokenBalance for sGBP (0x97fe22E7341a0Cd8Db6F6C021A24Dc8f4DAD855F)
        '0x9c2C8910F113181783c249d8F6Aa41b51Cde0f0c', // Wrong setTokenBalance for sCHF (0x0F83287FF768D1c1e17a42F44d644D7F22e8ee1d)
        '0x8c524635d52bd7b1Bd55E062303177a7d916C046', // Transaction reverted without a reason string
        '0xD652c40fBb3f06d6B58Cb9aa9CFF063eE63d465D', // Transaction reverted without a reason string
        '0x63594B2011a0F2616586Bf3EeF8096d42272F916', // Wrong setTokenBalance for USDI (0x2A54bA2964C8Cd459Dc568853F79813a60761B58)
        '0x413928a25D6ea1A26F2625d633207755f67Bf97c', // Wrong setTokenBalance for EURe (0x3231Cb76718CDeF2155FC47b5286d82e6eDA273f)
      ],
    },
    tickHelperContract: '0x tickHelperContract is not needed for this test',
    cacheDir: './cache',
    logDepth: 50,
    logging: false,
    startFromPool: 69,
  })
})
