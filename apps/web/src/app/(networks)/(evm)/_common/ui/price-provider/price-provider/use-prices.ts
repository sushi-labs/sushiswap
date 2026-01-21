'use client'

import { useEffect, useMemo } from 'react'
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

function useEvmPrices({
  chainId,
  enabled = true,
}: { chainId: EvmChainId | undefined; enabled?: boolean }) {
  // Important to use state, not state.chains directly, as the reference to state.chains won't be changing and the component won't re-render
  // It's not best practice, but it's controlled here in the hook and not exposed
  const { state, mutate } = usePriceProvider()

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

    const data: PriceMap = {
      has: (_address: EvmAddress) => {
        const address = BigInt(_address)

        return chain.priceMap!.has(address)
      },
      get: (_address: EvmAddress) => {
        const address = BigInt(_address)

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
    }

    return {
      data,
      lastModified: chain.lastModified,
      isLoading: chain.isLoading,
      isUpdating: chain.isUpdating,
      isError: chain.isError,
    }
  }, [chainId, chain])
}

function useSvmPrices({
  chainId,
  enabled = true,
}: { chainId: SvmChainId | undefined; enabled?: boolean }) {
  const { state, mutate } = usePriceProvider()

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

    const data: PriceMap = {
      has: (_address: SvmAddress) => {
        return chain.priceMap!.has(_address)
      },
      get: (_address: SvmAddress) => {
        const price = chain.priceMap!.get(_address)
        return price
      },

      getFraction: (_address: SvmAddress) => {
        const price = chain.priceMap!.get(_address)
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
    }

    return {
      data,
      lastModified: chain.lastModified,
      isLoading: chain.isLoading,
      isUpdating: chain.isUpdating,
      isError: chain.isError,
    }
  }, [chainId, chain])
}

export function usePrices<TChainId extends EvmChainId | SvmChainId>({
  chainId,
  enabled = true,
}: {
  chainId: TChainId | undefined
  enabled?: boolean
}): UsePricesResult<TChainId> {
  const evmChainId = chainId && isEvmChainId(chainId) ? chainId : undefined
  const svmChainId = chainId && isSvmChainId(chainId) ? chainId : undefined

  const evmPrices = useEvmPrices({
    chainId: evmChainId,
    enabled: Boolean(enabled && evmChainId),
  })

  const svmPrices = useSvmPrices({
    chainId: svmChainId,
    enabled: Boolean(enabled && svmChainId),
  })

  return useMemo(() => {
    if (evmChainId) {
      return evmPrices as UsePricesResult<typeof evmChainId>
    } else if (svmChainId) {
      return svmPrices as UsePricesResult<typeof svmChainId>
    }

    return disabledData
  }, [evmChainId, evmPrices, svmChainId, svmPrices])
}
