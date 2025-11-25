import type { V3Pool } from '@sushiswap/graph-client/data-api'
import { readContracts } from '@wagmi/core'
import type { PublicWagmiConfig } from 'src/lib/wagmi/config/public'
import { Amount } from 'sushi'
import { EvmToken, erc20Abi_balanceOf } from 'sushi/evm'

export const getConcentratedLiquidityPoolReserves = async ({
  pool,
  config,
}: {
  pool: V3Pool
  config: PublicWagmiConfig
}) => {
  const [balance1, balance2] = await readContracts(config, {
    contracts: [
      {
        address: pool.token0.address,
        abi: erc20Abi_balanceOf,
        functionName: 'balanceOf',
        args: [pool.address],
        chainId: pool.chainId,
      },
      {
        address: pool.token1.address,
        abi: erc20Abi_balanceOf,
        functionName: 'balanceOf',
        args: [pool.address],
        chainId: pool.chainId,
      },
    ],
    allowFailure: false,
  })

  return [
    new Amount(new EvmToken(pool.token0), balance1),
    new Amount(new EvmToken(pool.token1), balance2),
  ]
}
