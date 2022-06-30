import { isAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { Amount, Native, Token, Type } from '@sushiswap/currency'
import { JSBI, ZERO } from '@sushiswap/math'
import { useMemo } from 'react'
import { useBalance, useContractInfiniteReads, useContractReads } from 'wagmi'

import { getBentoBoxContractConfig } from '../useBentoBoxContract'

type UseBentoBalancesParams = {
  account: string | undefined
  currencies: Type[]
  chainId?: ChainId
}

type UseBentoBalances = (params: UseBentoBalancesParams) => Pick<
  ReturnType<typeof useContractInfiniteReads>,
  'isError' | 'isLoading'
> & {
  data: Record<string, Amount<Type>> | undefined
}

export const useBentoBalances: UseBentoBalances = ({ account, currencies, chainId }) => {
  const {
    data: nativeBalance,
    isLoading: isNativeLoading,
    error: isNativeError,
  } = useBalance({ addressOrName: account, chainId })

  const [validatedTokens, validatedTokenAddresses] = useMemo(
    () =>
      currencies.reduce<[Token[], string[][]]>(
        (acc, currencies) => {
          if (currencies && isAddress(currencies.wrapped.address)) {
            acc[0].push(currencies.wrapped)
            acc[1].push([currencies.wrapped.address])
          }

          return acc
        },
        [[], []]
      ),
    [currencies]
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
  } = useContractReads({
    contracts: contractsForTotalsRequest,
    cacheTime: 20_000,
    keepPreviousData: true,
  })

  const [tokensWithTotal, baseTotals, balanceInputs] = useMemo(
    () =>
      totals && !totalsError && !totalsLoading
        ? totals.reduce<
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
  } = useContractReads({
    contracts: contractsForBalancesRequest,
    cacheTime: 20_000,
    keepPreviousData: true,
  })

  return useMemo(() => {
    const _data = balances
      ? balances.reduce<Record<string, Amount<Token>>>((acc, el, i) => {
          if (baseTotals[i] && tokensWithTotal[i] && el) {
            const amount = Amount.fromShare(tokensWithTotal[i], el.toString(), baseTotals[i])
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
      data: {
        ...(chainId &&
          nativeBalance?.value && {
            [AddressZero]: Amount.fromRawAmount(Native.onChain(chainId), nativeBalance.value.toString()),
          }),
        ..._data,
      },
      isLoading: balancesLoading ?? totalsLoading ?? isNativeLoading,
      isError: balancesError ?? totalsError ?? isNativeError,
    }
  }, [
    balances,
    chainId,
    nativeBalance?.value,
    balancesLoading,
    totalsLoading,
    isNativeLoading,
    balancesError,
    totalsError,
    isNativeError,
    baseTotals,
    tokensWithTotal,
  ])
}

type UseBentoBalanceParams = {
  account: string | undefined
  currency: Type
  chainId?: ChainId
}

type UseBentoBalance = (params: UseBentoBalanceParams) => Pick<
  ReturnType<typeof useContractInfiniteReads>,
  'isError' | 'isLoading'
> & {
  data: Record<string, Amount<Type>> | undefined
}

export const useBentoBalance: UseBentoBalance = (params) => {
  const _params = useMemo(
    () => ({ chainId: params.chainId, currencies: [params.currency], account: params.account }),
    [params.chainId, params.account, params.currency]
  )

  return useBentoBalances(_params)
}
