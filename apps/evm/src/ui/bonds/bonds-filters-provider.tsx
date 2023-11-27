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
import { BONDS_ENABLED_CHAIN_IDS } from 'src/config'
import { z } from 'zod'

import { useTypedSearchParams } from '../../lib/hooks'
import { AuctionType } from './table-filters-auction-type'

type FilterContext = z.TypeOf<typeof bondFiltersSchema>

const FilterContext = createContext<FilterContext | undefined>(undefined)

export type BondFilters = Omit<FilterContext, 'setFilters'>

interface BondsFiltersProvider {
  children?: ReactNode
  passedFilters?: Partial<BondFilters>
}

export const bondFiltersSchema = z.object({
  chainIds: z.coerce
    .string()
    .default(BONDS_ENABLED_CHAIN_IDS.join(','))
    .transform((chainIds) =>
      chainIds !== null && chainIds !== ','
        ? chainIds.split(',').map((chainId) => Number(chainId))
        : BONDS_ENABLED_CHAIN_IDS,
    ),
  auctionTypes: z
    .string()
    .transform((protocols) =>
      protocols !== null && protocols !== ','
        ? (protocols.split(',') as AuctionType[])
        : [],
    ),
  positiveDiscountsOnly: z
    .string()
    .transform((bool) => (bool ? bool === 'true' : undefined)),
  payoutAssets: z.coerce.string().transform((addresses) => {
    return addresses.split(',')
  }),
  bondAssets: z.coerce.string().transform((addresses) => {
    return addresses.split(',')
  }),
})

export const BondsFiltersProvider: FC<BondsFiltersProvider> = ({
  children,
}) => {
  const urlFilters = useTypedSearchParams(bondFiltersSchema.partial())
  const {
    payoutAssets,
    bondAssets,
    auctionTypes,
    chainIds,
    positiveDiscountsOnly,
  } = urlFilters

  return (
    <FilterContext.Provider
      value={useMemo(
        () => ({
          auctionTypes: auctionTypes ? auctionTypes : [],
          chainIds: chainIds ? chainIds : BONDS_ENABLED_CHAIN_IDS,
          positiveDiscountsOnly: positiveDiscountsOnly
            ? positiveDiscountsOnly
            : false,
          payoutAssets: payoutAssets ? payoutAssets : [],
          bondAssets: bondAssets ? bondAssets : [],
        }),
        [
          auctionTypes,
          chainIds,
          positiveDiscountsOnly,
          payoutAssets,
          bondAssets,
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
  const urlFilters = useTypedSearchParams(bondFiltersSchema.partial())

  const setFilters: Dispatch<SetStateAction<typeof urlFilters>> = (filters) => {
    if (typeof filters === 'function') {
      void push(parseArgs(filters(urlFilters)))
    } else {
      void push(parseArgs(filters))
    }
  }

  return setFilters
}
