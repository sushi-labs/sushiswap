'use client'

import { useRouter } from 'next/navigation'
import {
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
  createContext,
  useContext,
  useMemo,
} from 'react'
import { z } from 'zod'

import { parseArgs } from 'src/lib/functions'
import { useTypedSearchParams } from 'src/lib/hooks'

type FilterContext = z.TypeOf<typeof academySearchSchema>

const FilterContext = createContext<FilterContext | undefined>(undefined)

export type AcademySearch = Omit<FilterContext, 'setFilters'>

interface AcademySearchProvider {
  children?: ReactNode
  passedFilters?: Partial<AcademySearch>
}

const academySearchSchema = z.object({
  search: z
    .string()
    .optional()
    .transform((search) => search || undefined),
  category: z
    .string()
    .optional()
    .transform((search) => search || undefined),
  difficulty: z
    .string()
    .optional()
    .transform((search) => search || undefined),
  sorting: z
    .string()
    .optional()
    .transform((search) => search || undefined),
})

export const AcademySearchProvider: FC<AcademySearchProvider> = ({
  children,
}) => {
  const urlFilters = useTypedSearchParams(academySearchSchema.partial())
  const { search, category, difficulty, sorting } = urlFilters

  return (
    <FilterContext.Provider
      value={useMemo(
        () => ({
          search: search,
          category: category,
          difficulty: difficulty,
          sorting: sorting,
        }),
        [search, category, difficulty, sorting],
      )}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const useAcademySearch = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('Hook can only be used inside Filter Context')
  }

  return context
}

export const useSetAcademySearch = () => {
  const { push } = useRouter()
  const urlFilters = useTypedSearchParams(academySearchSchema)

  const setFilters: Dispatch<SetStateAction<typeof urlFilters>> = (filters) => {
    if (typeof filters === 'function') {
      void push(parseArgs(filters(urlFilters)), { scroll: false })
    } else {
      void push(parseArgs(filters), { scroll: false })
    }
  }

  return setFilters
}
