import { erc20Abi } from '@sushiswap/abi'
import { CurvePool, RToken } from '@sushiswap/tines'
import { Contract } from 'ethers'
import { ethers } from 'hardhat'

import { setTokenBalance } from '../src/SetTokenBalance'

interface PoolInfo {
  poolContract: Contract
  tokenContracts: Contract[]
  poolTines: CurvePool
}

async function createCurvePool(address: string): Promise<PoolInfo> {
  const chainId = ethers.provider.network.chainId
  const poolContract = new Contract(
    address,
    [
      'function exchange(int128 i, int128 j, uint256 dx, uint256 min_dy) returns (string)',
      'function A() returns (uint256)',
      'function fee() returns (uint256)',
      'function coins(uint256) returns (address)',
      'function balances(uint256) returns (uint256)',
    ],
    ethers.provider
  )

  const tokenContracts = []
  const tokenTines: RToken[] = []
  for (let i = 0; i < 100; ++i) {
    try {
      const token = await poolContract.coins(i)
      tokenContracts.push(new Contract(token, erc20Abi, ethers.provider))
      tokenTines.push({ address: token, name: token, symbol: token, chainId })
    } catch (e) {
      break
    }
  }

  const A = await poolContract.A()
  const fee = await poolContract.fee()
  const reserves = await Promise.all(tokenContracts.map((_, i) => poolContract.balances(i)))

  const poolTines = new CurvePool(address, tokenTines[0], tokenTines[1], fee / 1e10, A, reserves[0], reserves[1])

  return {
    poolContract,
    tokenContracts,
    poolTines,
  }
}

// async function checkSwap(poolInfo: PoolInfo, from: number, to: number, amountIn: number) {
//   const balanceOutBefore = await poolInfo.tokenContracts[to].
// }

it('test', async () => {
  const res = await setTokenBalance(
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    '0x0000000000000000000000000000000000000010',
    1000n
  )
  console.log(res)
})
