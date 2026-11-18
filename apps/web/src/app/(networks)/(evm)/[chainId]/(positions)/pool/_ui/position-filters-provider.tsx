'use client'
import type { PoolChainId } from '@sushiswap/graph-client/data-api'
import { useIsMounted, useLocalStorage } from '@sushiswap/hooks'
import { useSearchParams } from 'next/navigation'
import {
  type FC,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
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

const PositionFiltersContext = createContext<
  (State & { defaultTab: PositionTabType }) | undefined
>(undefined)

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
  const urlTabOption = tabOptions.find(
    (item) => item.value === searchParams.get('tab') && !item.disabled,
  )

  // Find the first non-disabled tab as default
  const defaultTab = useMemo(() => {
    if (urlTabOption) return urlTabOption.value
    const firstAvailable = tabOptions.find((item) => !item.disabled)
    return firstAvailable?.value || 'v3'
  }, [tabOptions, urlTabOption])
  const [tab, setTab] = useLocalStorage<PositionTabType>('tab', defaultTab)

  // An explicit URL selection takes precedence over the saved preference.
  // Synchronize URL/network changes so the dropdown remains free to change tabs.
  useEffect(() => {
    if (urlTabOption) setTab(urlTabOption.value)
  }, [urlTabOption, setTab])

  const [hideClosedPositions, setHideClosedPositions] = useState(true)
  return (
    <PositionFiltersContext.Provider
      value={useMemo(() => {
        return {
          defaultTab,
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
      }, [defaultTab, tab, hideClosedPositions, tabOptions, setTab])}
    >
      {children}
    </PositionFiltersContext.Provider>
  )
}

function usePositionFilters(): State {
  const context = useContext(PositionFiltersContext)
  // Suspense can delay a consumer's hydration beyond the provider's mount.
  const isMounted = useIsMounted()

  return useMemo(() => {
    if (!context) {
      throw new Error('Hook can only be used inside Position Filters Context')
    }

    return {
      state: {
        ...context.state,
        tab: isMounted ? context.state.tab : context.defaultTab,
      },
      mutate: context.mutate,
    }
  }, [context, isMounted])
}

export { PositionFiltersProvider, usePositionFilters }
