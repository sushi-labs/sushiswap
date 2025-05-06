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

type FilterContext = z.TypeOf<typeof blogSearchSchema>

const FilterContext = createContext<FilterContext | undefined>(undefined)

export type BlogSearch = Omit<FilterContext, 'setFilters'>

interface BlogSearchProvider {
  children?: ReactNode
  passedFilters?: Partial<BlogSearch>
}

export const blogSearchSchema = z.object({
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

export const BlogSearchProvider: FC<BlogSearchProvider> = ({ children }) => {
  const urlFilters = useTypedSearchParams(blogSearchSchema.partial())
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

export const useBlogSearch = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('Hook can only be used inside Filter Context')
  }

  return context
}

export const useSetBlogSearch = () => {
  const { push } = useRouter()
  const urlFilters = useTypedSearchParams(blogSearchSchema)

  const setFilters: Dispatch<SetStateAction<typeof urlFilters>> = (filters) => {
    if (typeof filters === 'function') {
      void push(parseArgs(filters(urlFilters)))
    } else {
      void push(parseArgs(filters))
    }
  }

  return setFilters
}
