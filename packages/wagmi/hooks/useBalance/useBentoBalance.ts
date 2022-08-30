import { isAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { Amount, Native, Token, Type } from '@sushiswap/currency'
import { JSBI, ZERO } from '@sushiswap/math'
import { useMemo } from 'react'
import { useContractReads } from 'wagmi'

import { getBentoBoxContractConfig } from '../useBentoBoxContract'

type UseBentoBalancesParams = {
  account: string | undefined
  currencies: (Type | undefined)[]
  chainId?: ChainId
  enabled?: boolean
}

type UseBentoBalances = (params: UseBentoBalancesParams) => Pick<
  ReturnType<typeof useContractReads>,
  'isError' | 'isLoading'
> & {
  data: Record<string, Amount<Type>> | undefined
}

const abi = [
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    name: 'totals',
    outputs: [
      {
        internalType: 'uint128',
        name: 'elastic',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'base',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

export const useBentoBalances: UseBentoBalances = ({ account, currencies, chainId, enabled = true }) => {
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
    enabled,
    cacheOnBlock: true,
    keepPreviousData: true,
    isDataEqual: (prev, next) => {
      return prev?.findIndex((el, idx) => next[idx].toString() !== el.toString()) === -1
    },
  })

  const [tokensWithTotal, baseTotals, balanceInputs] = useMemo(
    () =>
      totals && !totalsError && !totalsLoading && validatedTokens.length === totals.length
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
    enabled,
    cacheOnBlock: true,
    keepPreviousData: true,
    isDataEqual: (prev, next) => {
      return prev?.findIndex((el, idx) => next[idx].toString() !== el.toString()) === -1
    },
  })

  const tokens: Record<string, Amount<Type>> | undefined = useMemo(() => {
    return balances
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
  }, [balances, baseTotals, tokensWithTotal])

  return useMemo(() => {
    if (tokens && chainId && tokens?.[Native.onChain(chainId).wrapped.address]) {
      tokens[AddressZero] = tokens[Native.onChain(chainId).wrapped.address]
    }

    return {
      data: tokens,
      isLoading: balancesLoading ?? totalsLoading,
      isError: balancesError ?? totalsError,
    }
  }, [tokens, chainId, balancesLoading, totalsLoading, balancesError, totalsError])
}

type UseBentoBalanceParams = {
  account: string | undefined
  currency: Type | undefined
  chainId?: ChainId
}

type UseBentoBalance = (params: UseBentoBalanceParams) => Pick<
  ReturnType<typeof useContractReads>,
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
