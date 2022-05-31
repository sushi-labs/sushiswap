import { TableInstance } from 'app/features/transactions/types'
import { selectTridentPools } from 'app/features/trident/pools/poolsSlice'
import { sortTitleMapper } from 'app/features/trident/pools/SearchResultPools'
import { useAppSelector } from 'app/state/hooks'
import { useLayoutEffect, useMemo } from 'react'

const useInstantiateFilters = (setFilter: TableInstance['setFilter']) => {
  const { searchQuery, showTWAPOnly, feeTiers: feeTiersSelected } = useAppSelector(selectTridentPools)
  useMemo(() => setFilter('assets', { searchQuery, twapEnabled: showTWAPOnly }), [searchQuery, setFilter, showTWAPOnly])
  useMemo(() => setFilter('swapFee', { feeTiersSelected }), [feeTiersSelected, setFilter])
}

// @ts-ignore TYPE NEEDS FIXING
export const useInstantiateSorting = (toggleSortBy) => {
  const { sort } = useAppSelector(selectTridentPools)

  // Call sort toggle function of table if sort in RTK changes
  useLayoutEffect(() => {
    toggleSortBy(sortTitleMapper[sort], true)
  }, [sort, toggleSortBy])
}

export const useInstantiateTableFeatures = (
  setFilter: TableInstance['setFilter'],
  toggleSortBy: TableInstance['toggleSortBy']
) => {
  useInstantiateFilters(setFilter)
  useInstantiateSorting(toggleSortBy)
}
