'use client'

import { XMarkIcon } from '@heroicons/react/24/solid'
import { Button } from '@sushiswap/ui'
import React, { FC, useCallback, useMemo, useState, useTransition } from 'react'

import { BONDS_ENABLED_CHAIN_IDS } from '@sushiswap/bonds-sdk'
import {
  useBondPositionsFilters,
  useSetBondPositionsFilters,
} from './bonds-positions-filters-provider'

export const PositionsTableFiltersResetButton: FC = () => {
  const [isPending, startTransition] = useTransition()
  const {
    chainIds,
    onlyUnredeemed,
    // payoutAssets,
  } = useBondPositionsFilters()
  const { setFilters } = useSetBondPositionsFilters()

  const networks = useMemo(
    () => (BONDS_ENABLED_CHAIN_IDS.length === chainIds?.length ? [] : chainIds),
    [chainIds],
  )

  const [show, setShow] = useState(
    (networks?.length ?? 0) || // +
      // (payoutAssets?.length ?? 0) >
      // 0 ||
      onlyUnredeemed === false,
  )

  const reset = useCallback(() => {
    setShow(false)
    startTransition(() => {
      setFilters({
        chainIds: undefined,
        // payoutAssets: undefined,
        onlyUnredeemed: undefined,
      })
    })
  }, [setFilters])

  if (
    isPending
      ? show
      : (networks?.length ?? 0) || // +
        //   (payoutAssets?.length ?? 0) >
        //   0 ||
        onlyUnredeemed === false
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
