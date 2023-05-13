import { isAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { bentoBoxV1Abi } from '@sushiswap/abi'
import { isBentoBoxV1ChainId } from '@sushiswap/bentobox'
import { ChainId, chainName } from '@sushiswap/chain'
import { Amount, Native, Token, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { JSBI, ZERO } from '@sushiswap/math'
import { getBentoBoxContractConfig } from '../useBentoBoxContract'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { Address, erc20ABI, useBalance as useWagmiBalance, useContractReads } from 'wagmi'

import { BalanceMap } from './types'

type UseBalancesParams = {
  account: string | undefined
  currencies: (Type | undefined)[]
  chainId?: number
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
      currencies.reduce<[Token[], string[][]]>(
        (acc, currencies) => {
          if (chainId && currencies && isAddress(currencies.wrapped.address)) {
            acc[0].push(currencies.wrapped)
            acc[1].push([currencies.wrapped.address])
          }

          return acc
        },
        [[], []]
      ),
    [chainId, currencies]
  )

  const contracts = useMemo(() => {
    const input = validatedTokenAddresses.map((token) => {
      return {
        chainId,
        address: token[0] as Address,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [account],
      }
    })

    if (loadBentobox && chainId) {
      if (!isBentoBoxV1ChainId(chainId)) {
        throw new Error(
          `ChainId Error: BentoBox is not available on ${chainName[chainId]} and loadBentobox is enabled.`
        )
      }

      const totals = validatedTokenAddresses.map((token) => ({
        chainId,
        ...getBentoBoxContractConfig(chainId),
        abi: bentoBoxV1Abi,
        functionName: 'totals',
        args: token,
      }))

      const balanceInputs = validatedTokenAddresses.map((token, i) => ({
        chainId,
        ...getBentoBoxContractConfig(chainId),
        abi: bentoBoxV1Abi,
        functionName: 'balanceOf',
        args: [validatedTokenAddresses[i][0], account],
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
        const { base, elastic } = data[i + validatedTokenAddresses.length] as unknown as {
          base: BigNumber
          elastic: BigNumber
        }
        if (base && elastic && data[i + 2 * validatedTokenAddresses.length]) {
          const rebase = {
            base: JSBI.BigInt(base.toString()),
            elastic: JSBI.BigInt(elastic.toString()),
          }
          const amount = Amount.fromShare(
            validatedTokens[i],
            (data[i + 2 * validatedTokenAddresses.length] as unknown as BigNumber).toString(),
            rebase
          )

          result[validatedTokens[i].address] = {
            [FundSource.BENTOBOX]: amount.greaterThan(ZERO) ? amount : Amount.fromRawAmount(validatedTokens[i], '0'),
            [FundSource.WALLET]: Amount.fromRawAmount(validatedTokens[i], '0'),
          }
        } else {
          result[validatedTokens[i].address] = {
            [FundSource.BENTOBOX]: Amount.fromRawAmount(validatedTokens[i], '0'),
            [FundSource.WALLET]: Amount.fromRawAmount(validatedTokens[i], '0'),
          }
        }
      }

      const value = data[i] as unknown as BigNumber
      const amount = value ? JSBI.BigInt(value.toString()) : undefined
      if (!result[validatedTokens[i].address]) {
        result[validatedTokens[i].address] = {
          [FundSource.BENTOBOX]: Amount.fromRawAmount(validatedTokens[i], '0'),
          [FundSource.WALLET]: Amount.fromRawAmount(validatedTokens[i], '0'),
        }
      }

      if (amount)
        result[validatedTokens[i].address][FundSource.WALLET] = Amount.fromRawAmount(validatedTokens[i], amount)
      else result[validatedTokens[i].address][FundSource.WALLET] = Amount.fromRawAmount(validatedTokens[i], '0')
    }

    return result
  }, [contracts.length, data, loadBentobox, validatedTokenAddresses.length, validatedTokens])

  return useMemo(() => {
    tokens[AddressZero] = {
      [FundSource.WALLET]:
        chainId && nativeBalance?.value
          ? Amount.fromRawAmount(Native.onChain(chainId), nativeBalance.value.toString())
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
  }, [tokens, chainId, nativeBalance?.value, isLoading, isNativeLoading, isError, isNativeError])
}

type UseBalanceParams = {
  account: string | undefined
  currency: Type | undefined
  chainId?: ChainId
  enabled?: boolean
  loadBentobox?: boolean
  watch?: boolean
}

type UseBalance = (params: UseBalanceParams) => Pick<ReturnType<typeof useBalances>, 'isError' | 'isLoading'> & {
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
      ? data?.[currency.isNative ? AddressZero : currency.wrapped.address]?.[FundSource.WALLET]
      : undefined
    const bentoBalance = currency
      ? data?.[currency.isNative ? AddressZero : currency.wrapped.address]?.[FundSource.BENTOBOX]
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
