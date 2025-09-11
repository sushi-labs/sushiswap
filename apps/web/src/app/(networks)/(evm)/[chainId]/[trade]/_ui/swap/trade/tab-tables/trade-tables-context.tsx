import { eqIgnoreCase } from '@orbs-network/twap-sdk'
import { useSearchParams } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  SUPPORTED_CHAIN_IDS,
  TWAP_SUPPORTED_CHAIN_IDS,
  type TwapSupportedChainId,
  getSortedChainIds,
  isTwapSupportedChainId,
} from 'src/config'
import { type TwapOrder, useTwapOrders } from 'src/lib/hooks/react-query/twap'
import type { EvmChainId } from 'sushi/evm'
import type { EvmCurrency } from 'sushi/evm'
import { useAccount } from 'wagmi'
import {
  DerivedstateSimpleSwapProvider,
  useDerivedStateSimpleSwap,
} from '../../derivedstate-simple-swap-provider'

const filterByPair = (
  orders?: TwapOrder[],
  token0?: EvmCurrency,
  token1?: EvmCurrency,
) => {
  if (!orders || !token0 || !token1) return orders
  const srcAddress = token0.wrap().address
  const dstAddress = token1.wrap().address
  return orders.filter((order) => {
    return (
      (eqIgnoreCase(order?.srcTokenAddress, srcAddress) &&
        eqIgnoreCase(order?.dstTokenAddress, dstAddress)) ||
      (eqIgnoreCase(order?.srcTokenAddress, dstAddress) &&
        eqIgnoreCase(order?.srcTokenAddress, srcAddress))
    )
  })
}

type TradeTablesContextType = {
  chainIds: EvmChainId[]
  currentTab: TABS
  orders: TwapOrder[]
  ordersLoading: boolean
  showCurrentPairOnly: boolean
  onChainChange: (chainId: EvmChainId) => void
  setCurrentTab: (currentTab: TABS) => void
  setShowCurrentPairOnly: (show: boolean) => void
  isChainLoadingCallback: (chainId: TwapSupportedChainId) => boolean
}

export enum TABS {
  LIMIT_ORDERS = 'limit-orders',
  DCA_ORDERS = 'dca-orders',
  HISTORY = 'history',
}

const Context = createContext<TradeTablesContextType>(
  {} as TradeTablesContextType,
)
export const TradeTablesProvider = ({
  children,
}: { children: React.ReactNode }) => {
  return (
    <DerivedstateSimpleSwapProvider>
      <Content>{children}</Content>
    </DerivedstateSimpleSwapProvider>
  )
}

const Content = ({ children }: { children: React.ReactNode }) => {
  const { address } = useAccount()
  const [showCurrentPairOnly, setShowCurrentPair] = useState(false)
  const [chainIds, setChainIds] = useState<EvmChainId[]>([])
  const [currentTab, setCurrentTab] = useState(TABS.LIMIT_ORDERS)
  const searchParams = useSearchParams()
  const isMarketHistoryTabSelected =
    searchParams.get('history-table-tab') === 'market'

  const {
    state: { token0, token1 },
  } = useDerivedStateSimpleSwap()

  const {
    data,
    isLoading: ordersLoading,
    loadingChains,
  } = useTwapOrders({
    chainIds: chainIds.filter((chainId) => isTwapSupportedChainId(chainId)),
    account: address,
    enabled: Boolean(address),
  })

  useEffect(() => {
    if (isMarketHistoryTabSelected) {
      setChainIds(
        getSortedChainIds(SUPPORTED_CHAIN_IDS.map((chainId) => chainId)),
      )
    } else {
      setChainIds(
        getSortedChainIds(TWAP_SUPPORTED_CHAIN_IDS.map((chainId) => chainId)),
      )
    }
  }, [isMarketHistoryTabSelected])

  const onChainChange = useCallback((chainId: EvmChainId) => {
    setChainIds((prev) => {
      if (prev.includes(chainId)) {
        return prev.filter((id) => id !== chainId)
      }
      return [...prev, chainId]
    })
  }, [])

  const orders = useMemo(() => {
    return showCurrentPairOnly
      ? (filterByPair(data?.ALL ?? [], token0, token1) ?? [])
      : (data?.ALL ?? [])
  }, [data, token0, token1, showCurrentPairOnly])

  const setShowCurrentPairOnly = useCallback((show: boolean) => {
    setShowCurrentPair(show)
  }, [])

  const isChainLoadingCallback = useCallback(
    (chainId: TwapSupportedChainId) => {
      return loadingChains.includes(chainId)
    },
    [loadingChains],
  )

  return (
    <Context.Provider
      value={{
        chainIds,
        onChainChange,
        currentTab,
        setCurrentTab,
        orders,
        ordersLoading,
        showCurrentPairOnly,
        setShowCurrentPairOnly,
        isChainLoadingCallback,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useTradeTablesContext = () => {
  return useContext(Context)
}
