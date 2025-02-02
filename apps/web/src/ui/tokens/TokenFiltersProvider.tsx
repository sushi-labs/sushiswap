'use client'

import { useRouter } from 'next/navigation'
import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
} from 'react'
import { z } from 'zod'

import { parseArgs } from 'src/lib/functions'
import { useTypedSearchParams } from '../../lib/hooks'

type FilterContext = z.TypeOf<typeof poolFiltersSchema>

const FilterContext = createContext<FilterContext | undefined>(undefined)

export type TokenFilters = Omit<FilterContext, 'setFilters'>

interface TokenFiltersProvider {
  children?: ReactNode
  passedFilters?: Partial<TokenFilters>
}

export const poolFiltersSchema = z.object({
  tokenSymbols: z.coerce.string().transform((symbols) => {
    return symbols.split(',').filter((symbol) => symbol !== '')
  }),
})

export const TokenFiltersProvider: FC<TokenFiltersProvider> = ({
  children,
}) => {
  const urlFilters = useTypedSearchParams(poolFiltersSchema.partial())
  const { tokenSymbols } = urlFilters

  return (
    <FilterContext.Provider
      value={useMemo(
        () => ({
          tokenSymbols: tokenSymbols ? tokenSymbols : [],
        }),
        [tokenSymbols],
      )}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const useTokenFilters = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('Hook can only be used inside Filter Context')
  }

  return context
}

export const useSetTokenFilters = () => {
  const { push } = useRouter()
  const urlFilters = useTypedSearchParams(poolFiltersSchema.partial())

  const setFilters: Dispatch<SetStateAction<typeof urlFilters>> = (filters) => {
    if (typeof filters === 'function') {
      void push(parseArgs(filters(urlFilters)))
    } else {
      void push(parseArgs(filters))
    }
  }

  return setFilters
}
