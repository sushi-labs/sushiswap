import { isAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { Amount, Native, Token, Type } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import { useMemo } from 'react'
import { erc20ABI, useBalance, useContractReads } from 'wagmi'

type UseWalletBalancesParams = {
  account: string | undefined
  currencies: (Type | undefined)[]
  chainId?: ChainId
  enabled?: boolean
}

type UseWalletBalances = (params: UseWalletBalancesParams) => (
  | Pick<ReturnType<typeof useContractReads>, 'isError' | 'isLoading'>
  | Pick<ReturnType<typeof useBalance>, 'isError' | 'isLoading'>
) & {
  data: Record<string, Amount<Type>> | undefined
}

export const useWalletBalances: UseWalletBalances = ({ account, currencies, chainId, enabled = true }) => {
  const {
    data: nativeBalance,
    isLoading: isNativeLoading,
    error: isNativeError,
  } = useBalance({ watch: true, addressOrName: account, chainId, enabled })

  const [validatedTokens, validatedTokenAddresses] = useMemo(
    () =>
      currencies.reduce<[Token[], string[]]>(
        (acc, currency) => {
          if (currency?.wrapped.address && isAddress(currency.wrapped.address)) {
            acc[0].push(currency.wrapped)
            acc[1].push(currency.wrapped.address)
          }

          return acc
        },
        [[], []]
      ),
    [currencies]
  )

  const contracts = useMemo(
    () =>
      validatedTokenAddresses.map((token) => ({
        chainId,
        addressOrName: token,
        contractInterface: erc20ABI,
        functionName: 'balanceOf',
        args: [account],
      })),
    [validatedTokenAddresses, chainId, account]
  )

  // Wallet Balances
  const {
    data,
    isError: isTokensError,
    isLoading: isTokensLoading,
  } = useContractReads({
    contracts,
    enabled: Boolean(account && validatedTokenAddresses.length) && enabled,
    watch: true,
  })

  return useMemo(() => {
    const _data =
      data && account && validatedTokens.length > 0
        ? validatedTokens.reduce<Record<string, Amount<Token>>>((acc, token, i) => {
            const value = data[i]
            const amount = value ? JSBI.BigInt(value.toString()) : undefined
            if (amount) acc[token.address] = Amount.fromRawAmount(token, amount)
            else acc[token.address] = Amount.fromRawAmount(token, '0')

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
      isLoading: isTokensLoading ?? isNativeLoading,
      isError: Boolean(isTokensError ?? isNativeError),
    }
  }, [
    account,
    data,
    validatedTokens,
    isTokensLoading,
    isNativeLoading,
    isTokensError,
    isNativeError,
    chainId,
    nativeBalance,
  ])
}

type UseWalletBalanceParams = {
  account: string | undefined
  currency: Type | undefined
  chainId?: ChainId
}

type UseTokenBalance = (params: UseWalletBalanceParams) => (
  | Pick<ReturnType<typeof useContractReads>, 'isError' | 'isLoading'>
  | Pick<ReturnType<typeof useBalance>, 'isError' | 'isLoading'>
) & {
  data: Record<string, Amount<Type>> | undefined
}

export const useWalletBalance: UseTokenBalance = ({ chainId, currency, account }) => {
  return useWalletBalances(useMemo(() => ({ chainId, currencies: [currency], account }), [chainId, currency, account]))
}
