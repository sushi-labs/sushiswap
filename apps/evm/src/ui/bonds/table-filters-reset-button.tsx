'use client'

import { XMarkIcon } from '@heroicons/react/24/solid'
import { Button } from '@sushiswap/ui'
import React, { FC, useCallback, useMemo, useState, useTransition } from 'react'

import { BONDS_ENABLED_CHAIN_IDS } from '../../config'
import { useBondFilters, useSetBondFilters } from './bonds-filters-provider'
import { AUCTION_TYPES } from './table-filters-auction-type'

export const TableFiltersResetButton: FC = () => {
  const [isPending, startTransition] = useTransition()
  const {
    auctionTypes,
    chainIds,
    positiveDiscountsOnly,
    payoutAssets,
    bondAssets,
  } = useBondFilters()
  const setFilters = useSetBondFilters()

  const networks = useMemo(
    () => (BONDS_ENABLED_CHAIN_IDS.length === chainIds.length ? [] : chainIds),
    [chainIds],
  )

  const types = useMemo(
    () => (auctionTypes.length === AUCTION_TYPES.length ? [] : auctionTypes),
    [auctionTypes],
  )

  const [show, setShow] = useState(
    (types?.length ?? 0) +
      (networks?.length ?? 0) +
      (payoutAssets?.length ?? 0) >
      0 ||
      (bondAssets?.length ?? 0) > 0 ||
      positiveDiscountsOnly,
  )

  const reset = useCallback(() => {
    setShow(false)
    startTransition(() => {
      setFilters({
        auctionTypes: undefined,
        chainIds: undefined,
        payoutAssets: undefined,
        bondAssets: undefined,
        positiveDiscountsOnly: undefined,
      })
    })
  }, [setFilters])

  if (
    isPending
      ? show
      : (types?.length ?? 0) +
          (networks?.length ?? 0) +
          (payoutAssets?.length ?? 0) >
          0 ||
        (bondAssets?.length ?? 0) > 0 ||
        positiveDiscountsOnly
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
