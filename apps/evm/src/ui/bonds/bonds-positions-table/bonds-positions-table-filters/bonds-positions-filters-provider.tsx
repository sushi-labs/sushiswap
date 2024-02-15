'use client'

import { parseArgs } from '@sushiswap/client'
import { BondsPositionsApiSchema } from '@sushiswap/client/api'
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
    typeof BondsPositionsApiSchema._output,
    'chainIds' | 'onlyUnclaimedBonds'
  >
>

const FilterContext = createContext<FilterContext | undefined>(undefined)

export type BondFilters = Omit<FilterContext, 'setFilters'>

interface BondsFiltersProvider {
  children?: ReactNode
  passedFilters?: Partial<BondFilters>
}

export const BondsPositionsFiltersProvider: FC<BondsFiltersProvider> = ({
  children,
}) => {
  const urlFilters = useTypedSearchParams(BondsPositionsApiSchema.partial())
  const { chainIds, onlyUnclaimedBonds } = urlFilters

  return (
    <FilterContext.Provider
      value={useMemo(
        () => ({
          chainIds: chainIds ? chainIds : undefined,
          onlyUnclaimedBonds: onlyUnclaimedBonds,
          // payoutAssets: payoutAssets ? payoutAssets : [],
        }),
        [
          chainIds,
          onlyUnclaimedBonds,
          // bondAssets,
        ],
      )}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const useBondPositionsFilters = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('Hook can only be used inside Filter Context')
  }

  return context
}

export const useSetBondPositionsFilters = () => {
  const { push } = useRouter()
  const urlFilters = useTypedSearchParams(BondsPositionsApiSchema.partial())

  const setFilters: Dispatch<SetStateAction<typeof urlFilters>> = (filters) => {
    if (typeof filters === 'function') {
      void push(parseArgs(filters(urlFilters)))
    } else {
      void push(parseArgs(filters))
    }
  }

  return { setFilters }
}
