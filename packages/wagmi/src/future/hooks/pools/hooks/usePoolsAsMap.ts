import {
  computeSushiSwapV2PoolAddress,
  computeTridentConstantPoolAddress,
  computeTridentStablePoolAddress,
  Fee,
  SushiSwapV2Pool,
  TridentConstantPool,
  TridentStablePool,
} from '@sushiswap/amm'
import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import {
  isTridentConstantPoolFactoryChainId,
  isTridentStablePoolFactoryChainId,
  tridentConstantPoolFactoryAddress,
  tridentStablePoolFactoryAddress,
} from '@sushiswap/trident-sdk'
import { isSushiSwapV2ChainId, SUSHISWAP_V2_FACTORY_ADDRESS } from '@sushiswap/v2-sdk'
import { useQuery } from '@tanstack/react-query'

import { getAllPools } from '../actions/getAllPools'
import { PoolType, UsePoolsParams } from '../types'

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
  if (poolType === PoolType.TridentStablePool && isTridentStablePoolFactoryChainId(chainId))
    return computeTridentStablePoolAddress({
      factoryAddress: tridentStablePoolFactoryAddress[chainId],
      tokenA,
      tokenB,
      fee,
    })

  if (poolType === PoolType.TridentConstantPool && isTridentConstantPoolFactoryChainId(chainId))
    return computeTridentConstantPoolAddress({
      factoryAddress: tridentConstantPoolFactoryAddress[chainId],
      tokenA,
      tokenB,
      fee,
      twap: false,
    })

  if (poolType === PoolType.SushiSwapV2Pool && isSushiSwapV2ChainId(chainId)) {
    return computeSushiSwapV2PoolAddress({
      factoryAddress: SUSHISWAP_V2_FACTORY_ADDRESS[chainId],
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
export const usePoolsAsMap = ({ enabled = true, ...variables }: UsePoolsAsMapParams) => {
  const { chainId, currencyA, currencyB } = variables

  return useQuery({
    queryKey: ['usePoolsAsMap', { chainId, currencyA, currencyB }],
    queryFn: async () => {
      const data = await getAllPools({ ...variables, asMap: true, withCombinations: false, withBentoPools: false })
      const pools = [
        ...(data.sushiSwapV2Pools || []),
        ...(data.tridentStablePools || []),
        ...(data.tridentConstantPools || []),
      ]
      console.log({ data })
      return pools.reduce<Record<string, SushiSwapV2Pool | TridentConstantPool | TridentStablePool>>((acc, cur) => {
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
    enabled,
  })
}
