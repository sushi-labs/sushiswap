import { MulticallReturnType, readContracts } from '@wagmi/core/actions'
import {
  type EvmCurrency,
  EvmToken,
  SUSHISWAP_V3_FACTORY_ADDRESS,
  type SushiSwapV3ChainId,
  type SushiSwapV3FeeAmount,
  SushiSwapV3Pool,
  computeSushiSwapV3PoolAddress,
  slot0Abi_slot0,
  sushiSwapV3PoolAbi_liquidity,
} from 'sushi/evm'
import type { Address, ContractFunctionReturnType } from 'viem'
import type { PublicWagmiConfig } from '../../../config/public'

type Slot0 = ContractFunctionReturnType<typeof slot0Abi_slot0, 'view', 'slot0'>
type Liquidity = ContractFunctionReturnType<
  typeof sushiSwapV3PoolAbi_liquidity,
  'view',
  'liquidity'
>

export const getConcentratedLiquidityPools = async ({
  poolKeys,
  config,
}: {
  poolKeys: {
    chainId: SushiSwapV3ChainId
    token0: EvmCurrency
    token1: EvmCurrency
    feeAmount: SushiSwapV3FeeAmount
  }[]
  config: PublicWagmiConfig
}): Promise<(SushiSwapV3Pool | null)[]> => {
  const pools = poolKeys.map((pool) => {
    let address: Address | undefined

    const tokenA = pool.token0.wrap()
    const tokenB = pool.token1.wrap()

    if (tokenA.isSame(tokenB)) {
      return {
        ...pool,
        address: undefined,
      }
    } else {
      const [token0, token1] = tokenA.sortsBefore(tokenB)
        ? [tokenA, tokenB]
        : [tokenB, tokenA]

      address = computeSushiSwapV3PoolAddress({
        factoryAddress: SUSHISWAP_V3_FACTORY_ADDRESS[pool.chainId],
        tokenA: token0,
        tokenB: token1,
        fee: pool.feeAmount,
      }) as Address

      return {
        ...pool,
        token0,
        token1,
        address,
      }
    }
  })

  // Batching slot0 and liquidity multicalls into one
  const results = await readContracts(config, {
    contracts: pools.flatMap(({ chainId, address }) => [
      {
        chainId,
        address: address as Address,
        abi: slot0Abi_slot0,
        functionName: 'slot0',
      } as const,
      {
        chainId,
        address: address as Address,
        abi: sushiSwapV3PoolAbi_liquidity,
        functionName: 'liquidity',
      } as const,
    ]),
  })

  // Split results back into slot0s and liquidities arrays
  const slot0s = results.filter((_, i) => i % 2 === 0)
  const liquidities = results.filter((_, i) => i % 2 === 1)

  return pools.map((pool, index) => {
    const tokens = pools[index]
    if (!pool.address) return null
    const { token0, token1, feeAmount } = pool

    if (!slot0s[index]) return null
    const slot0 = slot0s[index].result as Slot0

    if (!liquidities[index]) return null
    const liquidity = liquidities[index].result as Liquidity

    if (!tokens || !slot0 || typeof liquidity === 'undefined') return null

    const sqrtPriceX96 = slot0[0]
    if (!sqrtPriceX96 || sqrtPriceX96 === 0n) return null

    const tick = slot0[1]
    if (typeof tick === 'undefined') return null

    return new SushiSwapV3Pool(
      token0,
      token1,
      feeAmount,
      sqrtPriceX96,
      liquidity,
      tick,
    )
  })
}

export const getConcentratedLiquidityPool = async ({
  chainId,
  token0,
  token1,
  feeAmount,
  config,
}: {
  chainId: SushiSwapV3ChainId
  token0: EvmCurrency
  token1: EvmCurrency
  feeAmount: SushiSwapV3FeeAmount
  config: PublicWagmiConfig
}): Promise<SushiSwapV3Pool | null> => {
  return (
    await getConcentratedLiquidityPools({
      poolKeys: [
        {
          chainId,
          token0,
          token1,
          feeAmount,
        },
      ],
      config,
    })
  )[0]
}
