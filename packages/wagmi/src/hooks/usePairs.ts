
import { Amount, Token, Type as Currency, Type } from '@sushiswap/currency'
import { SUSHISWAP_V2_FACTORY_ADDRESS, isSushiSwapV2ChainId, SushiSwapV2ChainId, computePairAddress } from '@sushiswap/v2-sdk'
import { Pair } from "@sushiswap/amm"
import { useMemo } from 'react'
import { Address, useContractReads } from 'wagmi'

import { uniswapV2PairAbi } from '../abis'

type UseContractReadsConfig = Parameters<typeof useContractReads>['0']

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function getPairs(
  chainId: SushiSwapV2ChainId | undefined,
  currencies: [Currency | undefined, Currency | undefined][]
) {
  const filtered = currencies.filter((currencies): currencies is [Type, Type] => {
    const [currencyA, currencyB] = currencies
    return Boolean(
      currencyA &&
        currencyB &&
        currencyA.chainId === currencyB.chainId &&
        !currencyA.wrapped.equals(currencyB.wrapped) &&
        isSushiSwapV2ChainId(currencyA.chainId)
    )
  })

  const [tokensA, tokensB] = filtered.reduce<[Token[], Token[]]>(
    (acc, [currencyA, currencyB]) => {
      acc[0].push(currencyA.wrapped)
      acc[1].push(currencyB.wrapped)

      return acc
    },
    [[], []]
  )

  const contracts = filtered.map(([currencyA, currencyB]) => ({
    chainId,
    address: computePairAddress({
      factoryAddress: SUSHISWAP_V2_FACTORY_ADDRESS[currencyA.chainId as SushiSwapV2ChainId],
      tokenA: currencyA.wrapped,
      tokenB: currencyB.wrapped,
    }) as Address,
    abi: uniswapV2PairAbi,
    functionName: 'getReserves' as const,
  }))

  return [tokensA, tokensB, contracts] as const
}

interface UsePairsReturn {
  isLoading: boolean
  isError: boolean
  data: [PairState, Pair | null][]
}

export function usePairs(
  chainId: SushiSwapV2ChainId | undefined,
  currencies: [Currency | undefined, Currency | undefined][],
  config?: Omit<NonNullable<UseContractReadsConfig>, 'contracts'>
): UsePairsReturn {
  const [tokensA, tokensB, contracts] = useMemo(() => getPairs(chainId, currencies), [chainId, currencies])

  const { data, isLoading, isError } = useContractReads({
    contracts: contracts,
    enabled: config?.enabled !== undefined ? config.enabled && contracts.length > 0 : contracts.length > 0,
    watch: !(typeof config?.enabled !== undefined && !config?.enabled),
  })
  return useMemo(() => {
    if (contracts.length === 0) return { isLoading, isError, data: [[PairState.INVALID, null]] }
    if (!data)
      return {
        isLoading,
        isError,
        data: contracts.map(() => [PairState.LOADING, null]),
      }

    return {
      isLoading,
      isError,
      data: data.map((result, i) => {
        const tokenA = tokensA[i]
        const tokenB = tokensB[i]
        if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
        if (!result) return [PairState.NOT_EXISTS, null]
        const [reserve0, reserve1] = result
        const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
        return [
          PairState.EXISTS,
          new Pair(
            Amount.fromRawAmount(token0, reserve0.toString()),
            Amount.fromRawAmount(token1, reserve1.toString())
          ),
        ]
      }),
    }
  }, [contracts, data, isError, isLoading, tokensA, tokensB])
}

interface UsePairReturn {
  isLoading: boolean
  isError: boolean
  data: [PairState, Pair | null]
}

export function usePair(
  chainId: SushiSwapV2ChainId,
  tokenA?: Currency,
  tokenB?: Currency,
  config?: Omit<UseContractReadsConfig, 'contracts'>
): UsePairReturn {
  const inputs: [[Currency | undefined, Currency | undefined]] = useMemo(() => [[tokenA, tokenB]], [tokenA, tokenB])
  const { data, isLoading, isError } = usePairs(chainId, inputs, config)

  return useMemo(
    () => ({
      isLoading,
      isError,
      data: data?.[0],
    }),
    [data, isError, isLoading]
  )
}
