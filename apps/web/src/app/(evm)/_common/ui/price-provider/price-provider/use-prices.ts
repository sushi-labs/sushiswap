import { useEffect, useMemo } from 'react'
import { type Address, type ChainId } from 'sushi'
import { usePriceProvider } from './price-provider'

export function usePrices(chainId: ChainId) {
  const {
    state: { chains, ready },
    mutate,
  } = usePriceProvider()

  const chain = useMemo(() => chains.get(chainId), [chains, chainId])

  useEffect(() => {
    if (ready) {
      mutate.incrementChainId(chainId)
    }

    return () => {
      if (ready) {
        mutate.decrementChainId(chainId)
      }
    }
  }, [chainId, mutate, ready])

  return useMemo(() => {
    if (!chain)
      return {
        data: undefined,
        lastModified: 0,
        isLoading: true,
        isUpdating: false,
        isError: false,
      }

    if (!chain.priceData)
      return {
        data: undefined,
        lastModified: chain.lastModified,
        isLoading: chain.isLoading,
        isUpdating: chain.isUpdating,
        isError: chain.isError,
      }

    const data = {
      has: (_address: Address) => {
        const address = _address.toLowerCase()
        return chain.priceData!.hasAddress(address)
      },
      get: (address: Address) => {
        const price = chain.priceData!.priceOf(address)
        // if (price) {
        //   return new Fraction(
        //     parseUnits(String(price), 18).toString(),
        //     parseUnits('1', 18).toString(),
        //   )
        // }
        return price
      },
    }

    return {
      data,
      lastModified: chain.lastModified,
      isLoading: chain.isLoading,
      isUpdating: chain.isUpdating,
      isError: chain.isError,
    }
  }, [chain])
}
