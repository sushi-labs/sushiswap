import { isAddress } from '@ethersproject/address'
import { ChainId } from '@sushiswap/chain'
import { Amount, Token, Type } from '@sushiswap/currency'
import { JSBI, ZERO } from '@sushiswap/math'
import { useMemo } from 'react'
import { useContractInfiniteReads } from 'wagmi'

import { getBentoBoxContractConfig } from '../useBentoBoxContract'

type UseBentoBalancesParams = {
  account: string | undefined
  tokens: Token[]
  chainId?: ChainId
}

type UseBentoBalances = (params: UseBentoBalancesParams) => Pick<
  ReturnType<typeof useContractInfiniteReads>,
  'isError' | 'isLoading'
> & {
  data: Record<string, Amount<Type>> | undefined
}

export const useBentoBalances: UseBentoBalances = ({ account, tokens, chainId }) => {
  const [validatedTokens, validatedTokenAddresses] = useMemo(
    () =>
      tokens.reduce<[Token[], string[][]]>(
        (acc, token) => {
          if (token && isAddress(token.address)) {
            acc[0].push(token)
            acc[1].push([token.address])
          }

          return acc
        },
        [[], []]
      ),
    [tokens]
  )

  const contractsForTotalsRequest = useMemo(
    () =>
      validatedTokenAddresses.map((token) => ({
        chainId,
        ...getBentoBoxContractConfig(chainId),
        functionName: 'totals',
        args: token,
      })),
    [validatedTokenAddresses, chainId]
  )

  const {
    data: totals,
    isError: totalsError,
    isLoading: totalsLoading,
  } = useContractInfiniteReads({
    cacheKey: 'bentoTotals',
    contracts: () => contractsForTotalsRequest,
  })

  const [tokensWithTotal, baseTotals, balanceInputs] = useMemo(
    () =>
      totals && !totalsError && !totalsLoading
        ? totals.pages[0].reduce<
            [
              Token[],
              {
                base: JSBI
                elastic: JSBI
              }[],
              string[][]
            ]
          >(
            (acc, el, i) => {
              if (account && !!el?.base && !!el?.elastic) {
                const { base, elastic } = el
                acc[0].push(validatedTokens[i])
                acc[1].push({ base: JSBI.BigInt(base), elastic: JSBI.BigInt(elastic) })
                acc[2].push([validatedTokenAddresses[i][0], account])
              }

              return acc
            },
            [[], [], []]
          )
        : [[], [], []],
    [account, totalsError, totalsLoading, totals, validatedTokenAddresses, validatedTokens]
  )

  const contractsForBalancesRequest = useMemo(
    () =>
      balanceInputs.map((input) => ({
        chainId,
        ...getBentoBoxContractConfig(chainId),
        functionName: 'balanceOf',
        args: input,
      })),
    [chainId, balanceInputs]
  )

  const {
    data: balances,
    isError: balancesError,
    isLoading: balancesLoading,
  } = useContractInfiniteReads({
    cacheKey: 'bentoBalances',
    contracts: () => contractsForBalancesRequest,
  })

  return useMemo(() => {
    const data = balances
      ? balances.pages[0].reduce<Record<string, Amount<Token>>>((acc, el, i) => {
          if (baseTotals[i] && tokensWithTotal[i] && el) {
            const amount = Amount.fromShare(tokensWithTotal[i], el, baseTotals[i])
            if (amount.greaterThan(ZERO)) {
              acc[tokensWithTotal[i].address] = amount
            } else {
              acc[tokensWithTotal[i].address] = Amount.fromRawAmount(tokensWithTotal[i], '0')
            }
          }

          return acc
        }, {})
      : undefined

    return {
      data,
      isLoading: balancesLoading || totalsLoading,
      isError: balancesError || totalsError,
    }
  }, [balancesLoading, totalsLoading, balancesError, totalsError, balances, baseTotals, tokensWithTotal])
}

type UseBentoBalanceParams = {
  account: string | undefined
  token: Token
  chainId?: ChainId
}

type UseBentoBalance = (params: UseBentoBalanceParams) => Pick<
  ReturnType<typeof useContractInfiniteReads>,
  'isError' | 'isLoading'
> & {
  data: Record<string, Amount<Type>> | undefined
}

export const useBentoBalance: UseBentoBalance = ({ account, token, chainId }) => {
  const tokens = useMemo(() => [token], [token])
  return useBentoBalances({ account, tokens, chainId })
}
