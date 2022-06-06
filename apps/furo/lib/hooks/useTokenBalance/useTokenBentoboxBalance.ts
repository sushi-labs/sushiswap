import { isAddress } from '@ethersproject/address'
import { Amount, Token } from '@sushiswap/currency'
import { JSBI, ZERO } from '@sushiswap/math'
import { useBentoBoxContract } from '@sushiswap/wagmi'
import { ErrorState, LoadingState, SuccessState, UseTokenBalance, UseTokenBalances } from 'lib/hooks'
import { useMemo } from 'react'
import { useNetwork } from 'wagmi'

import { useSingleContractMultipleData } from '../multicall'

export const useTokenBentoboxBalances: UseTokenBalances = (account, tokens) => {
  const { activeChain } = useNetwork()
  const contract = useBentoBoxContract(activeChain?.id)

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

  const totals = useSingleContractMultipleData(contract, 'totals', validatedTokenAddresses)
  const [anyLoading, anyError] = useMemo(() => {
    let anyLoading = false
    let anyError = false

    for (const callState of totals) {
      if (callState.loading) anyLoading = true
      if (callState.error) anyError = true
      if (!anyLoading && !anyError) break
    }

    return [anyLoading, anyError]
  }, [totals])

  const [tokensWithTotal, baseTotals, balanceInput] = useMemo(
    () =>
      !anyLoading && !anyError
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
              if (account && el?.result && JSBI.greaterThan(JSBI.BigInt(el.result[0]), JSBI.BigInt(0))) {
                const { base, elastic } = el.result
                acc[0].push(validatedTokens[i])
                acc[1].push({ base: JSBI.BigInt(base), elastic: JSBI.BigInt(elastic) })
                acc[2].push([validatedTokenAddresses[i][0], account])
              }

              return acc
            },
            [[], [], []]
          )
        : [[], [], []],
    [account, anyError, anyLoading, totals, validatedTokenAddresses, validatedTokens]
  )

  const balances = useSingleContractMultipleData(contract, 'balanceOf', balanceInput)
  const [anyLoading2, anyError2] = useMemo(() => {
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
    const data = balances.reduce<Record<string, Amount<Token>>>((acc, el, i) => {
      if (baseTotals[i] && tokensWithTotal[i] && el.result?.[0]) {
        const amount = Amount.fromShare(tokensWithTotal[i], el.result[0], baseTotals[i])
        if (amount.greaterThan(ZERO)) {
          acc[tokensWithTotal[i].address] = amount
        } else {
          acc[tokensWithTotal[i].address] = Amount.fromRawAmount(tokensWithTotal[i], '0')
        }
      }

      return acc
    }, {})

    if (anyLoading || anyLoading2)
      return { isLoading: true, isError: false, data } as LoadingState<Record<string, Amount<Token>>>
    if ((!anyLoading && anyError) || (!anyLoading2 && anyError2))
      return { isLoading: false, isError: true, data } as ErrorState<Record<string, Amount<Token>>>

    return {
      isLoading: false,
      isError: false,
      data,
    } as SuccessState<Record<string, Amount<Token>>>
  }, [anyError, anyError2, anyLoading, anyLoading2, balances, baseTotals, tokensWithTotal])
}

export const useTokenBentoboxBalance: UseTokenBalance = (account, token) => {
  const tokens = useMemo(() => [token], [token])
  const { isError, isLoading, data } = useTokenBentoboxBalances(account, tokens)

  return useMemo(() => {
    if (isLoading) return { isLoading: true, isError: false, data: undefined } as LoadingState<Amount<Token>>
    if (!isLoading && isError) return { isLoading: false, isError: true, data: undefined } as ErrorState<Amount<Token>>

    return {
      isLoading: false,
      isError: false,
      data: token ? data[token.address] : undefined,
    } as SuccessState<Amount<Token>>
  }, [data, isError, isLoading, token])
}
