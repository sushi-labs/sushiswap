'use client'

import { PoolChainIds } from '@sushiswap/graph-client/data-api'
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
import { parseArgs } from 'src/lib/functions'
import { useTypedSearchParams } from 'src/lib/hooks'
import { poolChainIds } from 'src/lib/wagmi/hooks/portfolio/use-wallet-portfolio'
import type { ChainId } from 'sushi'
import { isEvmChainId } from 'sushi/evm'
import { z } from 'zod'

export const walletFiltersSchema = z.object({
  hideSmallPositions: z
    .string()
    .transform((val) => (val ? val === 'true' : false))
    .optional(),
  groupByAssets: z
    .string()
    .transform((val) => (val ? val === 'true' : false))
    .optional(),
  networks: z.string().transform((networks) => {
    if (!networks) return poolChainIds
    return networks.split(',').map((id) => +id as ChainId)
  }),
})

export type WalletFilters = z.infer<typeof walletFiltersSchema>

export const DEFAULT_WALLET_NETWORKS = poolChainIds.filter(
  (n) => typeof n === 'number' && isEvmChainId(n),
)

const DEFAULT_STATE: WalletFilters = {
  hideSmallPositions: false,
  groupByAssets: false,
  networks: DEFAULT_WALLET_NETWORKS,
}

type SetFilters = {
  (next: SetStateAction<WalletFilters>): void
  (reset?: undefined): void
}

type WalletFiltersContextType = {
  state: WalletFilters
  mutate: {
    setFilters: SetFilters
  }
}

const WalletFiltersContext = createContext<
  WalletFiltersContextType | undefined
>(undefined)

export const useWalletFilters = () => {
  const ctx = useContext(WalletFiltersContext)
  if (!ctx) throw new Error('Hook must be used inside WalletFiltersProvider')
  return ctx.state
}

export const useSetWalletFilters = () => {
  const ctx = useContext(WalletFiltersContext)
  if (!ctx) throw new Error('Hook must be used inside WalletFiltersProvider')
  return ctx.mutate.setFilters
}

const WalletFiltersUrlProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const { replace } = useRouter()
  const urlFilters = useTypedSearchParams(walletFiltersSchema.partial())

  const state = useMemo(() => {
    const { hideSmallPositions, groupByAssets, networks } = urlFilters
    return {
      hideSmallPositions:
        hideSmallPositions ?? DEFAULT_STATE.hideSmallPositions,
      groupByAssets: groupByAssets ?? DEFAULT_STATE.groupByAssets,
      networks: networks ?? DEFAULT_STATE.networks,
    }
  }, [urlFilters])

  const mutate = useMemo(() => {
    const setFilters: SetFilters = (filters) => {
      if (typeof filters === 'function') {
        void replace(parseArgs(filters(state)), {
          scroll: false,
        })
      } else {
        void replace(parseArgs(filters ?? {}), {
          scroll: false,
        })
      }
    }
    return { setFilters }
  }, [replace, state])

  return (
    <WalletFiltersContext.Provider
      value={useMemo(() => ({ state, mutate }), [state, mutate])}
    >
      {children}
    </WalletFiltersContext.Provider>
  )
}

const WalletFiltersLocalStateProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<WalletFilters>(DEFAULT_STATE)

  const mutate = useMemo(() => {
    const setFilters: SetFilters = (filters) => {
      if (typeof filters === 'function') {
        setState(filters(state))
      } else {
        setState(filters ?? DEFAULT_STATE)
      }
    }
    return { setFilters }
  }, [state])

  return (
    <WalletFiltersContext.Provider
      value={useMemo(() => ({ state, mutate }), [state, mutate])}
    >
      {children}
    </WalletFiltersContext.Provider>
  )
}

export const WalletFiltersProvider: FC<{
  children?: ReactNode
  url?: boolean
}> = ({ url = true, children }) => {
  return url ? (
    <WalletFiltersUrlProvider>{children}</WalletFiltersUrlProvider>
  ) : (
    <WalletFiltersLocalStateProvider>
      {children}
    </WalletFiltersLocalStateProvider>
  )
}
