'use client'

import { useMemo } from 'react'
import type { PriceChainId } from './types'
import { usePrices } from './use-prices'

export function usePrice<TChainId extends PriceChainId>({
  chainId,
  address,
  enabled: _enabled = true,
}: {
  chainId: TChainId | undefined
  address: AddressFor<TChainId> | undefined
  enabled?: boolean
}) {
  const enabled = chainId && address && _enabled

  const prices = usePrices({
    chainId,
    enabled,
  })

  return useMemo(() => {
    const { data, ...rest } = prices

    const price = address ? data?.get(address) : undefined

    return {
      data: price,
      ...rest,
    }
  }, [address, prices])
}
