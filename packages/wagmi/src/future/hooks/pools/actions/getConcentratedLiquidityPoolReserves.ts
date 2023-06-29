import { Amount } from '@sushiswap/currency'
import { computePoolAddress, Pool, SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { JSBI } from '@sushiswap/math'
import { Address } from 'wagmi'
import { fetchBalance } from '../../../..'
import { getV3FactoryContractConfig } from '../../contracts/useV3FactoryContract'

export const getConcentratedLiquidityPoolReserves = async ({ pool, chainId }: { pool: Pool; chainId: SushiSwapV3ChainId }) => {
  const address = computePoolAddress({
    factoryAddress: getV3FactoryContractConfig(chainId).address,
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
