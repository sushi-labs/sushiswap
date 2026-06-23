'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Fraction, withoutScientificNotation } from 'sushi'
import { type EvmAddress, type EvmChainId, isEvmChainId } from 'sushi/evm'
import type { StellarChainId, StellarContractAddress } from 'sushi/stellar'
import { type SvmAddress, type SvmChainId, isSvmChainId } from 'sushi/svm'
import { parseUnits } from 'viem'
import { usePriceProvider } from './price-provider'
import type { PriceChainId, PriceRequestChainId } from './types'

export type PriceMap<TChainId extends PriceChainId = EvmChainId> = {
  has: (address: ContractAddressFor<TChainId>) => boolean
  get: (address: ContractAddressFor<TChainId>) => number | undefined
  getFraction: (address: ContractAddressFor<TChainId>) => Fraction | undefined
}

type UsePricesResult<TChainId extends PriceChainId = EvmChainId> = {
  data: PriceMap<TChainId> | undefined
  lastModified: number
  isLoading: boolean
  isUpdating: boolean
  isError: boolean
}

const disabledData = {
  data: undefined,
  lastModified: 0,
  isLoading: false,
  isUpdating: false,
  isError: false,
}

function translateAddress<TChainId extends PriceChainId>(
  chainId: TChainId,
  address: ContractAddressFor<TChainId>,
): TChainId extends EvmChainId ? bigint : ContractAddressFor<TChainId> {
  if (isEvmChainId(chainId)) {
    // EVM prices use binary payloads keyed by bigint-encoded addresses.
    return BigInt(address as EvmAddress) as any
  }

  // Non-EVM prices use JSON payloads keyed by string addresses.
  return address as any
}

export function usePrices<TChainId extends PriceChainId>({
  chainId,
  enabled = true,
}: {
  chainId: TChainId | undefined
  enabled?: boolean
}): UsePricesResult<TChainId> {
  // Important to use state, not state.chains directly, as the reference to state.chains won't be changing and the component won't re-render
  // It's not best practice, but it's controlled here in the hook and not exposed
  const { state, mutate } = usePriceProvider()
  const requestedRef = useRef<Set<ContractAddressFor<TChainId>>>(new Set())

  useEffect(() => {
    if (state.ready && chainId && enabled) {
      mutate.incrementChainId(chainId)
    }

    return () => {
      if (state.ready && chainId && enabled) {
        mutate.decrementChainId(chainId)
      }
    }
  }, [chainId, enabled, mutate, state.ready])

  useEffect(() => {
    void chainId
    requestedRef.current.clear()
  }, [chainId])

  const chain = useMemo(
    () => (chainId ? state.chains.get(chainId) : undefined),
    [state, chainId],
  )

  return useMemo(() => {
    if (!chainId) {
      return disabledData
    }

    if (!chain)
      return {
        data: undefined,
        lastModified: 0,
        isLoading: true,
        isUpdating: false,
        isError: false,
      }

    if (!chain.priceMap)
      return {
        data: undefined,
        lastModified: chain.lastModified,
        isLoading: chain.isLoading,
        isUpdating: chain.isUpdating,
        isError: chain.isError,
      }

    const data: PriceMap<TChainId> = {
      has: (_address: ContractAddressFor<TChainId>) => {
        const address = translateAddress(chainId, _address)

        const hasPrice = chain.priceMap!.has(address)
        if (!hasPrice) requestMissingPrice(chainId, _address)

        return hasPrice
      },
      get: (_address: ContractAddressFor<TChainId>) => {
        const address = translateAddress(chainId, _address)

        const price = chain.priceMap!.get(address)
        if (price === undefined) requestMissingPrice(chainId, _address)
        return price
      },

      getFraction: (_address: ContractAddressFor<TChainId>) => {
        const address = translateAddress(chainId, _address)

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
        requestMissingPrice(chainId, _address)
        return undefined
      },
    }

    function requestMissingPrice(
      chainId: TChainId,
      address: ContractAddressFor<TChainId>,
    ) {
      if (!isSvmChainId(chainId)) return

      const requestAddress = address as ContractAddressFor<TChainId>
      if (requestedRef.current.has(requestAddress)) return

      requestedRef.current.add(requestAddress)
      mutate.requestPrices(chainId as PriceRequestChainId, [requestAddress])
    }

    return {
      data,
      lastModified: chain.lastModified,
      isLoading: chain.isLoading,
      isUpdating: chain.isUpdating,
      isError: chain.isError,
    }
  }, [chainId, chain, mutate])
}
