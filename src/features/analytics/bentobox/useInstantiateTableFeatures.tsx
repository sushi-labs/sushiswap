import { TableInstance } from 'app/features/transactions/types'
import { useAppSelector } from 'app/state/hooks'
import { selectTokens } from 'app/state/tokens/slice'
import { useMemo } from 'react'

const useInstantiateFilters = (setFilter: TableInstance['setFilter']) => {
  const { searchQuery } = useAppSelector(selectTokens)
  useMemo(() => setFilter('token', { searchQuery }), [searchQuery, setFilter])
}

export const useInstantiateTableFeatures = (setFilter: TableInstance['setFilter']) => {
  useInstantiateFilters(setFilter)
}
