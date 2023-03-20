import { SnapshotRestorer, takeSnapshot } from '@nomicfoundation/hardhat-network-helpers'
import { erc20Abi } from '@sushiswap/abi'
import { CurvePool, getBigNumber, RToken } from '@sushiswap/tines'
import { expect } from 'chai'
import { BigNumber, Contract, Signer } from 'ethers'
import { ethers } from 'hardhat'
import seedrandom from 'seedrandom'

import { setTokenBalance } from '../src/SetTokenBalance'

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
    reserves[1]
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

async function checkSwap(poolInfo: PoolInfo, from: number, to: number, amountIn: number) {
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

  expectCloseValues(realOut, expectedOut.out, 1e-9)
}

const CurvePools: [string, string, CurvePoolType][] = [
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
  // ['0xa96a65c051bf88b4095ee1f2451c2a9d43f53ae2', 'ankrETH', CurvePoolType.Legacy],
  // ['0xeb16ae0052ed37f479f7fe63849198df1765a733', 'saave', CurvePoolType.Legacy],
  // ['0xf9440930043eb3997fc70e1339dbb11f341de7a8', 'reth', CurvePoolType.Legacy],
  // ['0xa2b47e3d5c44877cca798226b7b8118f9bfb7a56', 'compound', CurvePoolType.LegacyV2],
  ['0xfd5db7463a3ab53fd211b4af195c5bccc1a03890', 'eurt', CurvePoolType.Legacy],
  ['0xf178c0b5bb7e7abf4e12a4838c7b7c5ba2c623c0', 'link', CurvePoolType.Legacy],
  ['0x4ca9b3063ec5866a4b82e437059d2c43d1be596f', 'hbtc', CurvePoolType.LegacyV3],
  ['0x93054188d876f558f4a66b2ef1d97d16edf0895b', 'ren', CurvePoolType.LegacyV2],
]

describe.only('Real Curve pools consistency check', () => {
  for (let i = 0; i < CurvePools.length; ++i) {
    const [addr, name, poolType] = CurvePools[i]
    it(`${name} (${addr}, ${poolType})`, async () => {
      const testSeed = addr
      const rnd: () => number = seedrandom(testSeed) // random [0, 1)
      const [user] = await ethers.getSigners()
      const poolInfo = await createCurvePoolInfo(addr, poolType, user, BigInt(1e30))
      const res0 = parseInt(poolInfo.poolTines.reserve0.toString())
      const res1 = parseInt(poolInfo.poolTines.reserve1.toString())
      const checks = poolType == CurvePoolType.LegacyV2 || poolType == CurvePoolType.LegacyV3 ? 3 : 10
      for (let i = 0; i < checks; ++i) {
        const amountInPortion = getRandomExp(rnd, 1e-5, 1)
        await checkSwap(poolInfo, 0, 1, res0 * amountInPortion)
        await checkSwap(poolInfo, 1, 0, res1 * amountInPortion)
      }
    })
  }
})
