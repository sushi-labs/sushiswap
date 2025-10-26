'use client'

import { useEffect, useMemo } from 'react'
import { Fraction, withoutScientificNotation } from 'sushi'
import type { EvmAddress, EvmChainId, EvmCurrency } from 'sushi/evm'
import { parseUnits } from 'viem'
import { usePriceProvider } from './price-provider'
import type { ProviderChainState } from './types'
import type { PriceMap } from './use-prices'

export function useMultiChainPrices({
  chainIds,
  enabled = true,
}: { chainIds: readonly EvmChainId[] | undefined; enabled?: boolean }) {
  // Important to use state, not state.chains directly, as the reference to state.chains won't be changing and the component won't re-render
  // It's not best practice, but it's controlled here in the hook and not exposed
  const { state, mutate } = usePriceProvider()

  useEffect(() => {
    if (state.ready && chainIds && enabled) {
      chainIds.forEach((id) => mutate.incrementChainId(id))
    }

    return () => {
      if (state.ready && chainIds && enabled) {
        chainIds.forEach((id) => mutate.decrementChainId(id))
      }
    }
  }, [chainIds, enabled, mutate, state.ready])

  const chains = useMemo(() => {
    return (chainIds ?? []).reduce(
      (map, chainId) => {
        map[chainId] = state.chains.get(chainId)
        return map
      },
      {} as Record<EvmChainId, ProviderChainState | undefined>,
    )
  }, [state, chainIds])

  return useMemo(() => {
    const data = new Map<EvmChainId, PriceMap | undefined>()
    let lastModified = 0
    let isLoading = false
    let isUpdating = false
    let isError = false

    if (!enabled) {
      return {
        data,
        lastModified,
        isLoading,
        isUpdating,
        isError,
      }
    }

    for (const id of chainIds ?? []) {
      const chain = chains[id]

      lastModified = Math.max(lastModified, chain?.lastModified ?? 0)
      isLoading = isLoading || (chain?.isLoading ?? true)
      isUpdating = isUpdating || (chain?.isUpdating ?? false)
      isError = isError || (chain?.isError ?? false)

      if (chain?.priceMap) {
        data.set(id, {
          has: (_address: EvmAddress) => {
            const address = BigInt(_address)

            return chain.priceMap!.has(address)
          },
          get: (_address: EvmAddress) => {
            const address = BigInt(_address)

            const price = chain.priceMap!.get(address)
            return price
          },

          getForToken: (token: EvmCurrency) => {
            const address = BigInt(token.wrap().address)

            const price = chain.priceMap!.get(address)
            return price
          },

          getFraction: (_address: EvmAddress) => {
            const address = BigInt(_address)

            const price = chain.priceMap!.get(address)
            if (price) {
              return new Fraction({
                numerator: parseUnits(
                  withoutScientificNotation(String(price)) || '0',
                  18,
                ).toString(),
                denominator: parseUnits('1', 18).toString(),
              })
            }
            return undefined
          },
        })
      }
    }

    return { data, lastModified, isLoading, isUpdating, isError }
  }, [chainIds, chains, enabled])
}
