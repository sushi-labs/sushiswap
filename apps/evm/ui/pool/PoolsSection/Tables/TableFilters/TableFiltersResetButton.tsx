import { XMarkIcon } from '@heroicons/react/24/solid'
import { Button } from '@sushiswap/ui'
import React, { FC, useCallback, useMemo } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../../../../../config'
import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { POOL_TYPES } from './TableFiltersPoolType'

export const TableFiltersResetButton: FC = () => {
  const { protocols, chainIds, tokenSymbols, farmsOnly, setFilters } = usePoolFilters()

  const networks = useMemo(() => (SUPPORTED_CHAIN_IDS.length === chainIds.length ? [] : chainIds), [chainIds])
  const types = useMemo(() => (protocols.length === POOL_TYPES.length ? [] : protocols), [protocols])

  const reset = useCallback(() => {
    setFilters({
      protocols: [],
      chainIds: [],
      tokenSymbols: [],
      farmsOnly: false,
    })
  }, [setFilters])

  if ((types?.length ?? 0) + (networks?.length ?? 0) + (tokenSymbols?.length ?? 0) > 0 || farmsOnly) {
    return (
      <Button onClick={reset} icon={XMarkIcon} iconPosition="end" variant="ghost" size="sm">
        Reset
      </Button>
    )
  }

  return null
}
