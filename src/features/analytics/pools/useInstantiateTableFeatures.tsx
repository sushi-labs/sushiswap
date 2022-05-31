import { TableInstance } from 'app/features/transactions/types'
import { useAppSelector } from 'app/state/hooks'
import { selectPools } from 'app/state/pools/slice'
import { useMemo } from 'react'

const useInstantiateFilters = (setFilter: TableInstance['setFilter']) => {
  const { searchQuery } = useAppSelector(selectPools)
  useMemo(() => setFilter('pair', { searchQuery }), [searchQuery, setFilter])
}

export const useInstantiateTableFeatures = (setFilter: TableInstance['setFilter']) => {
  useInstantiateFilters(setFilter)
}
