'use client'

import { parseArgs } from '@sushiswap/client'
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

import { useTypedSearchParams } from 'src/lib/hooks'

type FilterContext = z.TypeOf<typeof academySearchSchema>

const FilterContext = createContext<FilterContext | undefined>(undefined)

export type AcademySearch = Omit<FilterContext, 'setFilters'>

interface AcademySearchProvider {
  children?: ReactNode
  passedFilters?: Partial<AcademySearch>
}

export const academySearchSchema = z.object({
  search: z
    .string()
    .optional()
    .transform((search) => search || undefined),
  categories: z
    .string()
    .optional()
    .transform((categories) =>
      categories && categories !== ',' ? categories.split(',') : undefined,
    ),
})

export const AcademySearchProvider: FC<AcademySearchProvider> = ({
  children,
}) => {
  const urlFilters = useTypedSearchParams(academySearchSchema.partial())
  const { search, categories } = urlFilters

  return (
    <FilterContext.Provider
      value={useMemo(
        () => ({
          search: search,
          categories: categories,
        }),
        [search, categories],
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
      void push(parseArgs(filters(urlFilters)))
    } else {
      void push(parseArgs(filters))
    }
  }

  return setFilters
}
