'use client'

import { FundSource } from '@sushiswap/hooks'
import { useMemo } from 'react'
import { bentoBoxV1Abi } from 'sushi/abi'
import { ChainId, chainName } from 'sushi/chain'
import { isBentoBoxChainId } from 'sushi/config'
import { Amount, Native, Token, Type } from 'sushi/currency'
import { isAddress } from 'viem'
import { zeroAddress } from 'viem'
import {
  Address,
  erc20ABI,
  useBalance as useWagmiBalance,
  useContractReads,
} from 'wagmi'

import { getBentoBoxContractConfig } from '../useBentoBoxContract'
import { BalanceMap } from './types'

type UseBalancesParams = {
  account: Address | undefined
  currencies: (Type | undefined)[]
  chainId?: ChainId
  enabled?: boolean
  loadBentobox?: boolean
  watch?: boolean
}

type UseBalances = (params: UseBalancesParams) => (
  | Pick<ReturnType<typeof useContractReads>, 'isError' | 'isLoading'>
  | Pick<ReturnType<typeof useWagmiBalance>, 'isError' | 'isLoading'>
) & {
  data: BalanceMap
}

/**
 * @deprecated  use @sushiswap/wagmi/future/hooks/balances/useBalances
 */
export const useBalances: UseBalances = ({
  watch = true,
  enabled = true,
  chainId,
  account,
  currencies,
  loadBentobox = false,
}) => {
  const {
    data: nativeBalance,
    isLoading: isNativeLoading,
    isError: isNativeError,
  } = useWagmiBalance({
    address: account as Address,
    chainId,
    enabled,
    watch: !(typeof enabled !== 'undefined' && !enabled) && watch,
  })

  const [validatedTokens, validatedTokenAddresses] = useMemo(
    () =>
      currencies.reduce<[Token[], string[]]>(
        (acc, currencies) => {
          if (chainId && currencies && isAddress(currencies.wrapped.address)) {
            acc[0].push(currencies.wrapped)
            acc[1].push(currencies.wrapped.address as Address)
          }

          return acc
        },
        [[], []],
      ),
    [chainId, currencies],
  )

  const contracts = useMemo(() => {
    if (!account) return []

    const input = validatedTokenAddresses.map((token) => {
      return {
        chainId,
        address: token as Address,
        abi: erc20ABI,
        functionName: 'balanceOf' as const,
        args: [account] as const,
      }
    })

    if (loadBentobox && chainId) {
      if (!isBentoBoxChainId(chainId)) {
        throw new Error(
          `ChainId Error: BentoBox is not available on ${chainName[chainId]} and loadBentobox is enabled.`,
        )
      }

      const totals = validatedTokenAddresses.map((token) => ({
        chainId,
        ...getBentoBoxContractConfig(chainId),
        abi: bentoBoxV1Abi,
        functionName: 'totals' as const,
        args: [token] as const,
      }))

      const balanceInputs = validatedTokenAddresses.map((_token, i) => ({
        chainId,
        ...getBentoBoxContractConfig(chainId),
        abi: bentoBoxV1Abi,
        functionName: 'balanceOf' as const,
        args: [validatedTokenAddresses[i], account] as const,
      }))

      return [...input, ...totals, ...balanceInputs]
    }

    return input
  }, [validatedTokenAddresses, loadBentobox, chainId, account])

  const { data, isError, isLoading } = useContractReads({
    contracts,
    enabled,
    watch: !(typeof enabled !== 'undefined' && !enabled) && watch,
  })
  const tokens: BalanceMap = useMemo(() => {
    const result: BalanceMap = {}

    if (data?.length !== contracts.length) return result
    for (let i = 0; i < validatedTokenAddresses.length; i++) {
      if (loadBentobox) {
        const { base, elastic } = data[i + validatedTokenAddresses.length]
          .result as unknown as {
          base: bigint
          elastic: bigint
        }
        if (
          base &&
          elastic &&
          data[i + 2 * validatedTokenAddresses.length].result
        ) {
          const rebase = {
            base: base,
            elastic: elastic,
          }
          const amount = Amount.fromShare(
            validatedTokens[i],
            data[i + 2 * validatedTokenAddresses.length].result as bigint,
            rebase,
          )

          result[validatedTokens[i].address] = {
            [FundSource.BENTOBOX]: amount.greaterThan(0n)
              ? amount
              : Amount.fromRawAmount(validatedTokens[i], '0'),
            [FundSource.WALLET]: Amount.fromRawAmount(validatedTokens[i], '0'),
          }
        } else {
          result[validatedTokens[i].address] = {
            [FundSource.BENTOBOX]: Amount.fromRawAmount(
              validatedTokens[i],
              '0',
            ),
            [FundSource.WALLET]: Amount.fromRawAmount(validatedTokens[i], '0'),
          }
        }
      }

      const value = data[i]?.result as bigint | undefined
      const amount = value ?? undefined

      if (!result[validatedTokens[i].address]) {
        result[validatedTokens[i].address] = {
          [FundSource.BENTOBOX]: Amount.fromRawAmount(validatedTokens[i], '0'),
          [FundSource.WALLET]: Amount.fromRawAmount(validatedTokens[i], '0'),
        }
      }

      if (amount)
        result[validatedTokens[i].address][FundSource.WALLET] =
          Amount.fromRawAmount(validatedTokens[i], amount)
      else
        result[validatedTokens[i].address][FundSource.WALLET] =
          Amount.fromRawAmount(validatedTokens[i], '0')
    }

    return result
  }, [
    contracts.length,
    data,
    loadBentobox,
    validatedTokenAddresses.length,
    validatedTokens,
  ])

  return useMemo(() => {
    tokens[zeroAddress] = {
      [FundSource.WALLET]:
        chainId && nativeBalance?.value
          ? Amount.fromRawAmount(
              Native.onChain(chainId),
              nativeBalance.value.toString(),
            )
          : undefined,
      [FundSource.BENTOBOX]:
        chainId && tokens[Native.onChain(chainId).wrapped.address]
          ? tokens[Native.onChain(chainId).wrapped.address][FundSource.BENTOBOX]
          : undefined,
    }

    return {
      data: tokens,
      isLoading: isLoading || isNativeLoading,
      isError: isError || isNativeError,
    }
  }, [
    tokens,
    chainId,
    nativeBalance,
    isLoading,
    isNativeLoading,
    isError,
    isNativeError,
  ])
}

type UseBalanceParams = {
  account: Address | undefined
  currency: Type | undefined
  chainId?: ChainId
  enabled?: boolean
  loadBentobox?: boolean
  watch?: boolean
}

type UseBalance = (params: UseBalanceParams) => Pick<
  ReturnType<typeof useBalances>,
  'isError' | 'isLoading'
> & {
  data: Record<FundSource, Amount<Type>> | undefined
}

export const useBalance: UseBalance = ({
  watch = true,
  chainId,
  account,
  currency,
  enabled = true,
  loadBentobox = false,
}) => {
  const currencies = useMemo(() => [currency], [currency])
  const { data, isLoading, isError } = useBalances({
    watch,
    chainId,
    currencies,
    account,
    enabled,
    loadBentobox,
  })
  return useMemo(() => {
    const walletBalance = currency
      ? data?.[currency.isNative ? zeroAddress : currency.wrapped.address]?.[
          FundSource.WALLET
        ]
      : undefined
    const bentoBalance = currency
      ? data?.[currency.isNative ? zeroAddress : currency.wrapped.address]?.[
          FundSource.BENTOBOX
        ]
      : undefined
    return {
      isError: isError,
      isLoading: isLoading,
      data:
        walletBalance && bentoBalance
          ? {
              [FundSource.WALLET]: walletBalance,
              [FundSource.BENTOBOX]: bentoBalance,
            }
          : undefined,
    }
  }, [isError, isLoading, currency, data])
}
