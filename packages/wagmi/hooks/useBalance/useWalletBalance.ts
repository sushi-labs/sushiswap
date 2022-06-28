import { isAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { Amount, Native, Token, Type } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import { useMemo } from 'react'
import { erc20ABI, useBalance, useContractInfiniteReads } from 'wagmi'

type UseWalletBalancesParams = {
  account: string | undefined
  tokens: Token[]
  chainId?: ChainId
}

type UseWalletBalances = (params: UseWalletBalancesParams) => Pick<
  ReturnType<typeof useContractInfiniteReads>,
  'isError' | 'isLoading'
> & {
  data: Record<string, Amount<Type>> | undefined
}

export const useWalletBalances: UseWalletBalances = ({ account, tokens, chainId }) => {
  const {
    data: nativeBalance,
    isLoading: isNativeLoading,
    error: isNativeError,
  } = useBalance({ addressOrName: account })

  const [validatedTokens, validatedTokenAddresses] = useMemo(
    () =>
      tokens.reduce<[Token[], string[]]>(
        (acc, currency) => {
          if (currency?.wrapped.address && isAddress(currency.wrapped.address)) {
            acc[0].push(currency.wrapped)
            acc[1].push(currency.wrapped.address)
          }

          return acc
        },
        [[], []]
      ),
    [tokens]
  )

  const contracts = useMemo(
    () =>
      validatedTokenAddresses.map((token) => ({
        addressOrName: token.toLowerCase(),
        contractInterface: erc20ABI,
        functionName: 'balanceOf',
        args: [account],
      })),
    [validatedTokens]
  )

  // Wallet Balances
  const {
    data,
    isError: isTokensError,
    isLoading: isTokensLoading,
  } = useContractInfiniteReads({
    cacheKey: 'tokenBalances',
    contracts: () => contracts,
  })

  return useMemo(() => {
    const _data =
      data && account && validatedTokens.length > 0
        ? validatedTokens.reduce<Record<string, Amount<Token>>>((acc, token, i) => {
            const value = data.pages[0][i]
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
      isError: isTokensError ?? isNativeError,
    }
  }, [account, data, validatedTokens])
}

type UseWalletBalanceParams = {
  account: string | undefined
  token: Token
  chainId?: ChainId
}

type UseTokenBalance = (params: UseWalletBalanceParams) => Pick<
  ReturnType<typeof useContractInfiniteReads>,
  'isError' | 'isLoading'
> & {
  data: Record<string, Amount<Type>> | undefined
}

export const useWalletBalance: UseTokenBalance = ({ account, token, chainId }) => {
  const tokens = useMemo(() => [token], [token])
  return useWalletBalances({ account, tokens, chainId })
}
