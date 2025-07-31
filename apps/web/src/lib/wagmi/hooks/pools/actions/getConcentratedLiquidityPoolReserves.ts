import type { V3Pool } from '@sushiswap/graph-client/data-api'
import { getBalance } from '@wagmi/core'
import type { PublicWagmiConfig } from 'src/lib/wagmi/config/public'
import { Amount } from 'sushi'
import { EvmToken } from 'sushi/evm'

export const getConcentratedLiquidityPoolReserves = async ({
  pool,
  config,
}: {
  pool: V3Pool
  config: PublicWagmiConfig
}) => {
  const [balance1, balance2] = await Promise.all([
    getBalance(config, {
      address: pool.address,
      chainId: pool.chainId,
      token: pool.token0.address,
    }),
    getBalance(config, {
      address: pool.address,
      chainId: pool.chainId,
      token: pool.token1.address,
    }),
  ])

  return [
    new Amount(new EvmToken(pool.token0), balance1.value),
    new Amount(new EvmToken(pool.token1), balance2.value),
  ]
}
