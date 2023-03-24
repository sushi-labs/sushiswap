import { computePairAddress, FACTORY_ADDRESS, Pair, FeeAmount, computeV3PoolAddress } from '@sushiswap/amm'
import { ChainId } from '@sushiswap/chain'
import { Amount, Token, Type as Currency, Type } from '@sushiswap/currency'
import { uniswapV2FactoryAddress, UniswapV2Router02ChainId, UniswapV2FactoryChainId } from '@sushiswap/sushiswap'
import { CLRPool } from '@sushiswap/tines'
import { useMemo } from 'react'
import { useContractReads } from 'wagmi'

import { uniswapV2PairAbi } from '../abis'
import { uniswapV3PoolAbi } from '../abis/uniswapV3PoolAbi'
import { PairState } from './usePairs'

type UseContractReadsConfig = Parameters<typeof useContractReads>['0']

/**
 * The default factory tick spacings by fee amount.
 */
export declare const TICK_SPACINGS: {
  [amount in FeeAmount]: number
}

export function getV3Pools(
  chainId: ChainId | undefined, // TODO: Fix ChainId Type
  currencies: [Currency | undefined, Currency | undefined][]
) {
  const allCurrencyCombinationsWithAllFees: [Type, Type, FeeAmount][] = currencies.reduce<
    [Currency, Currency, FeeAmount][]
  >((list, [tokenA, tokenB]) => {
    if (tokenA !== undefined && tokenB !== undefined) {
      return list.concat([
        [tokenA, tokenB, FeeAmount.LOWEST],
        [tokenA, tokenB, FeeAmount.LOW],
        [tokenA, tokenB, FeeAmount.MEDIUM],
        [tokenA, tokenB, FeeAmount.HIGH],
      ])
    }
    return []
  }, [])

  // const filtered = allCurrencyCombinationsWithAllFees.filter((currencies): currencies is [Type, Type, FeeAmount] => {
  //   const [currencyA, currencyB] = currencies
  //   return Boolean(
  //     currencyA &&
  //       currencyB &&
  //       currencyA.chainId === currencyB.chainId &&
  //       !currencyA.wrapped.equals(currencyB.wrapped) &&
  //       FACTORY_ADDRESS[currencyA.chainId]
  //   )
  // })

  // const [tokensA, tokensB] = filtered.reduce<[Token[], Token[]]>(
  //   (acc, [currencyA, currencyB]) => {
  //     acc[0].push(currencyA.wrapped)
  //     acc[1].push(currencyB.wrapped)

  //     return acc
  //   },
  //   [[], []]
  // )
  const filtered: [Token, Token, FeeAmount][] = []
  allCurrencyCombinationsWithAllFees.forEach(([currencyA, currencyB, feeAmount]) => {
    if (currencyA && currencyB && feeAmount) {
      const tokenA = currencyA.wrapped
      const tokenB = currencyB.wrapped
      if (tokenA.equals(tokenB)) return
      filtered.push(tokenA.sortsBefore(tokenB) ? [tokenA, tokenB, feeAmount] : [tokenB, tokenA, feeAmount])
    }
  })

  const slot0 = filtered.map(([currencyA, currencyB, fee]) => ({
    chainId,
    address: computeV3PoolAddress({
      factoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
      tokenA: currencyA.wrapped,
      tokenB: currencyB.wrapped,
      fee,
    }),
    abi: uniswapV3PoolAbi,
    functionName: 'slot0' as const,
  }))

  const liquidity = filtered.map(([currencyA, currencyB, fee]) => ({
    chainId,
    address: computeV3PoolAddress({
      factoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
      tokenA: currencyA.wrapped,
      tokenB: currencyB.wrapped,
      fee,
    }),
    abi: uniswapV3PoolAbi,
    functionName: 'slot0' as const,
  }))

  const tickSpacing = filtered.map(([currencyA, currencyB, fee]) => ({
    chainId,
    address: computeV3PoolAddress({
      factoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
      tokenA: currencyA.wrapped,
      tokenB: currencyB.wrapped,
      fee,
    }),
    abi: uniswapV3PoolAbi,
    functionName: 'tickSpacing' as const,
  }))

  return [filtered, slot0, liquidity, tickSpacing] as const
}

interface UsePoolsReturn {
  isLoading: boolean
  isError: boolean
  data: [PairState, CLRPool | null][]
}

export function useV3Pools(
  chainId: ChainId | undefined,
  currencies: [Currency | undefined, Currency | undefined][],
  config?: Omit<NonNullable<UseContractReadsConfig>, 'contracts'>
): UsePoolsReturn {
  const [tokens, slot0Contracts, liquidityContracts, tickSpacingContracts] = useMemo(
    () => getV3Pools(chainId, currencies),
    [chainId, currencies]
  )

  const {
    data: slot0Data,
    isLoading: slot0IsLoading,
    isError: slot0IsError,
  } = useContractReads({
    contracts: slot0Contracts,
    enabled: config?.enabled !== undefined ? config.enabled && slot0Contracts.length > 0 : slot0Contracts.length > 0,
    watch: !(typeof config?.enabled !== undefined && !config?.enabled),
  })

  const {
    data: liquidityData,
    isLoading: liquidityIsLoading,
    isError: liquidityIsError,
  } = useContractReads({
    contracts: liquidityContracts,
    enabled:
      config?.enabled !== undefined ? config.enabled && liquidityContracts.length > 0 : liquidityContracts.length > 0,
    watch: !(typeof config?.enabled !== undefined && !config?.enabled),
  })

  const {
    data: tickSpacingData,
    isLoading: tickSpacingIsLoading,
    isError: tickSpacingIsError,
  } = useContractReads({
    contracts: tickSpacingContracts,
    enabled:
      config?.enabled !== undefined
        ? config.enabled && tickSpacingContracts.length > 0
        : tickSpacingContracts.length > 0,
    watch: !(typeof config?.enabled !== undefined && !config?.enabled),
  })

  // TODO: Tines will need this data/contract calls:
  // slot0 - returns: sqrtPrice, tick // By fetching this, we know if the pair exists

  // liquidity
  // tickSpacing

  // token0Contract.balanceOf(poolAddress)
  // token1Contract.balanceOf(poolAddress)

  // ticks: CLTick[] // FROM lens contract?

  // return useMemo(() => {
  //   // if (slot0Contracts.length === 0) return { isLoading, isError, data: [[PairState.INVALID, null]] }
  //   // if (!slot0Data)
  //   //   return {
  //   //     isLoading,
  //   //     isError,
  //   //     data: contracts.map(() => [PairState.LOADING, null]),
  //   //   }

  //   return {
  //     isLoading: slot0IsLoading || liquidityIsLoading || tickSpacingIsLoading,
  //     isError: slot0IsError || liquidityIsError || tickSpacingIsError,
  //     data: tokens.map((tokens, index) => {
  //       if (!tokens) return [PairState.INVALID, null]
  //       const [token0, token1, fee] = tokens

  //       if (
  //         !slot0Data ||
  //         !liquidityData ||
  //         !tickSpacingData ||
  //         !slot0Data[index] ||
  //         liquidityData[index] ||
  //         tickSpacingData[index]
  //       )
  //         return [PairState.INVALID, null]
  //       // const { result: slot0, loading: slot0Loading, valid: slot0Valid } = slot0Data[index]

  //       // if (!liquidities[index]) return [PoolState.INVALID, null]
  //       // const { result: liquidity, loading: liquidityLoading, valid: liquidityValid } = liquidities[index]

  //       // if (!tokens || !slot0Valid || !liquidityValid) return [PoolState.INVALID, null]
  //       if (slot0IsLoading || liquidityIsLoading || tickSpacingIsLoading) return [PairState.LOADING, null]
  //       // if (!slot0Data || !liquidity) return [PoolState.NOT_EXISTS, null]
  //       if (!slot0Data[index].sqrtPriceX96 || slot0Data[index].sqrtPriceX96.eq(0)) return [PairState.NOT_EXISTS, null]

  //       try {
  //         // const pool = PoolCache.getPool(token0, token1, fee, slot0.sqrtPriceX96, liquidity[0], slot0.tick)
  //         const pool = new CLRPool(
  //           'dunno',
  //           token0,
  //           token1,
  //           fee / 10_000,
  //           slot0Data[index].sqrtPriceX96,
  //           slot0Data[index].liquidityData[index].liquidity,
  //           slot0Data[index].tick
  //         )
  //         return [PairState.EXISTS, pool]
  //       } catch (error) {
  //         console.error('Error when constructing the pool', error)
  //         return [PairState.NOT_EXISTS, null]
  //       }
  //     }),
  //   }
  // }, [])
}

interface UsePairReturn {
  isLoading: boolean
  isError: boolean
  data: [PairState, Pair | null]
}

export function useV3Pool(
  chainId: UniswapV2Router02ChainId,
  tokenA?: Currency,
  tokenB?: Currency,
  config?: Omit<UseContractReadsConfig, 'contracts'>
): UsePairReturn {
  const inputs: [[Currency | undefined, Currency | undefined]] = useMemo(() => [[tokenA, tokenB]], [tokenA, tokenB])
  const { data, isLoading, isError } = useV3Pools(chainId, inputs, config)

  return useMemo(
    () => ({
      isLoading,
      isError,
      data: data?.[0],
    }),
    [data, isError, isLoading]
  )
}
