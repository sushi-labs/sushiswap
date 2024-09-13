import {
  SnapshotRestorer,
  takeSnapshot,
} from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import seedrandom from 'seedrandom'
import {
  CurvePoolType,
  curvePoolABI,
  curvePoolFilter,
  curvePoolFilterByAddress,
  detectCurvePoolType,
  gatherPoolsFromCurveAPI,
  getPoolRatio,
} from 'sushi'
import {
  CurveMultitokenPool,
  CurvePool,
  RPool,
  RToken,
  createCurvePoolsForMultipool,
  getBigInt,
} from 'sushi/tines'
import { type Contract } from 'sushi/types'
import { Address, PublicClient, WalletClient, parseAbi } from 'viem'
import { readContract, simulateContract } from 'viem/actions'

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  erc20Abi_approve,
  erc20Abi_balanceOf,
  erc20Abi_decimals,
  erc20Abi_name,
  erc20Abi_symbol,
} from 'sushi/abi'
import { PoolReporter } from '../src/PoolReporter.js'
import { TestConfig, getTestConfig } from '../src/getTestConfig.js'
import { setTokenBalance } from '../src/setTokenBalance.js'

const NON_FACTORY_POOLS: [Address, string][] = [
  // Multitoken
  ['0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7', '3pool'],
  ['0xed279fdd11ca84beef15af5d39bb4d4bee23f0ca', 'lusd'],
  ['0xa5407eae9ba41422680e2e00537571bcc53efbfd', 'susd'],
  ['0xecd5e75afb02efa118af914515d6521aabd189f1', 'tusd'],
  ['0xd632f22692fac7611d2aa1c0d552930d43caed3b', 'frax'],
  ['0x43b4fdfd4ff969587185cdb6f0bd875c5fc83f8c', 'alusd'],
  ['0x618788357d0ebd8a37e763adab3bc575d54c2c7d', 'rai'], //TODO: fix it
  ['0x4807862aa8b2bf68830e4c8dc86d0e9a998e085a', 'busdv2'],
  ['0x4f062658eaaf2c1ccf8c8e36d6824cdf41167956', 'qusd'],
  ['0xdebf20617708857ebe4f679508e7b7863a8a8eee', 'aave'], // TODO: fix it
  ['0x5a6a4d54456819380173272a5e8e9b9904bdf41b', 'mim'],
  ['0x8474ddbe98f5aa3179b3b3f5942d724afcdec9f6', 'musd'],
  ['0x52ea46506b9cc5ef470c5bf89f17dc28bb35d85c', 'usdt'], // TODO: fix it
  // 2 coins
  ['0xdc24316b9ae028f1497c275eb9192a3ea0f67022', 'steth'],
  ['0x21e27a5e5513d6e65c4f830167390997aa84843a', 'steth-ng'],
  ['0xdcef968d416a41cdac0ed8702fac8128a64241a2', 'fraxusdc'],
  ['0x828b154032950c8ff7cf8085d841723db2696056', 'stETH concentrated'],
  ['0xf253f83aca21aabd2a20553ae0bf7f65c755a07f', 'sbtc2'],
  ['0x9d0464996170c6b9e75eed71c68b99ddedf279e8', 'cvxCRV'],
  ['0x453d92c7d4263201c69aacfaf589ed14202d83a4', 'yCRV'],
  ['0xc5424b857f758e906013f3555dad202e4bdb4567', 'seth'],
  ['0x9848482da3ee3076165ce6497eda906e66bb85c5', 'pETH'],
  ['0xf7b55c3732ad8b2c2da7c24f30a69f55c54fb717', 'cdCRV'],
  ['0xc897b98272aa23714464ea2a0bd5180f1b8c0025', 'msETH'],
  ['0xa1f8a6807c402e4a15ef4eba36528a3fed24e577', 'frxETH'],
  ['0x0ce6a5ff5217e38315f87032cf90686c96627caa', 'EURS'],
  ['0xa96a65c051bf88b4095ee1f2451c2a9d43f53ae2', 'ankrETH'],
  ['0xeb16ae0052ed37f479f7fe63849198df1765a733', 'saave'],
  ['0xf9440930043eb3997fc70e1339dbb11f341de7a8', 'reth'],
  ['0xa2b47e3d5c44877cca798226b7b8118f9bfb7a56', 'compound'],
  ['0xfd5db7463a3ab53fd211b4af195c5bccc1a03890', 'eurt'],
  ['0xf178c0b5bb7e7abf4e12a4838c7b7c5ba2c623c0', 'link'],
  ['0x4ca9b3063ec5866a4b82e437059d2c43d1be596f', 'hbtc'],
  ['0x93054188d876f558f4a66b2ef1d97d16edf0895b', 'ren'],
]

const FACTORY_ADDRESSES = [
  '0x4F8846Ae9380B90d2E71D5e3D042dff3E7ebb40d', // crvUSD
  '0x0959158b6040d32d04c301a72cbfd6b39e21c9ae', // 3Crv
  '0xb9fc157394af804a3578134a6585c0dc9cc990d4', //
  //'0xf18056bbd320e96a48e3fbf8bc061322531aac99', for crypto2 pools only
] as const

const POOL_TEST_AMOUNT_SPECIAL = {
  '0x87650D7bbfC3A9F10587d7778206671719d9910D': 1e40,
}

const CURVE_POOL_SPECIAL_PRECISION: Record<string, number> = {
  '0x5a59fd6018186471727faaeae4e57890abc49b08': 1e-8,
  '0x4f062658eaaf2c1ccf8c8e36d6824cdf41167956': 1e-3, // ??????
  '0xeb16ae0052ed37f479f7fe63849198df1765a733': 1e-4,
  '0xa2b47e3d5c44877cca798226b7b8118f9bfb7a56': 1e-7,
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const poolReporter = new PoolReporter(__dirname)

export function getRandomExp(rnd: () => number, min: number, max: number) {
  const minL = Math.log(min)
  const maxL = Math.log(max)
  const v = rnd() * (maxL - minL) + minL
  const res = Math.exp(v)
  console.assert(res <= max && res >= min, 'Random value is out of the range')
  return res
}

function closeValues(
  _a: number | bigint,
  _b: number | bigint,
  accuracy: number,
): boolean {
  const a = Number(_a)
  const b = Number(_b)
  if (accuracy === 0) return a === b
  if (Math.abs(a) < 10 / accuracy) return Math.abs(a - b) <= 10
  if (Math.abs(b) < 10 / accuracy) return Math.abs(a - b) <= 10
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
    expect(res).equal(true)
  }
  return res
}

interface PoolInfo {
  poolType: CurvePoolType
  poolContract: Contract<any>
  tokenContracts: Array<{ address: Address } | undefined>
  poolTines: (CurvePool | CurveMultitokenPool | undefined)[][]
  currentFlow: number[][][]
  user: Address
  snapshot: SnapshotRestorer
}

async function createCurvePoolInfo(
  config: TestConfig,
  poolAddress: Address,
  poolType: CurvePoolType,
  initialBalance?: bigint,
): Promise<PoolInfo> {
  const poolContract = {
    address: poolAddress,
    abi: curvePoolABI[poolType],
  }

  const tokenContracts: Array<{ address: Address } | undefined> = []
  const tokenTines: RToken[] = []
  for (let i = 0n; i < 100n; ++i) {
    let token: Address
    try {
      token = await readContract(config.client, {
        ...poolContract,
        functionName: 'coins',
        args: [i],
      })
    } catch (_e) {
      break
    }
    if (token === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
      // native
      tokenContracts.push(undefined)
      tokenTines.push({
        address: token,
        name: 'ETH',
        symbol: 'ETH',
        chainId: 1,
        decimals: 18,
      })
    } else {
      const tokenContract = {
        address: token,
      }

      if (initialBalance !== undefined) {
        const res = await setTokenBalance(
          token,
          config.user.address,
          initialBalance,
        )
        //console.log(token, res)
        expect(res).equal(true, `Wrong setTokenBalance for ${token}`)

        try {
          await (config.client as WalletClient).writeContract({
            address: token,
            abi: erc20Abi_approve,
            account: config.user.address,
            functionName: 'approve',
            args: [poolAddress, initialBalance],
            chain: null,
          })
        } catch (_e) {
          // in try block because some tokens 0xD533a949740bb3306d119CC777fa900bA034cd52
          // or 0x43b4FdFD4Ff969587185cDB6f0BD875c5Fc83f8c doesn't allow re-approve (((
          //console.log(`Failed to approve token ${tokenContract.address}: ${e}`)
        }
      }
      tokenContracts.push(tokenContract)

      const decimals = await readContract(config.client, {
        address: token,
        abi: erc20Abi_decimals,
        functionName: 'decimals',
      })
      const symbol = await readContract(config.client, {
        address: token,
        abi: erc20Abi_symbol,
        functionName: 'symbol',
      })
      const name = await readContract(config.client, {
        address: token,
        abi: erc20Abi_name,
        functionName: 'name',
      })
      tokenTines.push({
        address: token,
        name,
        symbol,
        chainId: 1,
        decimals,
      })
    }
  }

  const A = await readContract(config.client, {
    ...poolContract,
    functionName: 'A',
  })
  const fee = await readContract(config.client, {
    ...poolContract,
    functionName: 'fee',
  })
  const reserves = await Promise.all(
    tokenContracts.map((_, i) =>
      readContract(config.client, {
        ...poolContract,
        functionName: 'balances',
        args: [BigInt(i)],
      }),
    ),
  )

  const pools = createCurvePoolsForMultipool(
    poolAddress,
    tokenTines,
    Number(fee) / 1e10,
    Number(A),
    reserves,
    await getPoolRatio(
      config.client as PublicClient,
      poolAddress,
      tokenTines.map((t) => t.address as Address),
    ),
  )
  const poolTines: (CurvePool | CurveMultitokenPool | undefined)[][] = []
  const currentFlow: number[][][] = []
  let n = 0
  for (let i = 0; i < tokenContracts.length; ++i) {
    poolTines[i] = []
    currentFlow[i] = []
    for (let j = i + 1; j < tokenContracts.length; ++j) {
      poolTines[i][j] = pools[n++]
      currentFlow[i][j] = [0, 0]
    }
  }
  console.assert(n === pools.length)

  const snapshot = await takeSnapshot()

  return {
    poolType,
    poolContract,
    tokenContracts,
    poolTines,
    currentFlow,
    user: config.user.address,
    snapshot,
  }
}

async function prepareTokens(
  config: TestConfig,
  poolInfo: PoolInfo,
  poolAddress: Address,
  initialBalance: bigint,
) {
  const tokens = poolInfo.tokenContracts.map((c) => c?.address)
  for (let i = 0; i < tokens.length; ++i) {
    const token = tokens[i]
    if (token === undefined) continue // native

    try {
      const res = await setTokenBalance(
        token,
        config.user.address,
        initialBalance,
      )
      //console.log(token, res)
      expect(res).equal(true, `Wrong setTokenBalance for ${token}`)
    } catch (_e) {
      throw new Error(`token ${token} setTokenBalance failed`)
    }

    try {
      await (config.client as WalletClient).writeContract({
        address: token,
        abi: erc20Abi_approve,
        account: config.user.address,
        functionName: 'approve',
        args: [poolAddress, initialBalance],
        chain: null,
      })
    } catch (_e) {
      // in try block because some tokens 0xD533a949740bb3306d119CC777fa900bA034cd52
      // or 0x43b4FdFD4Ff969587185cDB6f0BD875c5Fc83f8c doesn't allow re-approve (((
      //console.log(`Failed to approve token ${tokenContract.address}: ${e}`)
    }
  }
  poolInfo.snapshot = await takeSnapshot()
}

async function checkSwap(
  config: TestConfig,
  poolInfo: PoolInfo,
  from: number,
  to: number,
  amountIn: number,
  precision: number,
) {
  const i = Math.min(from, to)
  const j = Math.max(from, to)
  const expectedOut = (poolInfo.poolTines[i][j] as CurvePool).calcOutByIn(
    Math.round(amountIn),
    from < to,
  )
  let realOutBI: bigint
  if (
    poolInfo.poolType !== CurvePoolType.TypeA &&
    poolInfo.poolType !== CurvePoolType.TypeB
  ) {
    realOutBI = (
      await simulateContract(config.client, {
        ...poolInfo.poolContract,
        functionName: 'exchange',
        args: [BigInt(from), BigInt(to), getBigInt(amountIn), 0n],
        value:
          poolInfo.tokenContracts[from] === undefined
            ? getBigInt(amountIn)
            : 0n,
      })
    ).result as unknown as bigint
  } else {
    poolInfo.snapshot.restore()

    let balanceBefore = 0n
    const tokenContractTo = poolInfo.tokenContracts[to]
    if (tokenContractTo !== undefined) {
      balanceBefore = await readContract(config.client, {
        ...tokenContractTo,
        abi: erc20Abi_balanceOf,
        functionName: 'balanceOf',
        args: [poolInfo.user],
      })
    }
    await (config.client as WalletClient).writeContract({
      ...poolInfo.poolContract,
      account: poolInfo.user,
      functionName: 'exchange',
      args: [BigInt(from), BigInt(to), getBigInt(amountIn), 0n],
      chain: null,
      value:
        poolInfo.tokenContracts[from] === undefined ? getBigInt(amountIn) : 0n,
    })

    let balanceAfter = 0n
    if (tokenContractTo !== undefined) {
      balanceAfter = await readContract(config.client, {
        ...tokenContractTo,
        abi: erc20Abi_balanceOf,
        functionName: 'balanceOf',
        args: [poolInfo.user],
      })
    }

    realOutBI = balanceAfter - balanceBefore
  }

  expectCloseValues(realOutBI, expectedOut.out, precision)
}

// Makes real swap in the fork and checks consistency
async function makeSwap(
  config: TestConfig,
  poolInfo: PoolInfo,
  from: number,
  to: number,
  amountIn: number,
) {
  let balanceBefore = 0n
  const tokenContractTo = poolInfo.tokenContracts[to]
  if (tokenContractTo !== undefined) {
    balanceBefore = await readContract(config.client, {
      ...tokenContractTo,
      abi: erc20Abi_balanceOf,
      functionName: 'balanceOf',
      args: [poolInfo.user],
    })
  }
  await (config.client as WalletClient).writeContract({
    ...poolInfo.poolContract,
    account: poolInfo.user,
    functionName: 'exchange',
    args: [BigInt(from), BigInt(to), getBigInt(amountIn), 0n],
    chain: null,
    value:
      poolInfo.tokenContracts[from] === undefined ? getBigInt(amountIn) : 0n,
  })

  let balanceAfter = 0n
  if (tokenContractTo !== undefined) {
    balanceAfter = await readContract(config.client, {
      ...tokenContractTo,
      abi: erc20Abi_balanceOf,
      functionName: 'balanceOf',
      args: [poolInfo.user],
    })
  }

  const realOutBI = balanceAfter - balanceBefore
  return realOutBI
}

async function processMultiTokenPool(
  config: TestConfig,
  poolAddress: Address,
  poolType: CurvePoolType,
  precision: number,
  poolInfo?: PoolInfo,
): Promise<[string, PoolInfo | undefined]> {
  const testSeed = poolAddress
  const rnd: () => number = seedrandom(testSeed) // random [0, 1)
  try {
    if (poolInfo === undefined) {
      poolInfo = await createCurvePoolInfo(
        config,
        poolAddress,
        poolType,
        POOL_TEST_AMOUNT_SPECIAL[poolAddress] ?? BigInt(1e30),
      )
    }
  } catch (_e) {
    // return 'skipped (pool init error)'
  }
  if (!poolInfo || poolInfo.tokenContracts.length < 2)
    return ['skipped (pool init error)', undefined]

  const n = poolInfo.tokenContracts.length
  for (let i = 0; i < n; ++i)
    for (let j = i + 1; j < n; ++j) {
      const res0 = parseInt(
        (poolInfo.poolTines[i][j] as RPool).reserve0.toString(),
      )
      const res1 = parseInt(
        (poolInfo.poolTines[i][j] as RPool).reserve1.toString(),
      )
      if (res0 < 1e6 || res1 < 1e6)
        return ['skipped (low liquidity)', undefined]
      const checks =
        poolType === CurvePoolType.TypeA || poolType === CurvePoolType.TypeB
          ? 3
          : 10
      for (let k = 0; k < checks; ++k) {
        const amountInPortion = getRandomExp(rnd, 1e-5, 1)
        try {
          await checkSwap(
            config,
            poolInfo,
            i,
            j,
            res0 * amountInPortion,
            precision,
          )
          await checkSwap(
            config,
            poolInfo,
            j,
            i,
            res1 * amountInPortion,
            precision,
          )
        } catch (e) {
          return [`skipped (swap error) ${e}`, poolInfo]
        }
      }
    }
  return ['passed', poolInfo]
}

function getRandomPair(rnd: () => number, num: number): [number, number] {
  const i = Math.floor(rnd() * num)
  let j = Math.floor(rnd() * (num - 1))
  if (j >= i) ++j
  return [i, j]
}

// is not used currently because multitoken tests should be re-made in absolutely other way
export async function checkMultipleSwapsFork(
  config: TestConfig,
  poolAddress: Address,
  poolType: CurvePoolType,
  precision: number,
  poolInfo?: PoolInfo,
): Promise<string> {
  const testSeed = poolAddress
  const rnd: () => number = seedrandom(testSeed) // random [0, 1)
  if (!poolInfo) {
    try {
      poolInfo = await createCurvePoolInfo(
        config,
        poolAddress,
        poolType,
        POOL_TEST_AMOUNT_SPECIAL[poolAddress] ?? BigInt(1e30),
      )
    } catch (_e) {
      // return 'skipped (pool init error)'
    }
  }
  if (!poolInfo || poolInfo.tokenContracts.length < 2)
    return 'skipped (pool init error)'

  const n = poolInfo.tokenContracts.length
  const steps = 100

  const flowInternal: number[][][] = []
  for (let i = 0; i < n; ++i) {
    flowInternal[i] = []
    for (let j = i + 1; j < n; ++j) flowInternal[i][j] = [0, 0]
  }
  function addFlowInp(from: number, to: number, val?: number): number {
    const flow = flowInternal[Math.min(from, to)][Math.max(from, to)]
    flow[from < to ? 0 : 1] += val ?? 0
    return flow[from < to ? 0 : 1]
  }
  function addFlowOut(from: number, to: number, val?: number): number {
    const flow = flowInternal[Math.min(from, to)][Math.max(from, to)]
    flow[from < to ? 1 : 0] += val ?? 0
    return flow[from < to ? 1 : 0]
  }

  for (let s = 0; s < steps; ++s) {
    const [from, to] = getRandomPair(rnd, n)
    const pool = poolInfo.poolTines[Math.min(from, to)][
      Math.max(from, to)
    ] as RPool
    const res0 = Number(pool.reserve0)
    const res1 = Number(pool.reserve1)
    if (res0 < 1e6 || res1 < 1e6) return 'skipped (low liquidity)'

    const amountIn = (from < to ? res0 : res1) * getRandomExp(rnd, 1e-6, 1e-3)
    const expectedOut =
      pool.calcOutByIn(Math.round(amountIn) + addFlowInp(from, to), from < to)
        .out + addFlowOut(from, to)
    const expectedIn =
      pool.calcInByOut(
        Math.round(expectedOut) - addFlowOut(from, to),
        from < to,
      ).inp - addFlowInp(from, to)
    expectCloseValues(amountIn, expectedIn, precision)

    if (from < to)
      pool.setCurrentFlow(
        addFlowInp(from, to, amountIn),
        addFlowOut(from, to, -expectedOut),
        0,
      )
    else
      pool.setCurrentFlow(
        addFlowOut(from, to, -expectedOut),
        addFlowInp(from, to, amountIn),
        0,
      )
  }

  for (let i = 0; i < n; ++i)
    for (let j = i + 1; j < n; ++j) poolInfo.poolTines[i][j]?.cleanTmpData()
  poolInfo.snapshot.restore()

  for (let i = 0; i < n; ++i) {
    for (let j = i + 1; j < n; ++j) {
      const direction = addFlowInp(i, j) >= 0
      const [inp, outPrimary] = direction /// !!!!! outPrimary - надо проверять на соответствие !!!
        ? [addFlowInp(i, j), -addFlowOut(i, j)]
        : [addFlowOut(i, j), -addFlowInp(i, j)]
      if (inp === 0) continue
      const expectedOut = poolInfo.poolTines[i][j]?.calcOutByInReal(
        inp,
        direction,
      ) as number
      const realOut = await makeSwap(
        config,
        poolInfo,
        direction ? i : j,
        direction ? j : i,
        inp,
      )
      console.log(
        `${direction ? i : j}->${
          direction ? j : i
        } inp=${inp} expectedOut=${expectedOut} realOut=${realOut} precisionOut=${
          Number(realOut) / expectedOut
        }`,
      )
      expectCloseValues(expectedOut, realOut, precision)
      expectCloseValues(expectedOut, outPrimary, 1e-4)
    }
  }
  return 'passed'
}

// universal check: processMultiTokenPool for all pools + checkMultipleSwapsFork for pools
// with more than 2 tokens
// returns: result if passed or expectation throws an error
async function checkCurvePool(
  config: TestConfig,
  poolAddress: Address,
): Promise<{ passed: boolean; reason: string; poolInfo?: PoolInfo }> {
  const check1 = curvePoolFilterByAddress(poolAddress)
  if (!check1.routable)
    return { passed: true, reason: `skipped: ${check1.reason}` }

  const poolType = await detectCurvePoolType(
    config.client as PublicClient,
    poolAddress,
  )

  let poolInfo
  try {
    poolInfo = await createCurvePoolInfo(
      config,
      poolAddress,
      poolType,
      //POOL_TEST_AMOUNT_SPECIAL[poolAddress] ?? BigInt(1e30),
    )
  } catch (_e) {
    return { passed: false, reason: 'pool init error' }
  }

  // in multitoken pools if one sub-pool is not routable then all are not routable
  const checkedPool = poolInfo.poolTines[0][1]
  const check2 = curvePoolFilter(checkedPool)
  if (!check2.routable)
    return { passed: true, reason: `skipped: ${check2.reason}`, poolInfo }

  try {
    await prepareTokens(
      config,
      poolInfo,
      poolAddress,
      POOL_TEST_AMOUNT_SPECIAL[poolAddress] ?? BigInt(1e30),
    )
  } catch (e) {
    return { passed: false, reason: e.message }
  }

  const precision =
    CURVE_POOL_SPECIAL_PRECISION[poolAddress.toLowerCase()] ?? 1e-7

  const [result] = await processMultiTokenPool(
    config,
    poolAddress,
    poolType,
    precision,
    poolInfo,
  )
  return { passed: result === 'passed', reason: result, poolInfo }

  // commented out because we need a new multitoken pool check
  // const tokenNumber = poolInfo?.tokenContracts.length
  // if (tokenNumber !== undefined && tokenNumber > 2) {
  //   const result = await checkMultipleSwapsFork(
  //     config,
  //     poolAddress,
  //     poolType,
  //     precision,
  //     poolInfo,
  //   )
  //   if (result !== 'passed') return result
  // }
}

// returns all pool addresses.
// not-factory from NON_FACTORY_POOLS array +
// factory pools for all factories from FACTORY_ADDRESSES array
async function collectAllCurvePools(
  config: TestConfig,
): Promise<[Address, string][]> {
  const res: [Address, string][] = []
  const processedPoolSet = new Set<string>()

  NON_FACTORY_POOLS.forEach((p) => {
    if (processedPoolSet.has(p[0])) return
    processedPoolSet.add(p[0])
    res.push([p[0], p[1]])
  })

  for (let f = 0; f < FACTORY_ADDRESSES.length; ++f) {
    const factoryAddress = FACTORY_ADDRESSES[f]
    const factoryContract = {
      address: factoryAddress,
      abi: parseAbi([
        'function pool_count() pure returns (uint256)',
        'function pool_list(uint256) pure returns (address)',
        'function get_n_coins(address) pure returns (uint256)',
      ]),
    }

    const poolNum = await readContract(config.client, {
      ...factoryContract,
      functionName: 'pool_count',
    })
    for (let i = 0n; i < poolNum; ++i) {
      const poolAddress = await readContract(config.client, {
        ...factoryContract,
        functionName: 'pool_list',
        args: [i],
      })
      if (processedPoolSet.has(poolAddress)) continue
      processedPoolSet.add(poolAddress)
      res.push([poolAddress, `fact#${f + 1}`])
    }
  }

  return res
}

describe('Real Curve pools consistency check (from whitelist)', function () {
  let config: TestConfig

  before(async () => {
    console.log('    Environment initialization ... ')
    config = await getTestConfig()
    console.log('    Finding pools ... ')
    const pools = await collectAllCurvePools(config)
    console.log('    Pools found:', pools.length)

    const start = 0
    const finish = pools.length + 1
    pools.forEach((p, i) => {
      if (i + 1 < start || i + 1 >= finish) return
      this.addTest(
        it(`${i + 1}/${pools.length} ${p[0]} (${p[1]})`, async () => {
          const res = await checkCurvePool(config, p[0])
          if (res.reason !== 'passed') console.log(`${p[0]}: ${res.reason}`)
          expect(res.passed).equal(true)
        }),
      )
    })
  })

  it('empty', () => {}) // just to start 'before' block
})

const CurvePoolListNames = [
  'main', // all not-factory pools, including 3pool
  //'crypto', // all not-factory crypro pools
  'factory', // pools of factories 0x0959158b6040d32d04c301a72cbfd6b39e21c9ae(3CRV) and 0xb9fc157394af804a3578134a6585c0dc9cc990d4 (EUR)
  'factory-crvusd', // pools for factory 0x4F8846Ae9380B90d2E71D5e3D042dff3E7ebb40d (crvUSD)
  //'factory-eywa',   // legacy - 0 pools
  //'factory-crypto',
  //'factory-tricrypto',
  // 'factory-stable-ng',   // stable pools new generation
]

describe('Real Curve pools consistency check (from CurveAPI)', function () {
  let config: TestConfig

  before(async () => {
    console.log('    Environment initialization ... ')
    config = await getTestConfig()
    console.log('    Finding pools ... ')
    const pools = (
      await gatherPoolsFromCurveAPI(
        CurvePoolListNames,
        'https://api.curve.fi/api/getPools/ethereum',
      )
    ).map((p) => [p.address, `api:${p.poolList}`] as [Address, string])
    console.log('    Pools found:', pools.length)

    const start = 0
    const finish = pools.length + 1
    pools.forEach((p, i) => {
      if (i + 1 < start || i + 1 >= finish) return
      this.addTest(
        it(`${i + 1}/${pools.length} ${p[0]} (${p[1]})`, async () => {
          const res = await checkCurvePool(config, p[0])
          const tokMap = new Map<string, RToken>()
          res.poolInfo?.poolTines
            .flat()
            .flat()
            .forEach((p) => {
              if (p !== undefined) {
                tokMap.set(p.token0.address, p.token0)
                tokMap.set(p.token1.address, p.token1)
              }
            })
          await poolReporter.reportPoolTest(
            p[0],
            p[1],
            res.passed && !res.reason.startsWith('skipped'),
            res.reason,
            res.poolInfo?.poolType,
            res.poolInfo?.tokenContracts.map(
              (tc) =>
                tokMap.get(
                  tc?.address ?? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
                ) as RToken,
            ),
          )
          if (res.reason !== 'passed') console.log(`${p[0]}: ${res.reason}`)
          expect(res.passed).equal(true)
        }),
      )
    })
  })

  it('empty', () => {}) // just to start 'before' block
})
