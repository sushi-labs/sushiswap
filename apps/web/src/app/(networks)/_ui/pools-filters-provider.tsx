'use client'

import { useRouter } from 'next/navigation'
import {
  type FC,
  type ReactNode,
  type SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'
import { z } from 'zod'

<<<<<<< HEAD:apps/web/src/ui/pool/PoolsFiltersProvider.tsx
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { parseArgs } from 'src/lib/functions'
import { isEvmChainId } from 'sushi'
import type { ChainId } from 'sushi/chain'
import { useTypedSearchParams } from '../../lib/hooks'
import { POOL_TYPES } from './TableFiltersPoolTypeV2'
=======
import type { SushiSwapCmsProtocol } from 'src/lib/constants'
import { parseArgs } from 'src/lib/functions'
import { useTypedSearchParams } from 'src/lib/hooks'
import { POOL_TYPES } from '~evm/[chainId]/_ui/table-filters-pool-type'
>>>>>>> df7a32b4da917e27c2a98e477806c02fe28c56c5:apps/web/src/app/(networks)/_ui/pools-filters-provider.tsx

export const poolFiltersSchema = z.object({
  tokenSymbols: z.coerce.string().transform((symbols) => {
    return symbols.split(',').filter((symbol) => symbol !== '')
  }),
  protocols: z
    .string()
    .transform((protocols) =>
      protocols !== null && protocols !== ','
        ? (protocols.split(',') as SushiSwapCmsProtocol[])
        : [],
    ),
  farmsOnly: z
    .string()
    .transform((bool) => (bool ? bool === 'true' : undefined)),
  tvlRangeMin: z
    .string()
    .transform((val) => (val ? Number.parseFloat(val) : undefined))
    .optional(),
  tvlRangeMax: z
    .string()
    .transform((val) => (val ? Number.parseFloat(val) : undefined))
    .optional(),
  networks: z
    .string()
    .transform((networks) => {
      if (!networks) return DEFAULT_POOL_NETWORKS
      return networks.split(',').map((network) => {
        return +network as ChainId
      })
    })
    .optional(),
})

export type PoolFilters = z.infer<typeof poolFiltersSchema>

export const DEFAULT_POOL_NETWORKS = POOL_SUPPORTED_NETWORKS.filter(
  (network) => typeof network === 'number' && isEvmChainId(network),
)

type SetFilters = {
  (next: SetStateAction<PoolFilters>): void
  (reset?: undefined): void
}

type PoolsFiltersContext = {
  state: PoolFilters
  mutate: {
    setFilters: SetFilters
  }
}

const FilterContext = createContext<PoolsFiltersContext | undefined>(undefined)

interface PoolsFiltersProviderProps {
  children?: ReactNode
}

export const usePoolFilters = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('Hook can only be used inside Filter Context')
  }

  return context.state
}

export const useSetPoolFilters = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('Hook can only be used inside Filter Context')
  }
  return context.mutate.setFilters
}

const DEFAULT_STATE = {
  tokenSymbols: [],
  protocols: POOL_TYPES,
  farmsOnly: false,
  tvlRangeMin: undefined,
  tvlRangeMax: undefined,
  networks: DEFAULT_POOL_NETWORKS,
}

const PoolsFiltersUrlProvider: FC<PoolsFiltersProviderProps> = ({
  children,
}) => {
  const { replace } = useRouter()

  const urlFilters = useTypedSearchParams(poolFiltersSchema.partial())

  const state = useMemo(() => {
    const {
      tokenSymbols,
      protocols,
      farmsOnly,
      tvlRangeMin,
      tvlRangeMax,
      networks,
    } = urlFilters
    const state: PoolFilters = {
      tokenSymbols: tokenSymbols ? tokenSymbols : DEFAULT_STATE.tokenSymbols,
      protocols: protocols ? protocols : DEFAULT_STATE.protocols,
      farmsOnly: farmsOnly ? farmsOnly : DEFAULT_STATE.farmsOnly,
      tvlRangeMin: tvlRangeMin ?? DEFAULT_STATE.tvlRangeMin,
      tvlRangeMax: tvlRangeMax ?? DEFAULT_STATE.tvlRangeMax,
      networks: networks ? networks : DEFAULT_STATE.networks,
    }
    return state
  }, [urlFilters])

  const mutate = useMemo(() => {
    const setFilters: SetFilters = (filters) => {
      if (typeof filters === 'function') {
        void replace(parseArgs(filters(state)))
      } else {
        void replace(parseArgs(filters ?? {}))
      }
    }

    return {
      setFilters,
    }
  }, [replace, state])

  return (
    <FilterContext.Provider
      value={useMemo(() => ({ state, mutate }), [state, mutate])}
    >
      {children}
    </FilterContext.Provider>
  )
}

const PoolsFiltersLocalStateProvider: FC<PoolsFiltersProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<PoolFilters>(DEFAULT_STATE)

  const mutate = useMemo(() => {
    const setFilters: SetFilters = (filters) => {
      if (typeof filters === 'function') {
        setState(filters(state))
      } else {
        setState(filters ?? DEFAULT_STATE)
      }
    }

    return {
      setFilters,
    }
  }, [state])

  return (
    <FilterContext.Provider
      value={useMemo(
        () => ({
          state,
          mutate,
        }),
        [state, mutate],
      )}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const PoolsFiltersProvider: FC<
  PoolsFiltersProviderProps & { url?: boolean }
> = ({ url = true, children }) => {
  return url ? (
    <PoolsFiltersUrlProvider>{children}</PoolsFiltersUrlProvider>
  ) : (
    <PoolsFiltersLocalStateProvider>{children}</PoolsFiltersLocalStateProvider>
  )
}
