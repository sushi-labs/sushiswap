import { Interface } from '@ethersproject/abi'
import { Amount, Type as Currency, Type } from '@sushiswap/currency'
import { computePairAddress, FACTORY_ADDRESS, Pair } from '@sushiswap/exchange'
import IUniswapV2PairArtifact from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { useMemo } from 'react'
import { useContractReads } from 'wagmi'

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
  const tokens = useMemo(
    () =>
      currencies
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
        .map(([currencyA, currencyB]) => [currencyA.wrapped, currencyB.wrapped]),
    [currencies]
  )

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        // console.log('computePairAddress', { factoryAddress: FACTORY_ADDRESS[tokenA.chainId], tokenA, tokenB })
        return computePairAddress({ factoryAddress: FACTORY_ADDRESS[tokenA.chainId], tokenA, tokenB })
      }),
    [tokens]
  )

  const { data } = useContractReads({
    contracts: pairAddresses.map((addressOrName) => ({
      chainId,
      addressOrName,
      contractInterface: PAIR_INTERFACE,
      functionName: 'getReserves',
    })),
    enabled: pairAddresses.length > 0,
  })

  console.log({ chainId, data })
  return useMemo(() => {
    if (!data) return pairAddresses.map(() => [PairState.LOADING, null])
    return data.map((result, i) => {
      const tokenA = tokens[i][0]
      const tokenB = tokens[i][1]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
      if (!result) return [PairState.NOT_EXISTS, null]
      const [reserve0, reserve1] = result
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [
        PairState.EXISTS,
        new Pair(Amount.fromRawAmount(token0, reserve0.toString()), Amount.fromRawAmount(token1, reserve1.toString())),
      ]
    })
  }, [data, pairAddresses, tokens])
}

export function usePair(chainId: number, tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  const inputs: [[Currency | undefined, Currency | undefined]] = useMemo(() => [[tokenA, tokenB]], [tokenA, tokenB])
  return usePairs(chainId, inputs)[0]
}
