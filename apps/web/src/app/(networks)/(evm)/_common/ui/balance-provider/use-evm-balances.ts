import { useEffect, useMemo } from 'react'
import type { EvmChainId } from 'sushi/evm'
import type { Address } from 'viem'
import { useBalanceProvider } from './balance-provider'
import type { UseBalancesReturn } from './types'
import { isBalanceStaleWhileRevalidate } from './utils'

export function useEvmBalances(
  chainId: EvmChainId | undefined,
  tokenAddresses: Address[] | undefined,
): UseBalancesReturn<EvmChainId> {
  const { state, mutate } = useBalanceProvider()

  useEffect(() => {
    if (!chainId || !tokenAddresses) {
      return
    }

    const tokenIds = tokenAddresses.map((address) => ({ address, chainId }))

    mutate.incrementToken(tokenIds)

    return () => {
      mutate.decrementToken(tokenIds)
    }
  }, [chainId, tokenAddresses, mutate.incrementToken, mutate.decrementToken])

  return useMemo(() => {
    if (!chainId || !tokenAddresses) {
      return {
        data: undefined,
        isError: false,
        isLoading: false,
        isFetching: false,
      }
    }

    const chain = state.chains.get(chainId)

    if (!chain) {
      return {
        data: undefined,
        isError: false,
        isLoading: false,
        isFetching: false,
      }
    }

    const balanceMap = new Map<Address, bigint>()

    tokenAddresses.forEach((address) => {
      const balance = chain.balanceMap.get(address)

      if (!balance) {
        return
      }

      if (isBalanceStaleWhileRevalidate(balance)) {
        return
      }

      balanceMap.set(address, balance.amount)
    })

    // If we don't have all the requested balances, return undefined
    if (balanceMap.size !== tokenAddresses.length) {
      return {
        data: undefined,
        isError: false,
        isLoading: chain.isFetching,
        isFetching: chain.isFetching,
      }
    }

    let isError = false
    for (const address of tokenAddresses) {
      if (balanceMap.get(address)! < 0n) {
        balanceMap.delete(address)
        isError = true
      }
    }

    return {
      data: balanceMap as ReadonlyMap<Address, bigint>,
      isError,
      isLoading: false,
      isFetching: chain.isFetching,
    }
  }, [chainId, tokenAddresses, state])
}
