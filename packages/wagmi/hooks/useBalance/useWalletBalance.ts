import { isAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { Amount, Native, Token, Type } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import { useMemo } from 'react'
import { useBalance, useContractReads } from 'wagmi'

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

const abi = [
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
]

export const useWalletBalances: UseWalletBalances = ({ account, currencies, chainId, enabled = true }) => {
  const {
    data: nativeBalance,
    isLoading: isNativeLoading,
    error: isNativeError,
  } = useBalance({
    addressOrName: account,
    chainId,
    enabled,
    keepPreviousData: true,
  })

  const [validatedTokens, validatedTokenAddresses] = useMemo(() => {
    return currencies.reduce<[Token[], string[]]>(
      (acc, currency) => {
        if (currency?.wrapped.address && isAddress(currency.wrapped.address)) {
          acc[0].push(currency.wrapped)
          acc[1].push(currency.wrapped.address)
        }

        return acc
      },
      [[], []]
    )
  }, [currencies])

  const contracts = useMemo(
    () =>
      validatedTokenAddresses.map((token) => ({
        chainId,
        addressOrName: token,
        contractInterface: abi,
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
    enabled: Boolean(account && validatedTokenAddresses.length > 0) && enabled,
    cacheOnBlock: true,
    keepPreviousData: true,
    isDataEqual: (prev, next) => {
      return prev?.findIndex((el, idx) => next[idx].toString() !== el.toString()) === -1
    },
  })

  const tokens: Record<string, Amount<Type>> | undefined = useMemo(() => {
    return data && account && validatedTokens.length > 0
      ? validatedTokens.reduce<Record<string, Amount<Token>>>((acc, token, i) => {
          const value = data[i]
          const amount = value ? JSBI.BigInt(value.toString()) : undefined
          if (amount) acc[token.address] = Amount.fromRawAmount(token, amount)
          else acc[token.address] = Amount.fromRawAmount(token, '0')

          return acc
        }, {})
      : undefined
  }, [account, data, validatedTokens])

  return useMemo(() => {
    if (tokens && chainId && nativeBalance?.value) {
      tokens[AddressZero] = Amount.fromRawAmount(Native.onChain(chainId), nativeBalance.value.toString())
    }

    return {
      data: tokens,
      isLoading: isTokensLoading ?? isNativeLoading,
      isError: Boolean(isTokensError ?? isNativeError),
    }
  }, [tokens, chainId, nativeBalance?.value, isTokensLoading, isNativeLoading, isTokensError, isNativeError])
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
