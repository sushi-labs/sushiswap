'use client'

import { XMarkIcon } from '@heroicons/react/24/solid'
import { Button } from '@sushiswap/ui'
import React, { FC, useCallback, useMemo, useState, useTransition } from 'react'

import { AuctionTypes, BONDS_ENABLED_CHAIN_IDS } from '@sushiswap/bonds-sdk'
import { useBondFilters, useSetBondFilters } from './bonds-filters-provider'

export const TableFiltersResetButton: FC = () => {
  const [isPending, startTransition] = useTransition()
  const {
    auctionTypes,
    chainIds,
    onlyDiscounted,
    onlyOpen,
    // payoutAssets,
    // bondAssets,
  } = useBondFilters()
  const { setFilters } = useSetBondFilters()

  const networks = useMemo(
    () => (BONDS_ENABLED_CHAIN_IDS.length === chainIds?.length ? [] : chainIds),
    [chainIds],
  )

  const types = useMemo(
    () => (auctionTypes?.length === AuctionTypes.length ? [] : auctionTypes),
    [auctionTypes],
  )

  const [show, setShow] = useState(
    (types?.length ?? 0) + (networks?.length ?? 0) || // +
      // (payoutAssets?.length ?? 0) >
      // 0 ||
      // (bondAssets?.length ?? 0) > 0 ||
      onlyDiscounted ||
      onlyOpen === false,
  )

  const reset = useCallback(() => {
    setShow(false)
    startTransition(() => {
      setFilters({
        auctionTypes: undefined,
        chainIds: undefined,
        // payoutAssets: undefined,
        // bondAssets: undefined,
        onlyDiscounted: undefined,
        onlyOpen: undefined,
      })
    })
  }, [setFilters])

  if (
    isPending
      ? show
      : (types?.length ?? 0) + (networks?.length ?? 0) || // +
        //   (payoutAssets?.length ?? 0) >
        //   0 ||
        // (bondAssets?.length ?? 0) > 0 ||
        onlyDiscounted ||
        onlyOpen === false
  ) {
    return (
      <Button
        onClick={reset}
        icon={XMarkIcon}
        iconPosition="end"
        variant="outline"
        size="sm"
      >
        Reset
      </Button>
    )
  }

  return null
}
