import { eqIgnoreCase } from '@orbs-network/twap-sdk'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  TWAP_SUPPORTED_CHAIN_IDS,
  type TwapSupportedChainId,
  isTwapSupportedChainId,
} from 'src/config'
import { type TwapOrder, useTwapOrders } from 'src/lib/hooks/react-query/twap'
import type { Type } from 'sushi/currency'
import { useAccount } from 'wagmi'
import {
  DerivedstateSimpleSwapProvider,
  useDerivedStateSimpleSwap,
} from '../../simple/derivedstate-simple-swap-provider'

const filterByPair = (orders?: TwapOrder[], token0?: Type, token1?: Type) => {
  if (!orders || !token0 || !token1) return orders
  const srcAddress = token0.wrapped.address
  const dstAddress = token1.wrapped.address
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
  chainIds: TwapSupportedChainId[]
  currentTab: TABS
  orders: TwapOrder[]
  ordersLoading: boolean
  showCurrentPairOnly: boolean
  onChainChange: (chainId: TwapSupportedChainId) => void
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
  const { chainId: accountChainId, address } = useAccount()
  const [showCurrentPairOnly, setShowCurrentPair] = useState(false)
  const [chainIds, setChainIds] = useState<TwapSupportedChainId[]>([])
  const [currentTab, setCurrentTab] = useState(TABS.LIMIT_ORDERS)
  const {
    state: { token0, token1 },
  } = useDerivedStateSimpleSwap()

  const {
    data,
    isLoading: ordersLoading,
    loadingChains,
  } = useTwapOrders({
    chainIds,
    // account: "0xFa7768aDDb25AA83BfA5c257A443D1c730178c7c",//test account for limit orders, address = 0xb1ed8BCAD1EaC8a1DF0764700472391800D12946
    // account: '0x95E01700953A9EA0F3BF379Be9435b483cB0E356', //test account for dca orders address = 0xb1ed8BCAD1EaC8a1DF0764700472391800D12946
    account: address,
    enabled: true,
  })

  useEffect(() => {
    if (accountChainId && isTwapSupportedChainId(accountChainId)) {
      setChainIds([accountChainId])
    }
  }, [accountChainId])

  const onChainChange = useCallback((chainId: TwapSupportedChainId) => {
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
