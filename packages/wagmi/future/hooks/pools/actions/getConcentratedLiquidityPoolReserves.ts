import { Amount } from '@sushiswap/currency'
import { computePoolAddress, Pool } from '@sushiswap/v3-sdk'
import { JSBI } from '@sushiswap/math'
import { Address } from 'wagmi'
import { fetchBalance } from '../../../..'

// TODO: MAKE DYNAMIC
const v3CoreFactoryAddress = '0x1af415a1EbA07a4986a52B6f2e7dE7003D82231e'

export const getConcentratedLiquidityPoolReserves = async ({ pool }: { pool: Pool }) => {
  const address = computePoolAddress({
    factoryAddress: v3CoreFactoryAddress,
    tokenA: pool.token0,
    tokenB: pool.token1,
    fee: pool.fee,
  }) as Address

  const [balance1, balance2] = await Promise.all([
    fetchBalance({
      address,
      chainId: pool.chainId,
      formatUnits: 'wei',
      token: pool.token0.address as Address,
    }),
    fetchBalance({
      address,
      chainId: pool.chainId,
      formatUnits: 'wei',
      token: pool.token1.address as Address,
    }),
  ])

  return [
    Amount.fromRawAmount(pool.token0, JSBI.BigInt(balance1.formatted)),
    Amount.fromRawAmount(pool.token1, JSBI.BigInt(balance2.formatted)),
  ]
}
