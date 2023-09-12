import { SnapshotRestorer, takeSnapshot } from '@nomicfoundation/hardhat-network-helpers'
import { erc20Abi } from '@sushiswap/abi'
import {
  createCurvePoolsForMultipool,
  CurveMultitokenPool,
  CurvePool,
  getBigInt,
  RPool,
  RToken,
} from '@sushiswap/tines'
import { Contract } from '@sushiswap/types'
import { expect } from 'chai'
import seedrandom from 'seedrandom'
import { Address, parseAbi, WalletClient } from 'viem'
import { readContract, simulateContract } from 'viem/actions'

import { getTestConfig, TestConfig } from '../src/getTestConfig'
import { setTokenBalance } from '../src/setTokenBalance'

enum CurvePoolType {
  Legacy = 'Legacy', // 'exchange(int128 i, int128 j, uint256 dx, uint256 min_dy) -> uint256'
  LegacyV2 = 'LegacyV2', // 'function coins(int128) pure returns (address)'
  LegacyV3 = 'LegacyV3',
  Factory = 'Factory',
}

const NON_FACTORY_POOLS: [Address, string, CurvePoolType, number?][] = [
  // Multitoken
  ['0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7', '3pool', CurvePoolType.LegacyV3],
  ['0xed279fdd11ca84beef15af5d39bb4d4bee23f0ca', 'lusd', CurvePoolType.Legacy],
  ['0xa5407eae9ba41422680e2e00537571bcc53efbfd', 'susd', CurvePoolType.LegacyV2],
  ['0xecd5e75afb02efa118af914515d6521aabd189f1', 'tusd', CurvePoolType.Legacy],
  ['0xd632f22692fac7611d2aa1c0d552930d43caed3b', 'frax', CurvePoolType.Legacy],
  ['0x43b4fdfd4ff969587185cdb6f0bd875c5fc83f8c', 'alusd', CurvePoolType.Legacy],
  // ['0x618788357d0ebd8a37e763adab3bc575d54c2c7d', 'rai', CurvePoolType.Legacy], TODO: fix it
  ['0x4807862aa8b2bf68830e4c8dc86d0e9a998e085a', 'busdv2', CurvePoolType.Legacy],
  ['0x4f062658eaaf2c1ccf8c8e36d6824cdf41167956', 'qusd', CurvePoolType.Legacy],
  ['0xdebf20617708857ebe4f679508e7b7863a8a8eee', 'aave', CurvePoolType.LegacyV2],
  ['0x5a6a4d54456819380173272a5e8e9b9904bdf41b', 'mim', CurvePoolType.Legacy],
  ['0x8474ddbe98f5aa3179b3b3f5942d724afcdec9f6', 'musd', CurvePoolType.Legacy],
  ['0x52ea46506b9cc5ef470c5bf89f17dc28bb35d85c', 'usdt', CurvePoolType.Legacy],
  // 2 coins
  ['0xdc24316b9ae028f1497c275eb9192a3ea0f67022', 'steth', CurvePoolType.Legacy],
  ['0xdcef968d416a41cdac0ed8702fac8128a64241a2', 'fraxusdc', CurvePoolType.Legacy],
  ['0x828b154032950c8ff7cf8085d841723db2696056', 'stETH concentrated', CurvePoolType.Factory],
  ['0xf253f83aca21aabd2a20553ae0bf7f65c755a07f', 'sbtc2', CurvePoolType.Legacy],
  ['0x9d0464996170c6b9e75eed71c68b99ddedf279e8', 'cvxCRV', CurvePoolType.Factory],
  ['0x453d92c7d4263201c69aacfaf589ed14202d83a4', 'yCRV', CurvePoolType.Factory],
  ['0xc5424b857f758e906013f3555dad202e4bdb4567', 'seth', CurvePoolType.Legacy],
  ['0x9848482da3ee3076165ce6497eda906e66bb85c5', 'pETH', CurvePoolType.Factory],
  ['0xf7b55c3732ad8b2c2da7c24f30a69f55c54fb717', 'cdCRV', CurvePoolType.Factory],
  ['0xc897b98272aa23714464ea2a0bd5180f1b8c0025', 'msETH', CurvePoolType.Factory],
  ['0xa1f8a6807c402e4a15ef4eba36528a3fed24e577', 'frxETH', CurvePoolType.Legacy],
  ['0x0ce6a5ff5217e38315f87032cf90686c96627caa', 'EURS', CurvePoolType.Legacy],
  ['0xa96a65c051bf88b4095ee1f2451c2a9d43f53ae2', 'ankrETH', CurvePoolType.Legacy],
  ['0xeb16ae0052ed37f479f7fe63849198df1765a733', 'saave', CurvePoolType.Legacy, 1e-4],
  ['0xf9440930043eb3997fc70e1339dbb11f341de7a8', 'reth', CurvePoolType.Legacy],
  ['0xa2b47e3d5c44877cca798226b7b8118f9bfb7a56', 'compound', CurvePoolType.LegacyV2, 1e-7],
  ['0xfd5db7463a3ab53fd211b4af195c5bccc1a03890', 'eurt', CurvePoolType.Legacy],
  ['0xf178c0b5bb7e7abf4e12a4838c7b7c5ba2c623c0', 'link', CurvePoolType.Legacy],
  ['0x4ca9b3063ec5866a4b82e437059d2c43d1be596f', 'hbtc', CurvePoolType.LegacyV3],
  ['0x93054188d876f558f4a66b2ef1d97d16edf0895b', 'ren', CurvePoolType.LegacyV2],
]

const FACTORY_ADDRESSES = [
  '0x0959158b6040d32d04c301a72cbfd6b39e21c9ae',
  '0xb9fc157394af804a3578134a6585c0dc9cc990d4',
  //'0xf18056bbd320e96a48e3fbf8bc061322531aac99', for crypto2 pools only
] as const

// We don't test these pools - problems with exchange function call
const FACTORY_POOL_EXCEPTIONS_LIST = [
  '0x2B26239f52420d11420bC0982571BFE091417A7d',
  '0x439bfaE666826a7cB73663E366c12f03d0A13B49',
  '0x87650D7bbfC3A9F10587d7778206671719d9910D',
  '0x961226B64AD373275130234145b96D100Dc0b655',
  '0xe7E4366f6ED6aFd23e88154C00B532BDc0352333',
  '0x8c524635d52bd7b1Bd55E062303177a7d916C046',
  '0xD652c40fBb3f06d6B58Cb9aa9CFF063eE63d465D',
  '0x28B0Cf1baFB707F2c6826d10caf6DD901a6540C5',
  '0x0AD66FeC8dB84F8A3365ADA04aB23ce607ac6E24',

  '0xc8a7C1c4B748970F57cA59326BcD49F5c9dc43E3',
  '0xf03bD3cfE85f00bF5819AC20f0870cE8a8d1F0D8',
] as const
const FACTORY_POOL_EXCEPTION_SET = new Set(FACTORY_POOL_EXCEPTIONS_LIST.map((p) => p.toLowerCase()))
const FACTORY_POOL_PRECISION_SPECIAL: Record<Address, number> = {
  //'0x6a274de3e2462c7614702474d64d376729831dca': 1e-3, //TODO!!!
  '0x5a59fd6018186471727faaeae4e57890abc49b08': 1e-8,
}

const METAPOOL_COIN_TO_BASEPOOL: Record<Address, Address> = {
  '0x6c3f90f043a72fa612cbac8115ee7e52bde6e490': '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7', // 3-pool
  '0x075b1bb99792c9e1041ba13afef80c91a1e70fb3': '0x7fC77b5c7614E1533320Ea6DDc2Eb61fa00A9714', // sBTC
  '0x3175df0976dfa876431c2e9ee6bc45b65d3473cc': '0xDcEF968d416a41Cdac0ED8702fAC8128A64241A2', // fraxUSD
  '0x051d7e5609917bd9b73f04bac0ded8dd46a74301': '0xf253f83AcA21aAbD2A20553AE0BF7F65C755A07F',
}

export function getRandomExp(rnd: () => number, min: number, max: number) {
  const minL = Math.log(min)
  const maxL = Math.log(max)
  const v = rnd() * (maxL - minL) + minL
  const res = Math.exp(v)
  console.assert(res <= max && res >= min, 'Random value is out of the range')
  return res
}

function closeValues(_a: number | bigint, _b: number | bigint, accuracy: number): boolean {
  const a = Number(_a)
  const b = Number(_b)
  if (accuracy === 0) return a === b
  if (Math.abs(a) < 1 / accuracy) return Math.abs(a - b) <= 10
  if (Math.abs(b) < 1 / accuracy) return Math.abs(a - b) <= 10
  return Math.abs(a / b - 1) < accuracy
}

function expectCloseValues(_a: number | bigint, _b: number | bigint, accuracy: number, logInfoIfFalse = '') {
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
  user: Address
  snapshot: SnapshotRestorer
}

async function getPoolRatio(config: TestConfig, poolAddress: Address, poolType: CurvePoolType): Promise<number> {
  const pool = {
    address: poolAddress,
    abi: parseAbi([
      poolType !== CurvePoolType.LegacyV2
        ? 'function coins(uint256) pure returns (address)'
        : 'function coins(int128) pure returns (address)',
    ]),
  }

  const token1Address = await readContract(config.client, {
    ...pool,
    functionName: 'coins',
    args: [1n],
  })

  const basePoolAddress = METAPOOL_COIN_TO_BASEPOOL[token1Address.toLowerCase()]
  if (basePoolAddress !== undefined) {
    const basePool = {
      address: basePoolAddress,
      abi: parseAbi(['function get_virtual_price() pure returns (uint256)']),
    }

    const price = await readContract(config.client, { ...basePool, functionName: 'get_virtual_price' })
    // 1e18 is not always appropriate, but there is no way to find self.rate_multiplier value
    return parseInt(price.toString()) / 1e18
  }

  // collection of freaks
  switch (poolAddress.toLowerCase()) {
    case '0xa96a65c051bf88b4095ee1f2451c2a9d43f53ae2': {
      //ankrETH pool
      const ankrETH = {
        address: '0xE95A203B1a91a908F9B9CE46459d101078c2c3cb' as const,
        abi: parseAbi(['function ratio() pure returns (uint256)']),
      }

      const ratio = await readContract(config.client, { ...ankrETH, functionName: 'ratio' })
      return 1e18 / parseInt(ratio.toString())
    }
    case '0xf9440930043eb3997fc70e1339dbb11f341de7a8': {
      // rETH pool
      const rETH = {
        address: '0x9559aaa82d9649c7a7b220e7c461d2e74c9a3593' as const,
        abi: parseAbi(['function getExchangeRate() pure returns (uint256)']),
      }

      const ratio = await readContract(config.client, { ...rETH, functionName: 'getExchangeRate' })
      return parseInt(ratio.toString()) / 1e18
    }
    case '0xa2b47e3d5c44877cca798226b7b8118f9bfb7a56': {
      // compound pool cUSDC-cDAI
      const cUSDC = {
        address: '0x39aa39c021dfbae8fac545936693ac917d5e7563' as const,
        abi: parseAbi(['function exchangeRateCurrent() pure returns (uint256)']),
      }

      const cDAI = {
        address: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643' as const,
        abi: parseAbi(['function exchangeRateCurrent() pure returns (uint256)']),
      }

      const ratio0 = await readContract(config.client, { ...cUSDC, functionName: 'exchangeRateCurrent' })
      const ratio1 = await readContract(config.client, { ...cDAI, functionName: 'exchangeRateCurrent' })
      return Number(ratio0 * BigInt(1e12)) / parseInt(ratio1.toString())
    }
    default:
      return 1
  }
}

async function createCurvePoolInfo(
  config: TestConfig,
  poolAddress: Address,
  poolType: CurvePoolType,
  initialBalance: bigint
): Promise<PoolInfo> {
  const poolContract = {
    address: poolAddress,
    abi: parseAbi([
      poolType !== CurvePoolType.LegacyV2 && poolType !== CurvePoolType.LegacyV3
        ? 'function exchange(int128 i, int128 j, uint256 dx, uint256 min_dy) payable returns (uint256)'
        : 'function exchange(int128 i, int128 j, uint256 dx, uint256 min_dy) payable returns ()',
      'function A() pure returns (uint256)',
      'function fee() pure returns (uint256)',
      poolType !== CurvePoolType.LegacyV2
        ? 'function coins(uint256) pure returns (address)'
        : 'function coins(int128) pure returns (address)',
      poolType !== CurvePoolType.LegacyV2
        ? 'function balances(uint256) pure returns (uint256)'
        : 'function balances(int128) pure returns (uint256)',
    ]),
  }

  const tokenContracts: Array<Contract<typeof erc20Abi> | undefined> = []
  const tokenTines: RToken[] = []
  for (let i = 0n; i < 100n; ++i) {
    let token: Address
    try {
      token = await readContract(config.client, { ...poolContract, functionName: 'coins', args: [i] })
    } catch (e) {
      break
    }
    if (token === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
      // native
      tokenContracts.push(undefined)
      tokenTines.push({ address: token, name: token, symbol: token, chainId: 1, decimals: 18 })
    } else {
      const res = await setTokenBalance(token, config.user.address, initialBalance)
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
      } catch (_) {
        // in try block because crv token (0xD533a949740bb3306d119CC777fa900bA034cd52) doesn't allow re-approve (((
      }
      tokenContracts.push(tokenContract)

      const decimals = await readContract(config.client, { ...tokenContract, functionName: 'decimals' })
      tokenTines.push({ address: token, name: token, symbol: token, chainId: 1, decimals })
    }
  }

  const A = await readContract(config.client, { ...poolContract, functionName: 'A' })
  const fee = await readContract(config.client, { ...poolContract, functionName: 'fee' })
  const reserves = await Promise.all(
    tokenContracts.map((_, i) =>
      readContract(config.client, { ...poolContract, functionName: 'balances', args: [BigInt(i)] })
    )
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
      await getPoolRatio(config, poolAddress, poolType)
    )

    const snapshot = await takeSnapshot()
    return {
      poolType,
      poolContract,
      tokenContracts,
      poolTines: [[undefined, poolTines]],
      user: config.user.address,
      snapshot,
    }
  } else {
    const pools = createCurvePoolsForMultipool(poolAddress, tokenTines, Number(fee) / 1e10, Number(A), reserves)
    const poolTines: (CurvePool | CurveMultitokenPool | undefined)[][] = []
    let n = 0
    for (let i = 0; i < tokenContracts.length; ++i) {
      poolTines[i] = []
      for (let j = i + 1; j < tokenContracts.length; ++j) poolTines[i][j] = pools[n++]
    }
    console.assert(n === pools.length)

    const snapshot = await takeSnapshot()
    return {
      poolType,
      poolContract,
      tokenContracts,
      poolTines,
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
  precision: number
) {
  const i = Math.min(from, to)
  const j = Math.max(from, to)
  const expectedOut = (poolInfo.poolTines[i][j] as CurvePool).calcOutByIn(Math.round(amountIn), from < to)
  let realOutBI: bigint
  if (poolInfo.poolType !== CurvePoolType.LegacyV2 && poolInfo.poolType !== CurvePoolType.LegacyV3) {
    realOutBI = (
      await simulateContract(config.client, {
        ...poolInfo.poolContract,
        functionName: 'exchange',
        args: [BigInt(from), BigInt(to), getBigInt(amountIn), 0n],
        value: poolInfo.tokenContracts[from] === undefined ? getBigInt(amountIn) : 0n,
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
      value: poolInfo.tokenContracts[from] === undefined ? getBigInt(amountIn) : 0n,
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

async function forEachFactoryPool(config: TestConfig, func: (address: Address, factoryName: string) => Promise<void>) {
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

    const poolNum = await readContract(config.client, { ...factoryContract, functionName: 'pool_count' })
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
  precision: number
): Promise<string> {
  const testSeed = poolAddress
  const rnd: () => number = seedrandom(testSeed) // random [0, 1)
  let poolInfo
  try {
    poolInfo = await createCurvePoolInfo(config, poolAddress, poolType, BigInt(1e30))
  } catch (e) {
    // return 'skipped (pool init error)'
  }
  if (!poolInfo || poolInfo.tokenContracts.length < 2) return 'skipped (pool init error)'

  const n = poolInfo.tokenContracts.length
  for (let i = 0; i < n; ++i)
    for (let j = i + 1; j < n; ++j) {
      const res0 = parseInt((poolInfo.poolTines[i][j] as RPool).reserve0.toString())
      const res1 = parseInt((poolInfo.poolTines[i][j] as RPool).reserve1.toString())
      if (res0 < 1e6 || res1 < 1e6) return 'skipped (low liquidity)'
      const checks = poolType === CurvePoolType.LegacyV2 || poolType === CurvePoolType.LegacyV3 ? 3 : 10
      for (let k = 0; k < checks; ++k) {
        const amountInPortion = getRandomExp(rnd, 1e-5, 1)
        await checkSwap(config, poolInfo, i, j, res0 * amountInPortion, precision)
        await checkSwap(config, poolInfo, j, i, res1 * amountInPortion, precision)
      }
    }
  return 'passed'
}

describe('Real Curve pools consistency check', () => {
  let config: TestConfig

  before(async () => {
    config = await getTestConfig()
  })

  describe.only('Not-Factory pools by whitelist', () => {
    for (let i = 0; i < NON_FACTORY_POOLS.length; ++i) {
      const [poolAddress, name, poolType, precision = 1e-9] = NON_FACTORY_POOLS[i]
      it(`${name} (${poolAddress}, ${poolType})`, async () => {
        const result = await processMultiTokenPool(config, poolAddress, poolType, precision)
        expect(result).equal('passed')
      })
    }
  })

  it(`Factory Pools (${FACTORY_ADDRESSES.length} factories)`, async () => {
    let passed = 0,
      i = 0
    const startFrom = 0,
      finishAt = 10
    await forEachFactoryPool(config, async (poolAddress: Address, factoryName: string) => {
      if (++i < startFrom) return
      if (i > finishAt) return
      process.stdout.write(`Factory ${factoryName} pool ${i} ${poolAddress} ... `)
      if (FACTORY_POOL_EXCEPTION_SET.has(poolAddress.toLowerCase())) {
        console.log('skipped (exception list: function "exchange" failes)')
        return
      }
      const precision = FACTORY_POOL_PRECISION_SPECIAL[poolAddress.toLowerCase()] || 1e9
      const result = await processMultiTokenPool(config, poolAddress, CurvePoolType.Factory, precision)
      console.log(result)
      if (result === 'passed') ++passed
    })
    console.log('passed', passed)
  })
})
