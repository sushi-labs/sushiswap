import { Provider } from '@ethersproject/providers'
import { SnapshotRestorer, takeSnapshot } from '@nomicfoundation/hardhat-network-helpers'
import { erc20Abi } from '@sushiswap/abi'
import { CurvePool, getBigNumber, RToken } from '@sushiswap/tines'
import { expect } from 'chai'
import { BigNumber, Contract, Signer } from 'ethers'
import { ethers } from 'hardhat'
import seedrandom from 'seedrandom'

import { setTokenBalance } from '../src/SetTokenBalance'

const FACTORY_ADDRESSES = [
  '0x0959158b6040d32d04c301a72cbfd6b39e21c9ae',
  '0xb9fc157394af804a3578134a6585c0dc9cc990d4',
  '0xf18056bbd320e96a48e3fbf8bc061322531aac99',
]

enum CurvePoolType {
  Legacy = 'Legacy', // 'exchange(int128 i, int128 j, uint256 dx, uint256 min_dy) -> uint256'
  LegacyV2 = 'LegacyV2', // 'function coins(int128) pure returns (address)'
  LegacyV3 = 'LegacyV3',
  Factory = 'Factory',
}

export function getRandomExp(rnd: () => number, min: number, max: number) {
  const minL = Math.log(min)
  const maxL = Math.log(max)
  const v = rnd() * (maxL - minL) + minL
  const res = Math.exp(v)
  console.assert(res <= max && res >= min, 'Random value is out of the range')
  return res
}

function closeValues(_a: number | BigNumber, _b: number | BigNumber, accuracy: number): boolean {
  const a: number = typeof _a == 'number' ? _a : parseInt(_a.toString())
  const b: number = typeof _b == 'number' ? _b : parseInt(_b.toString())
  if (accuracy === 0) return a === b
  if (Math.abs(a) < 1 / accuracy) return Math.abs(a - b) <= 10
  if (Math.abs(b) < 1 / accuracy) return Math.abs(a - b) <= 10
  return Math.abs(a / b - 1) < accuracy
}

function expectCloseValues(_a: number | BigNumber, _b: number | BigNumber, accuracy: number, logInfoIfFalse = '') {
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
  poolContract: Contract
  tokenContracts: (Contract | undefined)[]
  poolTines: CurvePool
  user: Signer
  userAddress: string
  snapshot: SnapshotRestorer
}

async function getPoolRatio(poolAddress: string, poolType: CurvePoolType, provider: Provider): Promise<number> {
  const pool = new Contract(
    poolAddress,
    [
      poolType !== CurvePoolType.LegacyV2
        ? 'function coins(uint256) pure returns (address)'
        : 'function coins(int128) pure returns (address)',
    ],
    provider
  )
  const token1 = await pool.coins(1)
  if (token1.toLowerCase() == '0x6c3f90f043a72fa612cbac8115ee7e52bde6e490') {
    // Metapool with 3-pool second token
    const basePool = new Contract(
      '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7',
      ['function get_virtual_price() pure returns (uint256)'],
      provider
    )
    const price = await basePool.get_virtual_price()
    // 1e18 is not always appropriate, but there is no way to find self.rate_multiplier value
    return parseInt(price.toString()) / 1e18
  }

  // collection of freaks
  switch (poolAddress.toLowerCase()) {
    case '0xa96a65c051bf88b4095ee1f2451c2a9d43f53ae2': {
      //ankrETH pool
      const ankrETH = new Contract(
        '0xE95A203B1a91a908F9B9CE46459d101078c2c3cb',
        ['function ratio() pure returns (uint256)'],
        provider
      )
      const ratio = await ankrETH.ratio()
      return 1e18 / parseInt(ratio.toString())
    }
    case '0xf9440930043eb3997fc70e1339dbb11f341de7a8': {
      // rETH pool
      const rETH = new Contract(
        '0x9559aaa82d9649c7a7b220e7c461d2e74c9a3593',
        ['function getExchangeRate() pure returns (uint256)'],
        provider
      )
      const ratio = await rETH.getExchangeRate()
      return parseInt(ratio.toString()) / 1e18
    }
    case '0xa2b47e3d5c44877cca798226b7b8118f9bfb7a56': {
      // compound pool cUSDC-cDAI
      const cUSDC = new Contract(
        '0x39aa39c021dfbae8fac545936693ac917d5e7563',
        ['function exchangeRateCurrent() pure returns (uint256)'],
        provider
      )
      const cDAI = new Contract(
        '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
        ['function exchangeRateCurrent() pure returns (uint256)'],
        provider
      )
      const ratio0 = await cUSDC.exchangeRateCurrent()
      const ratio1 = await cDAI.exchangeRateCurrent()
      return (parseInt(ratio0.toString()) * 1e12) / parseInt(ratio1.toString())
    }
    default:
      return 1
  }
}

async function createCurvePoolInfo(
  poolAddress: string,
  poolType: CurvePoolType,
  user: Signer,
  initialBalance: bigint
): Promise<PoolInfo> {
  const poolContract = new Contract(
    poolAddress,
    [
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
    ],
    user
  )

  const userAddress = await user.getAddress()
  const tokenContracts = []
  const tokenTines: RToken[] = []
  for (let i = 0; i < 100; ++i) {
    let token
    try {
      token = await poolContract.coins(i)
    } catch (e) {
      break
    }
    if (token == '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
      // native
      tokenContracts.push(undefined)
      tokenTines.push({ address: token, name: token, symbol: token, chainId: 1, decimals: 18 })
    } else {
      const res = await setTokenBalance(token, userAddress, initialBalance)
      expect(res).equal(true, 'Wrong setTokenBalance for ' + token)

      const tokenContract = new Contract(token, erc20Abi, user)
      await tokenContract.approve(poolAddress, initialBalance.toString())
      tokenContracts.push(tokenContract)

      const decimals = await tokenContract.decimals()
      tokenTines.push({ address: token, name: token, symbol: token, chainId: 1, decimals })
    }
  }

  const A = await poolContract.A()
  const fee = await poolContract.fee()
  const reserves = await Promise.all(tokenContracts.map((_, i) => poolContract.balances(i)))

  const poolTines = new CurvePool(
    poolAddress,
    tokenTines[0],
    tokenTines[1],
    fee.toNumber() / 1e10,
    A.toNumber(),
    reserves[0],
    reserves[1],
    await getPoolRatio(poolAddress, poolType, user.provider as Provider)
  )

  const snapshot = await takeSnapshot()
  return {
    poolType,
    poolContract,
    tokenContracts,
    poolTines,
    user,
    userAddress,
    snapshot,
  }
}

async function checkSwap(poolInfo: PoolInfo, from: number, to: number, amountIn: number, precision: number) {
  const expectedOut = poolInfo.poolTines.calcOutByIn(Math.round(amountIn), from < to)
  let realOutBN: BigNumber
  if (poolInfo.poolType !== CurvePoolType.LegacyV2 && poolInfo.poolType !== CurvePoolType.LegacyV3) {
    realOutBN = await poolInfo.poolContract.callStatic.exchange(from, to, getBigNumber(amountIn), 0, {
      value: poolInfo.tokenContracts[from] === undefined ? getBigNumber(amountIn) : 0,
    })
  } else {
    poolInfo.snapshot.restore()
    const balanceBefore = await poolInfo.tokenContracts[to]?.balanceOf(poolInfo.userAddress)
    await poolInfo.poolContract.exchange(from, to, getBigNumber(amountIn), 0, {
      value: poolInfo.tokenContracts[from] === undefined ? getBigNumber(amountIn) : 0,
    })
    const balanceAfter = await poolInfo.tokenContracts[to]?.balanceOf(poolInfo.userAddress)
    realOutBN = balanceAfter.sub(balanceBefore)
  }
  const realOut = parseInt(realOutBN.toString())

  expectCloseValues(realOut, expectedOut.out, precision)
}

const CurvePools: [string, string, CurvePoolType, number?][] = [
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

async function forEachFactoryPool(provider: Provider, func: (address: string, factoryName: string) => void) {
  const processedPoolSet = new Set<string>()
  for (let f = 0; f < FACTORY_ADDRESSES.length; ++f) {
    const factoryAddress = FACTORY_ADDRESSES[f]
    const factoryContract = new Contract(
      factoryAddress,
      [
        'function pool_count() pure returns (uint256)',
        'function pool_list(uint256) pure returns (address)',
        'function get_n_coins(address) pure returns (uint256)',
      ],
      provider
    )

    const poolNum = await factoryContract.pool_count()
    for (let i = 0; i < poolNum; ++i) {
      const poolAddress = await factoryContract.pool_list(i)
      if (processedPoolSet.has(poolAddress)) continue
      processedPoolSet.add(poolAddress)
      //const coins = await factoryContract.get_n_coins(poolAddress)
      await func(poolAddress, `#${f}`)
    }
  }
}

async function process2CoinsPool(
  poolAddress: string,
  name: string,
  poolType: CurvePoolType,
  precision: number
): Promise<string> {
  const testSeed = poolAddress
  const rnd: () => number = seedrandom(testSeed) // random [0, 1)
  const [user] = await ethers.getSigners()
  let poolInfo
  try {
    poolInfo = await createCurvePoolInfo(poolAddress, poolType, user, BigInt(1e30))
  } catch (e) {
    return 'skipped (pool init error)'
  }
  if (poolInfo.tokenContracts.length > 2) return `skipped (${poolInfo.tokenContracts.length} tokens)`
  const res0 = parseInt(poolInfo.poolTines.reserve0.toString())
  const res1 = parseInt(poolInfo.poolTines.reserve1.toString())
  const checks = poolType == CurvePoolType.LegacyV2 || poolType == CurvePoolType.LegacyV3 ? 3 : 10
  for (let i = 0; i < checks; ++i) {
    const amountInPortion = getRandomExp(rnd, 1e-5, 1)
    await checkSwap(poolInfo, 0, 1, res0 * amountInPortion, precision)
    await checkSwap(poolInfo, 1, 0, res1 * amountInPortion, precision)
  }
  return 'passed'
}

describe.only('Real Curve pools consistency check', () => {
  describe('Not-Factory pools by whitelist', () => {
    for (let i = 0; i < CurvePools.length; ++i) {
      const [poolAddress, name, poolType, precision = 1e-9] = CurvePools[i]
      it(`${name} (${poolAddress}, ${poolType})`, async () => {
        const result = await process2CoinsPool(poolAddress, name, poolType, precision)
        expect(result).equal('passed')
      })
    }
  })
  it(`Factory Pools (${FACTORY_ADDRESSES.length} factories)`, async () => {
    let i = 0
    const skipFirst = 0
    const [user] = await ethers.getSigners()
    await forEachFactoryPool(user.provider as Provider, async (poolAddress: string, factoryName: string) => {
      if (i < skipFirst) {
        ++i
        return
      }
      process.stdout.write(`Factory pool ${++i} ${poolAddress} Factory ${factoryName} processing ... `)
      const result = await process2CoinsPool(poolAddress, `Factory ${factoryName}`, CurvePoolType.Factory, 1e-9)
      console.log(result)
    })
  })
})
