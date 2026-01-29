'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Fraction, withoutScientificNotation } from 'sushi'
import { type EvmAddress, type EvmChainId, isEvmChainId } from 'sushi/evm'
import { type SvmAddress, type SvmChainId, isSvmChainId } from 'sushi/svm'
import { parseUnits } from 'viem'
import { usePriceProvider } from './price-provider'

export type PriceMap<TChainId extends EvmChainId | SvmChainId = EvmChainId> = {
  has: (address: AddressFor<TChainId>) => boolean
  get: (address: AddressFor<TChainId>) => number | undefined
  getFraction: (address: AddressFor<TChainId>) => Fraction | undefined
}

type UsePricesResult<TChainId extends EvmChainId | SvmChainId> = {
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

function translateAddress<TChainId extends EvmChainId | SvmChainId>(
  chainId: TChainId,
  address: AddressFor<TChainId>,
) {
  if (isSvmChainId(chainId)) {
    // Solana addresses are strings, the API returns only JSON for SVM chains
    return address
  } else {
    // EVM addresses are bigints, the API returns binary data for EVM chains
    return BigInt(address)
  }
}

export function usePrices<TChainId extends EvmChainId | SvmChainId>({
  chainId,
  enabled = true,
}: {
  chainId: TChainId | undefined
  enabled?: boolean
}): UsePricesResult<TChainId> {
  // Important to use state, not state.chains directly, as the reference to state.chains won't be changing and the component won't re-render
  // It's not best practice, but it's controlled here in the hook and not exposed
  const { state, mutate } = usePriceProvider()
  const requestedRef = useRef<Set<SvmAddress>>(new Set())

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
      has: (_address: AddressFor<TChainId>) => {
        const address = translateAddress(chainId, _address)

        const hasPrice = chain.priceMap!.has(address)
        if (!hasPrice && isSvmChainId(chainId)) {
          const svmAddress = _address as SvmAddress
          if (!requestedRef.current.has(svmAddress)) {
            requestedRef.current.add(svmAddress)
            mutate.requestPrices(chainId, [svmAddress])
          }
        }

        return hasPrice
      },
      get: (_address: AddressFor<TChainId>) => {
        const address = translateAddress(chainId, _address)

        const price = chain.priceMap!.get(address)
        if (price === undefined && isSvmChainId(chainId)) {
          const svmAddress = _address as SvmAddress
          if (!requestedRef.current.has(svmAddress)) {
            requestedRef.current.add(svmAddress)
            mutate.requestPrices(chainId, [svmAddress])
          }
        }
        return price
      },

      getFraction: (_address: AddressFor<TChainId>) => {
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
        if (isSvmChainId(chainId)) {
          const svmAddress = _address as SvmAddress
          if (!requestedRef.current.has(svmAddress)) {
            requestedRef.current.add(svmAddress)
            mutate.requestPrices(chainId, [svmAddress])
          }
        }
        return undefined
      },
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
