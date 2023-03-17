import { erc20Abi } from '@sushiswap/abi'
import { CurvePool, getBigNumber, RToken } from '@sushiswap/tines'
import { expect } from 'chai'
import { BigNumber, Contract, Signer } from 'ethers'
import { ethers } from 'hardhat'
import seedrandom from 'seedrandom'

import { setTokenBalance } from '../src/SetTokenBalance'

enum CurvePoolType {
  Legacy = 'Legacy', // 'exchange(int128 i, int128 j, uint256 dx, uint256 min_dy) -> uint256'
  Legacy_ETH = 'Legacy_ETH', // like Legacy, but raw ETH as one of tokens
  Factory = 'Factory', // 'exchange(unt128 i, unt128 j, uint256 dx, uint256 min_dy) -> uint256'
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
  poolContract: Contract
  tokenContracts: (Contract | undefined)[]
  poolTines: CurvePool
  user: Signer
  userAddress: string
}

async function createCurvePoolInfo(
  poolAddress: string,
  poolType: CurvePoolType,
  user: Signer,
  initialBalance: bigint
): Promise<PoolInfo> {
  const chainId = ethers.provider.network.chainId
  const poolContract = new Contract(
    poolAddress,
    [
      'function exchange(int128 i, int128 j, uint256 dx, uint256 min_dy) payable returns (uint256)',
      // poolType == CurvePoolType.Legacy || poolType == CurvePoolType.Legacy_ETH
      //   ? 'function exchange(int128 i, int128 j, uint256 dx, uint256 min_dy) payable returns (uint256)'
      //   : 'function exchange(uint256 i, uint256 j, uint256 dx, uint256 min_dy) payable returns (uint256)',
      'function A() pure returns (uint256)',
      'function fee() pure returns (uint256)',
      'function coins(uint256) pure returns (address)',
      'function balances(uint256) pure returns (uint256)',
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
      tokenTines.push({ address: token, name: token, symbol: token, chainId, decimals: 18 })
    } else {
      const res = await setTokenBalance(token, userAddress, initialBalance)
      expect(res).equal(true)

      const tokenContract = new Contract(token, erc20Abi, user)
      await tokenContract.approve(poolAddress, initialBalance.toString())
      tokenContracts.push(tokenContract)

      const decimals = await tokenContract.decimals()
      tokenTines.push({ address: token, name: token, symbol: token, chainId, decimals })
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

  return {
    poolContract,
    tokenContracts,
    poolTines,
    user,
    userAddress,
  }
}

async function checkSwap(poolInfo: PoolInfo, from: number, to: number, amountIn: number) {
  const expectedOut = poolInfo.poolTines.calcOutByIn(Math.round(amountIn), from < to)
  const realOutBN = await poolInfo.poolContract.callStatic.exchange(from, to, getBigNumber(amountIn), 0, {
    value: poolInfo.tokenContracts[from] === undefined ? getBigNumber(amountIn) : 0,
  })
  const realOut = parseInt(realOutBN.toString())

  expectCloseValues(realOut, expectedOut.out, 1e-9)
}

const CurvePools: [string, string, CurvePoolType][] = [
  ['0xdc24316b9ae028f1497c275eb9192a3ea0f67022', 'steth', CurvePoolType.Legacy_ETH],
  ['0xdcef968d416a41cdac0ed8702fac8128a64241a2', 'fraxusdc', CurvePoolType.Legacy],
  ['0x828b154032950c8ff7cf8085d841723db2696056', 'stETH concentrated', CurvePoolType.Factory],
  ['0xf253f83aca21aabd2a20553ae0bf7f65c755a07f', 'sbtc2', CurvePoolType.Legacy],
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
      for (let i = 0; i < 10; ++i) {
        const amountInPortion = getRandomExp(rnd, 1e-5, 1)
        await checkSwap(poolInfo, 0, 1, res0 * amountInPortion)
        await checkSwap(poolInfo, 1, 0, res1 * amountInPortion)
      }
    })
  }
})
