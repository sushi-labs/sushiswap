'use client'
import type { PoolChainId } from '@sushiswap/graph-client/data-api'
import { useLocalStorage } from '@sushiswap/hooks'
import { useSearchParams } from 'next/navigation'
import { type FC, createContext, useContext, useMemo, useState } from 'react'
import {
  SushiSwapProtocol,
  isSushiSwapV2ChainId,
  isSushiSwapV3ChainId,
} from 'sushi/evm'

const createItems = (chainId: PoolChainId) => {
  return [
    {
      id: 'sushiswap-v3' as const,
      value: 'v3' as const,
      protocol: SushiSwapProtocol.SUSHISWAP_V3,
      disabled: !isSushiSwapV3ChainId(chainId),
      children: <span>SushiSwap V3</span>,
    },
    {
      id: 'sushiswap-v2' as const,
      value: 'v2' as const,
      protocol: SushiSwapProtocol.SUSHISWAP_V2,
      disabled: !isSushiSwapV2ChainId(chainId),
      children: <span>SushiSwap V2</span>,
    },
  ] as const
}

export type PositionTabType = ReturnType<typeof createItems>[number]['value']

interface State {
  state: {
    tab: PositionTabType
    hideClosedPositions: boolean
    tabOptions: ReturnType<typeof createItems>
  }
  mutate: {
    setTab: (tab: PositionTabType) => void
    setHideClosedPositions: (hide: boolean) => void
  }
}

const PositionFiltersContext = createContext<State>({} as State)

interface PositionFiltersProviderProps {
  children: React.ReactNode
  chainId: PoolChainId
}

const PositionFiltersProvider: FC<PositionFiltersProviderProps> = ({
  children,
  chainId,
}) => {
  const tabOptions = useMemo(() => createItems(chainId), [chainId])
  const searchParams = useSearchParams()
  const urlTab = searchParams.get('tab')

  // Find the first non-disabled tab as default
  const defaultTab = useMemo(() => {
    if (urlTab) {
      const matchingItem = tabOptions.find(
        (item) => item.value === urlTab && !item.disabled,
      )
      if (matchingItem) {
        return matchingItem.value
      }
    }
    const firstAvailable = tabOptions.find((item) => !item.disabled)
    return firstAvailable?.value || 'v3'
  }, [tabOptions, urlTab])
  const [tab, setTab] = useLocalStorage<PositionTabType>('tab', defaultTab)

  const [hideClosedPositions, setHideClosedPositions] = useState(true)
  return (
    <PositionFiltersContext.Provider
      value={useMemo(() => {
        return {
          state: {
            tab,
            hideClosedPositions,
            tabOptions,
          },
          mutate: {
            setTab,
            setHideClosedPositions,
          },
        }
      }, [tab, hideClosedPositions, tabOptions, setTab])}
    >
      {children}
    </PositionFiltersContext.Provider>
  )
}

const usePositionFilters = () => {
  const context = useContext(PositionFiltersContext)
  if (!context) {
    throw new Error('Hook can only be used inside Position Filters Context')
  }

  return context
}

export { PositionFiltersProvider, usePositionFilters }
