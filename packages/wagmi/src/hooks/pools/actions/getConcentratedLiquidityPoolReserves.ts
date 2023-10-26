import {
  SushiSwapV3ChainId,
  SushiSwapV3Pool,
  computePoolAddress,
} from '@sushiswap/v3-sdk'
import { Amount } from 'sushi/currency'
import { Address } from 'wagmi'

import { fetchBalance } from '@wagmi/core'
import { getV3FactoryContractConfig } from '../../contracts'

export const getConcentratedLiquidityPoolReserves = async ({
  pool,
  chainId,
}: {
  pool: SushiSwapV3Pool
  chainId: SushiSwapV3ChainId
}) => {
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
    Amount.fromRawAmount(pool.token0, balance1.value),
    Amount.fromRawAmount(pool.token1, balance2.value),
  ]
}
