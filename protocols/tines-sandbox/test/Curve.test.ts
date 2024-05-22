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
  getPoolRatio,
} from 'sushi'
import { erc20Abi } from 'sushi/abi'
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

import { TestConfig, getTestConfig } from '../src/getTestConfig.js'
import { setTokenBalance } from '../src/setTokenBalance.js'

const MulticoinPoolNumber = 10 // first pools in next array

const NON_FACTORY_POOLS: [Address, string, CurvePoolType, number?][] = [
  // Multitoken
  ['0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7', '3pool', CurvePoolType.TypeB],
  ['0xed279fdd11ca84beef15af5d39bb4d4bee23f0ca', 'lusd', CurvePoolType.TypeC],
  ['0xa5407eae9ba41422680e2e00537571bcc53efbfd', 'susd', CurvePoolType.TypeA],
  ['0xecd5e75afb02efa118af914515d6521aabd189f1', 'tusd', CurvePoolType.TypeC],
  ['0xd632f22692fac7611d2aa1c0d552930d43caed3b', 'frax', CurvePoolType.TypeC],
  ['0x43b4fdfd4ff969587185cdb6f0bd875c5fc83f8c', 'alusd', CurvePoolType.TypeC],
  // ['0x618788357d0ebd8a37e763adab3bc575d54c2c7d', 'rai', CurvePoolType.TypeC], TODO: fix it
  ['0x4807862aa8b2bf68830e4c8dc86d0e9a998e085a', 'busdv2', CurvePoolType.TypeC],
  [
    '0x4f062658eaaf2c1ccf8c8e36d6824cdf41167956',
    'qusd',
    CurvePoolType.TypeC,
    1e-3,
  ],
  // ['0xdebf20617708857ebe4f679508e7b7863a8a8eee', 'aave', CurvePoolType.TypeC], TODO: fix it
  ['0x5a6a4d54456819380173272a5e8e9b9904bdf41b', 'mim', CurvePoolType.TypeC],
  ['0x8474ddbe98f5aa3179b3b3f5942d724afcdec9f6', 'musd', CurvePoolType.TypeC],
  // ['0x52ea46506b9cc5ef470c5bf89f17dc28bb35d85c', 'usdt', CurvePoolType.TypeA], TODO: fix it
  // 2 coins
  ['0xdc24316b9ae028f1497c275eb9192a3ea0f67022', 'steth', CurvePoolType.TypeC],
  [
    '0x21e27a5e5513d6e65c4f830167390997aa84843a',
    'steth-ng',
    CurvePoolType.TypeC,
  ],
  [
    '0xdcef968d416a41cdac0ed8702fac8128a64241a2',
    'fraxusdc',
    CurvePoolType.TypeC,
  ],
  [
    '0x828b154032950c8ff7cf8085d841723db2696056',
    'stETH concentrated',
    CurvePoolType.TypeC,
  ],
  ['0xf253f83aca21aabd2a20553ae0bf7f65c755a07f', 'sbtc2', CurvePoolType.TypeC],
  ['0x9d0464996170c6b9e75eed71c68b99ddedf279e8', 'cvxCRV', CurvePoolType.TypeC],
  ['0x453d92c7d4263201c69aacfaf589ed14202d83a4', 'yCRV', CurvePoolType.TypeC],
  ['0xc5424b857f758e906013f3555dad202e4bdb4567', 'seth', CurvePoolType.TypeC],
  ['0x9848482da3ee3076165ce6497eda906e66bb85c5', 'pETH', CurvePoolType.TypeC],
  ['0xf7b55c3732ad8b2c2da7c24f30a69f55c54fb717', 'cdCRV', CurvePoolType.TypeC],
  ['0xc897b98272aa23714464ea2a0bd5180f1b8c0025', 'msETH', CurvePoolType.TypeC],
  ['0xa1f8a6807c402e4a15ef4eba36528a3fed24e577', 'frxETH', CurvePoolType.TypeC],
  ['0x0ce6a5ff5217e38315f87032cf90686c96627caa', 'EURS', CurvePoolType.TypeC],
  [
    '0xa96a65c051bf88b4095ee1f2451c2a9d43f53ae2',
    'ankrETH',
    CurvePoolType.TypeC,
  ],
  [
    '0xeb16ae0052ed37f479f7fe63849198df1765a733',
    'saave',
    CurvePoolType.TypeC,
    1e-4,
  ],
  ['0xf9440930043eb3997fc70e1339dbb11f341de7a8', 'reth', CurvePoolType.TypeC],
  [
    '0xa2b47e3d5c44877cca798226b7b8118f9bfb7a56',
    'compound',
    CurvePoolType.TypeA,
    1e-7,
  ],
  ['0xfd5db7463a3ab53fd211b4af195c5bccc1a03890', 'eurt', CurvePoolType.TypeC],
  ['0xf178c0b5bb7e7abf4e12a4838c7b7c5ba2c623c0', 'link', CurvePoolType.TypeC],
  ['0x4ca9b3063ec5866a4b82e437059d2c43d1be596f', 'hbtc', CurvePoolType.TypeB],
  ['0x93054188d876f558f4a66b2ef1d97d16edf0895b', 'ren', CurvePoolType.TypeA],
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

// Pools we don't support - by any reason
const POOLS_WE_DONT_SUPPORT = {
  '0x707EAe1CcFee0B8fef07D3F18EAFD1246762d587':
    'STBT token - exclusively designed for accredited investors https://stbt.matrixdock.com/',
  '0x064841157BadDcB2704cA38901D7d754a59b80E8':
    'MBTC token(0xcfc013B416bE0Bd4b3bEdE35659423B796f8Dcf0) has been paused',
  '0x2B26239f52420d11420bC0982571BFE091417A7d':
    'Swap Unknown error, low liquidity',
  '0x439bfaE666826a7cB73663E366c12f03d0A13B49':
    'Swap Unknown error, low liquidity',
  '0x1F71f05CF491595652378Fe94B7820344A551B8E':
    'Swap Unknown error, low liquidity',
  '0x8461A004b50d321CB22B7d034969cE6803911899':
    'Swap Unknown error, low liquidity',
  '0xDa5B670CcD418a187a3066674A8002Adc9356Ad1':
    'Swap Unknown error, low liquidity',
  '0x8818a9bb44Fbf33502bE7c15c500d0C783B73067':
    'Swap Unknown error, low liquidity',
  '0x3F1B0278A9ee595635B61817630cC19DE792f506':
    'Swap Unknown error, low liquidity',
  '0xD6Ac1CB9019137a896343Da59dDE6d097F710538':
    'Swap Unknown error, low liquidity',
  '0x9c2C8910F113181783c249d8F6Aa41b51Cde0f0c':
    'Swap Unknown error, low liquidity',
  '0xc8a7C1c4B748970F57cA59326BcD49F5c9dc43E3':
    'Swap Unknown error, low liquidity',
  '0xf03bD3cfE85f00bF5819AC20f0870cE8a8d1F0D8':
    'Swap Unknown error, low liquidity',
  '0x910A00594DC16dD699D579A8F7811d465Dfa2752':
    'UNKNOWN ERROR: token 1 transfer simulation failed',
  '0x961226B64AD373275130234145b96D100Dc0b655':
    'Swap Unknown error, low liquidity',
  '0xe7E4366f6ED6aFd23e88154C00B532BDc0352333':
    'Swap Unknown error, low liquidity',
  '0x8c524635d52bd7b1Bd55E062303177a7d916C046': 'Swap error',
  '0xD652c40fBb3f06d6B58Cb9aa9CFF063eE63d465D':
    'Swap Unknown error, low liquidity',
} as const

const FACTORY_POOL_PRECISION_SPECIAL: Record<Address, number> = {
  '0x5a59fd6018186471727faaeae4e57890abc49b08': 1e-8,
}

const CURVE_POOL_SPECIAL_PRECISION: Record<string, number> = {
  '0x5a59fd6018186471727faaeae4e57890abc49b08': 1e-8,
  '0x4f062658eaaf2c1ccf8c8e36d6824cdf41167956': 1e-3,
  '0xeb16ae0052ed37f479f7fe63849198df1765a733': 1e-4,
  '0xa2b47e3d5c44877cca798226b7b8118f9bfb7a56': 1e-7,
}

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
  tokenContracts: (Contract<typeof erc20Abi> | undefined)[]
  poolTines: (CurvePool | CurveMultitokenPool | undefined)[][]
  currentFlow: number[][][]
  user: Address
  snapshot: SnapshotRestorer
}

async function checkPool(
  config: TestConfig,
  poolAddress: Address,
  poolType: CurvePoolType,
  minBalance = 1_000_000n,
): Promise<string> {
  const poolContract = {
    address: poolAddress,
    abi: curvePoolABI[poolType],
  }
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
    } else {
      const balance = await readContract(config.client, {
        ...poolContract,
        functionName: 'balances',
        args: [BigInt(i)],
      })
      if (balance < minBalance)
        return `token ${token}(${i}) low balance (${balance})`
      try {
        const res = await simulateContract(config.client, {
          address: token,
          abi: erc20Abi,
          functionName: 'transfer',
          args: [config.user.address, minBalance],
          account: poolAddress,
        })
        if (!res.result)
          return `token ${token}(${i}) transfer simulation failed`
      } catch (e) {
        if (
          e.toString().includes('function "transfer" returned no data ("0x")')
        )
          continue
        return `token ${token}(${i}) transfer simulation failed`
      }
    }
  }
  return 'check passed'
}

async function createCurvePoolInfo(
  config: TestConfig,
  poolAddress: Address,
  poolType: CurvePoolType,
  initialBalance: bigint,
): Promise<PoolInfo> {
  const poolContract = {
    address: poolAddress,
    abi: curvePoolABI[poolType],
  }

  const tokenContracts: Array<Contract<typeof erc20Abi> | undefined> = []
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
        name: token,
        symbol: 'ETH',
        chainId: 1,
        decimals: 18,
      })
    } else {
      const res = await setTokenBalance(
        token,
        config.user.address,
        initialBalance,
      )
      //console.log(token, res)
      expect(res).equal(true, `Wrong setTokenBalance for ${token}`)

      const tokenContract = {
        address: token,
        abi: erc20Abi,
      }
      try {
        await (config.client as WalletClient).writeContract({
          ...tokenContract,
          account: config.user.address,
          functionName: 'approve',
          args: [poolAddress, initialBalance],
          chain: null,
        })
      } catch (e) {
        // in try block because crv token (0xD533a949740bb3306d119CC777fa900bA034cd52) doesn't allow re-approve (((
        console.log(`Failed to approve token ${tokenContract.address}: ${e}`)
      }
      tokenContracts.push(tokenContract)

      const decimals = await readContract(config.client, {
        ...tokenContract,
        functionName: 'decimals',
      })
      const symbol = await readContract(config.client, {
        ...tokenContract,
        functionName: 'symbol',
      })
      tokenTines.push({
        address: token,
        name: token,
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

  if (tokenContracts.length === 2) {
    const poolTines = new CurvePool(
      poolAddress,
      tokenTines[0],
      tokenTines[1],
      Number(fee) / 1e10,
      Number(A),
      reserves[0],
      reserves[1],
      await getPoolRatio(config.client as PublicClient, poolAddress, poolType),
    )

    const snapshot = await takeSnapshot()
    return {
      poolType,
      poolContract,
      tokenContracts,
      poolTines: [[undefined, poolTines]],
      currentFlow: [[], [[0, 0]]],
      user: config.user.address,
      snapshot,
    }
  } else {
    const pools = createCurvePoolsForMultipool(
      poolAddress,
      tokenTines,
      Number(fee) / 1e10,
      Number(A),
      reserves,
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
      functionName: 'balanceOf',
      args: [poolInfo.user],
    })
  }

  const realOutBI = balanceAfter - balanceBefore
  return realOutBI
}

async function forEachFactoryPool(
  config: TestConfig,
  func: (address: Address, factoryName: string) => Promise<void>,
) {
  const processedPoolSet = new Set<string>()
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
    console.log(`Factory ${factoryAddress} total pools: ${poolNum}`)
    for (let i = 0n; i < poolNum; ++i) {
      const poolAddress = await readContract(config.client, {
        ...factoryContract,
        functionName: 'pool_list',
        args: [i],
      })
      if (processedPoolSet.has(poolAddress)) continue
      processedPoolSet.add(poolAddress)
      //const coins = await factoryContract.get_n_coins(poolAddress)
      await func(poolAddress, `#${f}`)
    }
  }
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

async function checkMultipleSwapsFork(
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
): Promise<{ passed: boolean; reason: string }> {
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
      POOL_TEST_AMOUNT_SPECIAL[poolAddress] ?? BigInt(1e30),
    )
  } catch (_e) {
    return { passed: false, reason: 'pool init error' }
  }

  // in multitokrn pols if one sub-pool is not routable then all are not routable
  const checkedPool = poolInfo.poolTines[0][1]
  const check2 = curvePoolFilter(checkedPool)
  if (!check2.routable)
    return { passed: true, reason: `skipped: ${check2.reason}` }

  const precision =
    CURVE_POOL_SPECIAL_PRECISION[poolAddress.toLowerCase()] ?? 1e-7

  const [result] = await processMultiTokenPool(
    config,
    poolAddress,
    poolType,
    precision,
    poolInfo,
  )
  return { passed: result === 'passed', reason: result }

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

// 0x707EAe1CcFee0B8fef07D3F18EAFD1246762d587: pool init error
//     1) 54/534 0x707EAe1CcFee0B8fef07D3F18EAFD1246762d587 (fact#0)
describe('Real Curve pools consistency check', function () {
  let config: TestConfig

  before(async () => {
    console.log('    Environment initialization ... ')
    config = await getTestConfig()
    console.log('    Finding pools ... ')
    const pools = await collectAllCurvePools(config)
    console.log('    Pools found:', pools.length)

    const start = 0
    const finish = pools.length + 1
    let skippedPoolCounter = 0
    pools.forEach((p, i) => {
      if (i + 1 < start || i + 1 >= finish) return
      this.addTest(
        it(`${i + 1}/${pools.length} ${p[0]} (${p[1]})`, async () => {
          const res = await checkCurvePool(config, p[0])
          if (res.reason !== 'passed') console.log(`${p[0]}: ${res.reason}`)
          if (res.passed && res.reason !== 'passed') ++skippedPoolCounter
          expect(res.passed).equal(true)
        }),
      )
      console.log('Skipped pools:', skippedPoolCounter)
    })
  })

  it('empty', () => {}) // just to start 'before' block

  describe.skip('Not-Factory pools by whitelist', () => {
    for (let i = 0; i < NON_FACTORY_POOLS.length; ++i) {
      const [poolAddress, name, poolType, precision = 1e-9] =
        NON_FACTORY_POOLS[i]
      it(`${name} (${poolAddress}, ${poolType})`, async () => {
        const [result] = await processMultiTokenPool(
          config,
          poolAddress,
          poolType,
          precision,
        )
        expect(result).equal('passed')
      })
    }
  })

  describe.skip('Not-Factory pools by whitelist with >2 tokens - multiple swap test', () => {
    const poolNumber = MulticoinPoolNumber
    for (let i = 0; i < poolNumber; ++i) {
      const [poolAddress, name, poolType, precision = 1e-7] =
        NON_FACTORY_POOLS[i]
      it(`${name} (${poolAddress}, ${poolType})`, async () => {
        const result = await checkMultipleSwapsFork(
          config,
          poolAddress,
          poolType,
          precision,
        )
        expect(result).equal('passed')
      })
    }
  })

  it.skip(`Factory Pools (${FACTORY_ADDRESSES.length} factories)`, async () => {
    let passed = 0
    let i = 0
    const startFrom = 0
    const finishAt = 1000
    await forEachFactoryPool(
      config,
      async (poolAddress: Address, factoryName: string) => {
        if (++i < startFrom) return
        if (i > finishAt) return
        process.stdout.write(
          `Factory ${factoryName} pool ${i} ${poolAddress} ... `,
        )

        const check = await checkPool(config, poolAddress, CurvePoolType.TypeC)
        if (check !== 'check passed') {
          if (check.includes('low balance')) console.log(`skipped: ${check}`)
          else if (POOLS_WE_DONT_SUPPORT[poolAddress] !== undefined)
            console.log(`skipped: ${POOLS_WE_DONT_SUPPORT[poolAddress]}`)
          else console.log('UNKNOWN ERROR:', check)
          return
        }
        if (POOLS_WE_DONT_SUPPORT[poolAddress] !== undefined) {
          console.log(`skipped: ${POOLS_WE_DONT_SUPPORT[poolAddress]}`)
          return
        }

        const precision =
          FACTORY_POOL_PRECISION_SPECIAL[poolAddress.toLowerCase()] || 1e9
        const [result, poolType] = await processMultiTokenPool(
          config,
          poolAddress,
          CurvePoolType.TypeC,
          precision,
        )
        if (poolType !== undefined) {
          const tokens = new Set<string>()
          poolType.poolTines.forEach((p) => {
            p.forEach((t) => {
              if (t !== undefined) {
                tokens.add(
                  `${Math.round(Number(t.reserve0) / 10 ** t.token0.decimals)}${
                    t.token0.symbol
                  }`,
                )
                tokens.add(
                  `${Math.round(Number(t.reserve1) / 10 ** t.token1.decimals)}${
                    t.token1.symbol
                  }`,
                )
              }
            })
          })
          process.stdout.write(`${Array.from(tokens.values())} `)
        }
        console.log(result)
        if (result === 'passed') ++passed
      },
    )
    console.log('passed', passed)
  })
})
