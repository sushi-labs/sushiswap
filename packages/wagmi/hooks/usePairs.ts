import { Interface } from '@ethersproject/abi'
import { computePairAddress, FACTORY_ADDRESS, Pair } from '@sushiswap/amm'
import { Amount, Token, Type as Currency, Type } from '@sushiswap/currency'
import IUniswapV2PairArtifact from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { useMemo } from 'react'
import { useContractReads } from 'wagmi'
import { UseContractReadsConfig } from 'wagmi/dist/declarations/src/hooks/contracts/useContractReads'

const PAIR_INTERFACE = new Interface(IUniswapV2PairArtifact.abi)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function getPairs(chainId: number | undefined, currencies: [Currency | undefined, Currency | undefined][]) {
  return currencies
    .filter((currencies): currencies is [Type, Type] => {
      const [currencyA, currencyB] = currencies
      return Boolean(
        currencyA &&
          currencyB &&
          currencyA.chainId === currencyB.chainId &&
          !currencyA.wrapped.equals(currencyB.wrapped) &&
          FACTORY_ADDRESS[currencyA.chainId]
      )
    })
    .reduce<[Token[], Token[], any[]]>(
      (acc, [currencyA, currencyB]) => {
        acc[0].push(currencyA.wrapped)
        acc[1].push(currencyB.wrapped)
        acc[2].push({
          chainId,
          addressOrName: computePairAddress({
            factoryAddress: FACTORY_ADDRESS[currencyA.chainId],
            tokenA: currencyA.wrapped,
            tokenB: currencyB.wrapped,
          }),
          contractInterface: PAIR_INTERFACE,
          functionName: 'getReserves',
        })
        return acc
      },
      [[], [], []]
    )
}

interface UsePairsReturn {
  isLoading: boolean
  isError: boolean
  data: [PairState, Pair | null][]
}

export function usePairs(
  chainId: number | undefined,
  currencies: [Currency | undefined, Currency | undefined][],
  config?: Omit<UseContractReadsConfig, 'contracts'>
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
  chainId: number,
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
