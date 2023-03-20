import { getAllPools } from '../actions/getAllPools'
import { PoolType, UsePoolsParams } from '../types'
import { useQuery } from '@tanstack/react-query'
import {
  computeConstantProductPoolAddress,
  computePairAddress,
  computeStablePoolAddress,
  ConstantProductPool,
  Fee,
  Pair,
  StablePool,
} from '@sushiswap/amm'
import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { isUniswapV2FactoryChainId, uniswapV2FactoryAddress } from '@sushiswap/sushiswap'
import {
  constantProductPoolFactoryAddress,
  isConstantProductPoolFactoryChainId,
  isStablePoolFactoryChainId,
  stablePoolFactoryAddress,
} from '@sushiswap/trident'

const getPoolAddress = ({
  chainId,
  poolType,
  token0,
  token1,
  fee,
}: {
  chainId: ChainId
  poolType: PoolType
  token0: Token
  token1: Token
  fee: Fee
}) => {
  const [tokenA, tokenB] = token0.wrapped.sortsBefore(token1.wrapped)
    ? [token0.wrapped, token1.wrapped]
    : [token1.wrapped, token0.wrapped]
  if (poolType === PoolType.StablePool && isStablePoolFactoryChainId(chainId))
    return computeStablePoolAddress({
      factoryAddress: stablePoolFactoryAddress[chainId],
      tokenA,
      tokenB,
      fee,
    })

  if (poolType === PoolType.ConstantProduct && isConstantProductPoolFactoryChainId(chainId))
    return computeConstantProductPoolAddress({
      factoryAddress: constantProductPoolFactoryAddress[chainId],
      tokenA,
      tokenB,
      fee,
      twap: false,
    })

  if (poolType === PoolType.V2 && isUniswapV2FactoryChainId(chainId)) {
    return computePairAddress({
      factoryAddress: uniswapV2FactoryAddress[chainId],
      tokenA,
      tokenB,
    })
  }

  return undefined
}

interface UsePoolsAsMapParams extends UsePoolsParams {
  poolType: PoolType
  fee: Fee
}
export const usePoolsAsMap = (variables: UsePoolsAsMapParams) => {
  return useQuery({
    queryKey: [
      'usePoolsAsMap',
      { chainId: variables.chainId, currencyA: variables.currencyA, currencyB: variables.currencyB },
    ],
    queryFn: async () => {
      const data = await getAllPools({ ...variables, asMap: true, withCombinations: false, withBentoPools: false })
      const pools = [...(data.pairs || []), ...(data.stablePools || []), ...(data.constantProductPools || [])]
      console.log({ data })
      return pools.reduce<Record<string, Pair | ConstantProductPool | StablePool>>((acc, cur) => {
        acc[cur.liquidityToken.address] = cur
        return acc
      }, {})
    },
    select: (data) => {
      const computeCurrentPairAddress =
        variables.currencyA && variables.currencyB
          ? getPoolAddress({
              chainId: variables.chainId,
              poolType: variables.poolType,
              token0: variables.currencyA?.wrapped,
              token1: variables.currencyB?.wrapped,
              fee: variables.fee,
            })
          : undefined

      return {
        pool: computeCurrentPairAddress ? data[computeCurrentPairAddress] : undefined,
        map: data,
      }
    },
    refetchInterval: 10000,
    enabled: Boolean(variables.enabled || true),
  })
}
