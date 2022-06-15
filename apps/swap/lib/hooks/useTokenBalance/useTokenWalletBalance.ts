import { Interface } from '@ethersproject/abi'
import { isAddress } from '@ethersproject/address'
import { Amount, Token } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import { useMemo } from 'react'
import { erc20ABI, useBlockNumber } from 'wagmi'

import { useMultipleContractSingleData } from '../../state/multicall'
import { ErrorState, LoadingState, SuccessState, UseTokenBalance, UseTokenBalances } from './types'

const tokenBalancesGasRequirement = { gasRequired: 125_000 }
const ERC20Interface = new Interface(erc20ABI)

export const useTokenWalletBalances: UseTokenBalances = (chainId, account, tokens) => {
  const { data: latestBlockNumber } = useBlockNumber({ chainId })
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
        [[], []]
      ),
    [tokens]
  )

  // Wallet Balances
  const balances = useMultipleContractSingleData(
    chainId,
    latestBlockNumber,
    validatedTokenAddresses,
    ERC20Interface,
    'balanceOf',
    useMemo(() => [account], [account]),
    tokenBalancesGasRequirement
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
            else acc[token.address] = Amount.fromRawAmount(token, '0')

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

export const useTokenWalletBalance: UseTokenBalance = (chainId, account, token) => {
  const tokens = useMemo(() => [token], [token])
  const { isError, isLoading, data } = useTokenWalletBalances(chainId, account, tokens)

  return useMemo(() => {
    if (isLoading) return { isLoading: true, isError: false, data: undefined } as LoadingState<Amount<Token>>
    if (!isLoading && isError) return { isLoading: false, isError: true, data: undefined } as ErrorState<Amount<Token>>

    return {
      isLoading: false,
      isError: false,
      data: data && token && token.address in data ? data[token.address] : undefined,
      // data: token ? data[token.address] : undefined,
    } as SuccessState<Amount<Token>>
  }, [data, isError, isLoading, token])
}
