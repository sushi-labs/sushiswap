import { AddressZero } from '@ethersproject/constants'
import { Amount, Token } from '@sushiswap/currency'
import furoExports from '@sushiswap/furo/exports.json'
import { JSBI } from '@sushiswap/math'
import { BENTOBOX_ADDRESS, useBentoBoxContract, useBlockNumber, useContractRead } from '@sushiswap/wagmi'
import { ListenerOptions } from '@uniswap/redux-multicall/dist/types'
import BENTOBOX_ABI from 'abis/bentobox.json'
import FURO_STREAM_ABI from 'abis/FuroStream.json'
import { ErrorState, LoadingState, SuccessState } from 'hooks/types'
import { useFuroStreamContract } from 'hooks/useFuroStreamContract'
import { useSingleContractMultipleData } from 'lib/state/multicall'
import { useMemo } from 'react'

export function useStreamBalance(chainId?: number, streamId?: string, token?: Token): Amount<Token> | undefined {
  console.log(chainId, streamId, token)
  const {
    data: balance,
    error: balanceError,
    isLoading: balanceLoading,
  } = useContractRead(
    {
      chainId,
      addressOrName: chainId ? (furoExports as any)[chainId]?.[0].contracts.FuroStream.address : AddressZero,
      contractInterface: FURO_STREAM_ABI,
    },
    'streamBalanceOf',
    { enabled: !!streamId, args: [streamId], watch: true }
  )

  const {
    data: rebase,
    error: rebaseError,
    isLoading: rebaseLoading,
  } = useContractRead(
    {
      chainId,
      addressOrName: chainId ? BENTOBOX_ADDRESS[chainId] : AddressZero,
      contractInterface: BENTOBOX_ABI,
    },
    'totals',
    { enabled: !!token?.address, args: [token?.address], watch: true }
  )

  console.log(
    {
      addressOrName: chainId ? (furoExports as any)[chainId]?.[0].contracts.FuroStream.address : AddressZero,
      contractInterface: FURO_STREAM_ABI,
      chainId,
    },
    {
      addressOrName: chainId ? BENTOBOX_ADDRESS[chainId] : AddressZero,
      contractInterface: BENTOBOX_ABI,
      chainId,
    }
  )

  return useMemo(() => {
    if (balanceError || rebaseError || balanceLoading || rebaseLoading || !balance || !rebase || !streamId || !token)
      return undefined

    return Amount.fromShare(token, JSBI.BigInt(balance[1]), {
      base: JSBI.BigInt(rebase[0]),
      elastic: JSBI.BigInt(rebase[1]),
    })
  }, [balanceError, rebaseError, balanceLoading, rebaseLoading, balance, streamId, token, rebase])
}

export type UseStreamBalances = (
  chainId: number,
  streamIds: [string][],
  tokens: Token[],
  options?: ListenerOptions
) =>
  | SuccessState<Record<string, Amount<Token>>>
  | LoadingState<Record<string, Amount<Token>>>
  | ErrorState<Record<string, Amount<Token>>>

export const useStreamBalances: UseStreamBalances = (chainId, streamIds, tokens, options) => {
  const furo = useFuroStreamContract(chainId)
  const bento = useBentoBoxContract(chainId)

  const { data: latestBlockNumber } = useBlockNumber({ chainId })

  const balances = useSingleContractMultipleData(
    chainId,
    latestBlockNumber,
    furo,
    'streamBalanceOf',
    streamIds,
    options
  )
  const totals = useSingleContractMultipleData(
    chainId,
    latestBlockNumber,
    bento,
    'totals',
    tokens.map((el) => [el.address]),
    options
  )

  const [anyLoading, anyError] = useMemo(() => {
    let anyLoading = false
    let anyError = false

    for (let i = 0; i < balances.length; i++) {
      if (balances[i].loading || totals[i].loading) anyLoading = true
      if (balances[i].error || totals[i].error) anyError = true
      if (!anyLoading && !anyError) break
    }

    return [anyLoading, anyError]
  }, [balances, totals])

  return useMemo(() => {
    const data = streamIds.reduce<Record<string, Amount<Token>>>((acc, streamId, index) => {
      const balance = balances?.[index]?.result?.[1]
      const base = totals?.[index]?.result?.[0]
      const elastic = totals?.[index]?.result?.[1]

      acc[streamId[0]] =
        balance && base && elastic
          ? Amount.fromShare(tokens[index], JSBI.BigInt(balance), {
              base: JSBI.BigInt(base),
              elastic: JSBI.BigInt(elastic),
            })
          : Amount.fromRawAmount(tokens[index], '0')

      return acc
    }, {})

    if (anyLoading) return { isLoading: true, isError: false, data } as LoadingState<Record<string, Amount<Token>>>
    if (!anyLoading && anyError)
      return { isLoading: false, isError: true, data } as ErrorState<Record<string, Amount<Token>>>

    return {
      isLoading: false,
      isError: false,
      data,
    } as SuccessState<Record<string, Amount<Token>>>
  }, [anyError, anyLoading, balances, streamIds, tokens, totals])
}
