import { useMultipleContractSingleData } from '../lib/hooks/multicall'
import { isAddress } from '@ethersproject/address'
import { useMemo } from 'react'
import { Amount, Token } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import { erc20ABI } from 'wagmi'
import { Interface } from '@ethersproject/abi'

const tokenBalancesGasRequirement = { gasRequired: 125_000 }
const ERC20Interface = new Interface(erc20ABI)

type LoadingState<T> = { isLoading: true; isError: boolean; data?: T }
type SuccessState<T> = { isLoading: false; isError: boolean; data: T }
type ErrorState<T> = { isLoading: false; isError: true; data?: T }

type UseTokenWalletBalances = (
  account: string | undefined,
  tokens: (Token | undefined)[],
) =>
  | SuccessState<Record<string, Amount<Token>>>
  | LoadingState<Record<string, Amount<Token>>>
  | ErrorState<Record<string, Amount<Token>>>

export const useTokenWalletBalances: UseTokenWalletBalances = (account, tokens) => {
  const [validatedTokens, validatedTokenAddresses] = useMemo(
    () =>
      tokens.reduce<[Token[], string[]]>(
        (acc, token) => {
          if (token?.address && isAddress(token.address)) {
            acc[0].push(token)
            acc[1].push(token?.address)
          }

          return acc
        },
        [[], []],
      ),
    [tokens],
  )

  // Wallet Balances
  const balances = useMultipleContractSingleData(
    validatedTokenAddresses,
    ERC20Interface,
    'balanceOf',
    useMemo(() => [account], [account]),
    tokenBalancesGasRequirement,
  )

  const [anyLoading, anyError] = useMemo(() => {
    let anyLoading = false
    let anyError = false

    for (const callState of balances) {
      if (callState.loading) anyLoading = true
      if (callState.error) anyError = true
      if (!anyLoading && !anyError) break
    }

    return [anyLoading, anyError]
  }, [balances])

  return useMemo(() => {
    const data =
      account && validatedTokens.length > 0
        ? validatedTokens.reduce<Record<string, Amount<Token>>>((acc, token, i) => {
            const value = balances?.[i]?.result?.[0]
            const amount = value ? JSBI.BigInt(value.toString()) : undefined
            if (amount) acc[token.address] = Amount.fromRawAmount(token, amount)
            return acc
          }, {})
        : undefined

    if (anyLoading) return { isLoading: true, isError: false, data } as LoadingState<Record<string, Amount<Token>>>
    if (!anyLoading && anyError)
      return { isLoading: false, isError: true, data } as ErrorState<Record<string, Amount<Token>>>

    return {
      isLoading: false,
      isError: false,
      data,
    } as SuccessState<Record<string, Amount<Token>>>
  }, [account, anyError, anyLoading, balances, validatedTokens])
}

type UseTokenWalletBalance = (
  account: string | undefined,
  token: Token | undefined,
) => SuccessState<Amount<Token>> | LoadingState<Amount<Token>> | ErrorState<Amount<Token>>

export const useTokenWalletBalance: UseTokenWalletBalance = (account, token) => {
  const { isError, isLoading, data } = useTokenWalletBalances(account, [token])

  if (isLoading) return { isLoading: true, isError: false, data: undefined } as LoadingState<Amount<Token>>
  if (!isLoading && isError) return { isLoading: false, isError: true, data: undefined } as ErrorState<Amount<Token>>

  return {
    isLoading: false,
    isError: false,
    data: token ? data[token.address] : undefined,
  } as SuccessState<Amount<Token>>
}
