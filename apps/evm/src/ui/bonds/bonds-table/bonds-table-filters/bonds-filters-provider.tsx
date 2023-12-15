'use client'

import { parseArgs } from '@sushiswap/client'
import { BondsApiSchema } from '@sushiswap/client/api'
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

import { useTypedSearchParams } from '../../../../lib/hooks'

type FilterContext = Partial<
  Pick<
    typeof BondsApiSchema._output,
    'auctionTypes' | 'chainIds' | 'onlyDiscounted' | 'onlyOpen'
  >
>

const FilterContext = createContext<FilterContext | undefined>(undefined)

export type BondFilters = Omit<FilterContext, 'setFilters'>

interface BondsFiltersProvider {
  children?: ReactNode
  passedFilters?: Partial<BondFilters>
}

export const BondsFiltersProvider: FC<BondsFiltersProvider> = ({
  children,
}) => {
  const urlFilters = useTypedSearchParams(BondsApiSchema.partial())
  const { auctionTypes, chainIds, onlyDiscounted, onlyOpen } = urlFilters

  return (
    <FilterContext.Provider
      value={useMemo(
        () => ({
          auctionTypes: auctionTypes ? auctionTypes : [],
          chainIds: chainIds ? chainIds : undefined,
          onlyDiscounted: !!onlyDiscounted,
          onlyOpen: onlyOpen,
          // payoutAssets: payoutAssets ? payoutAssets : [],
          // bondAssets: bondAssets ? bondAssets : [],
        }),
        [
          auctionTypes,
          chainIds,
          onlyDiscounted,
          onlyOpen,
          // payoutAssets,
          // bondAssets,
        ],
      )}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const useBondFilters = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('Hook can only be used inside Filter Context')
  }

  return context
}

export const useSetBondFilters = () => {
  const { push } = useRouter()
  const urlFilters = useTypedSearchParams(BondsApiSchema.partial())

  const setFilters: Dispatch<SetStateAction<typeof urlFilters>> = (filters) => {
    if (typeof filters === 'function') {
      void push(parseArgs(filters(urlFilters)))
    } else {
      void push(parseArgs(filters))
    }
  }

  return setFilters
}
