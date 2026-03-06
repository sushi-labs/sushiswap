'use client'
import {
  type FC,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { CancelAllOpenOrdersDialog } from '../exchange/cancel-all-open-orders-dialog'
import { CloseAllPositionsDialog } from '../exchange/close-all-positions-dialog'
import { BalanceTable } from './balance-table'
import { AggregateTradeHistory } from './filters/aggregate-trade-history'
import { ExpandAll } from './filters/expand-all'
import { HideSmallBalances } from './filters/hide-small-balances'
import { FundingHistoryTable } from './funding-history-table'
import { OpenOrdersTable } from './open-orders-table'
import { OrderHistoryTable } from './order-history-table'
import { PositionsTable } from './positions-table/positions-table'
import { TradeHistoryTable } from './trade-history-table'
import {
  ActiveTwapTable,
  FillHistoryTwapTable,
  HistoryTwapTable,
} from './twap-tables'
import { TwapTables } from './twap-tables/twap-tables'

interface State {
  mutate: {
    setActiveTab: (tab: TradeTablesTabValue) => void
    setActiveTwapTab: (tab: TwapTableTabValue) => void
    handleSetTradeFilter: (
      filter: Partial<Record<TradeTablesTabValue, TradeFilterValueString>>,
    ) => void
    setHideSmallBalances: (hide: boolean) => void
    setShouldAggregateTradeHistory: (aggregate: boolean) => void
    setExpandAll: (expand: boolean) => void
  }
  state: {
    activeTab: TradeTablesTabValue
    activeTwapTab: TwapTableTabValue
    tradeFilter: Record<TradeTablesTabValue, TradeFilterValueString> | null
    hideSmallBalances: boolean
    shouldAggregateTradeHistory: boolean
    expandAll: boolean
  }
}

export const TRADE_TABLES_TABS = [
  {
    name: 'Balances',
    value: 'balances' as const,
    extraFilter: HideSmallBalances,
    content: BalanceTable,
  },
  {
    name: 'Positions',
    value: 'positions' as const,
    content: PositionsTable,
    mobileChildren: () => (
      <div className="flex items-center justify-end gap-4 text-sm">
        <ExpandAll label="Positions" />
        <CloseAllPositionsDialog />
      </div>
    ),
  },
  {
    name: 'Open Orders',
    value: 'open-orders' as const,
    content: OpenOrdersTable,
    mobileChildren: () => (
      <>
        <CancelAllOpenOrdersDialog />
      </>
    ),
  },
  {
    name: 'TWAP',
    value: 'twap' as const,
    content: TwapTables,
  },
  {
    name: 'Trade History',
    value: 'trade-history' as const,
    extraFilter: AggregateTradeHistory,
    content: TradeHistoryTable,
    mobileChildren: () => (
      <>
        <ExpandAll label="Trades" />
      </>
    ),
  },
  {
    name: 'Funding History',
    value: 'funding-history' as const,
    content: FundingHistoryTable,
  },
  {
    name: 'Order History',
    value: 'order-history' as const,
    content: OrderHistoryTable,
  },
]

export type TradeTablesTabValue = (typeof TRADE_TABLES_TABS)[number]['value']

export const TWAP_TABLES_TABS = [
  {
    name: 'Active',
    value: 'active' as const,
    content: ActiveTwapTable,
  },
  {
    name: 'History',
    value: 'history' as const,
    content: HistoryTwapTable,
  },
  {
    name: 'Fill History',
    value: 'fill-history' as const,
    content: FillHistoryTwapTable,
  },
]

export type TwapTableTabValue = (typeof TWAP_TABLES_TABS)[number]['value']

export const TRADE_FILTER_VALUES = ['all', 'active', 'long', 'short'] as const
export type TradeFilterType = (typeof TRADE_FILTER_VALUES)[number]
export type TradeFilterValueString = `${TradeTablesTabValue}:${TradeFilterType}`

const TradeTablesContext = createContext<State>({} as State)

interface TradeTablesProviderProps {
  children: React.ReactNode
}

const TradeTablesProvider: FC<TradeTablesProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TradeTablesTabValue>(
    TRADE_TABLES_TABS[0].value,
  )
  const [activeTwapTab, setActiveTwapTab] = useState<TwapTableTabValue>(
    TWAP_TABLES_TABS[0].value,
  )
  const [tradeFilter, setTradeFilter] = useState<Record<
    TradeTablesTabValue,
    TradeFilterValueString
  > | null>(null)
  const [hideSmallBalances, setHideSmallBalances] = useState<boolean>(false)
  const [shouldAggregateTradeHistory, setShouldAggregateTradeHistory] =
    useState<boolean>(false)
  const [expandAll, setExpandAll] = useState(false)

  const handleSetTradeFilter = useCallback(
    (filter: Partial<Record<TradeTablesTabValue, TradeFilterValueString>>) => {
      setTradeFilter(
        filter as Record<TradeTablesTabValue, TradeFilterValueString>,
      )
    },
    [],
  )

  return (
    <TradeTablesContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setActiveTab,
            setActiveTwapTab,
            handleSetTradeFilter,
            setHideSmallBalances,
            setShouldAggregateTradeHistory,
            setExpandAll,
          },
          state: {
            activeTab,
            activeTwapTab,
            tradeFilter,
            hideSmallBalances,
            shouldAggregateTradeHistory,
            expandAll,
          },
        }
      }, [
        activeTab,
        activeTwapTab,
        tradeFilter,
        hideSmallBalances,
        shouldAggregateTradeHistory,
        handleSetTradeFilter,
        expandAll,
      ])}
    >
      {children}
    </TradeTablesContext.Provider>
  )
}

const useTradeTables = () => {
  const context = useContext(TradeTablesContext)
  if (!context) {
    throw new Error('Hook can only be used inside TradeTables State Context')
  }

  return context
}

export { TradeTablesProvider, useTradeTables }
