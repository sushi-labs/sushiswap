import { Interface } from '@ethersproject/abi'
import { Amount, Type as Currency } from '@sushiswap/currency'
import { computePairAddress, FACTORY_ADDRESS, Pair } from '@sushiswap/exchange'
import IUniswapV2PairArtifact from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { useMultipleContractSingleData } from 'lib/state/multicall'
import { useMemo } from 'react'
import { useBlockNumber } from 'wagmi'

const PAIR_INTERFACE = new Interface(IUniswapV2PairArtifact.abi)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePairs(
  chainId: number,
  currencies: [Currency | undefined, Currency | undefined][]
): [PairState, Pair | null][] {
  const { data: latestBlockNumber } = useBlockNumber({ chainId })
  const tokens = useMemo(
    () => currencies.map(([currencyA, currencyB]) => [currencyA?.wrapped, currencyB?.wrapped]),
    [currencies]
  )

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        return tokenA &&
          tokenB &&
          tokenA.chainId === tokenB.chainId &&
          !tokenA.equals(tokenB) &&
          FACTORY_ADDRESS[tokenA.chainId]
          ? computePairAddress({ factoryAddress: FACTORY_ADDRESS[tokenA.chainId], tokenA, tokenB })
          : undefined
      }),
    [tokens]
  )

  const results = useMultipleContractSingleData(
    chainId,
    latestBlockNumber,
    pairAddresses,
    PAIR_INTERFACE,
    'getReserves'
  )

  // console.log('USE PAIRS', chainId, latestBlockNumber, pairAddresses, results)

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = tokens[i][0]
      const tokenB = tokens[i][1]
      if (loading) return [PairState.LOADING, null]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
      if (!reserves) return [PairState.NOT_EXISTS, null]
      const { reserve0, reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [
        PairState.EXISTS,
        new Pair(Amount.fromRawAmount(token0, reserve0.toString()), Amount.fromRawAmount(token1, reserve1.toString())),
      ]
    })
  }, [results, tokens])
}

export function usePair(chainId: number, tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  const inputs: [[Currency | undefined, Currency | undefined]] = useMemo(() => [[tokenA, tokenB]], [tokenA, tokenB])
  return usePairs(chainId, inputs)[0]
}
