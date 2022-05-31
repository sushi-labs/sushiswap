import { TableInstance } from 'app/features/transactions/types'
import { selectFarms } from 'app/state/farms/slice'
import { useAppSelector } from 'app/state/hooks'
import { useMemo } from 'react'

const useInstantiateFilters = (setFilter: TableInstance['setFilter']) => {
  const { searchQuery } = useAppSelector(selectFarms)
  useMemo(() => setFilter('pair', { searchQuery }), [searchQuery, setFilter])
}

export const useInstantiateTableFeatures = (setFilter: TableInstance['setFilter']) => {
  useInstantiateFilters(setFilter)
}
