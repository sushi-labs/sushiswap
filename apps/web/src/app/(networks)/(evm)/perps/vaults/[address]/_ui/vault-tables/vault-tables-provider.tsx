'use client'
import { useParams } from 'next/navigation'
import {
  type FC,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { EvmAddress } from 'sushi/evm'
import { BalanceTable } from './balance-table'
import { DepositsWithdrawalsTable } from './deposit-withdrawals-table'
import { DepositorsTable } from './depositors-table'
import { ExpandAll } from './filters'
import { FundingHistoryTable } from './funding-history'
import { PositionsTable } from './positions-table'
import { TradeHistoryTable } from './trade-history-table'

interface State {
  mutate: {
    setActiveTab: (tab: VaultTablesTabValue) => void
    handleSetVaultFilter: (
      filter: Partial<Record<VaultTablesTabValue, VaultFilterValueString>>,
    ) => void
    setShouldAggregateTradeHistory: (aggregate: boolean) => void
    setExpandAll: (expand: boolean) => void
  }
  state: {
    activeTab: VaultTablesTabValue
    vaultFilter: Partial<
      Record<VaultTablesTabValue, VaultFilterValueString>
    > | null
    shouldAggregateTradeHistory: boolean
    expandAll: boolean
    vaultAddress: EvmAddress
  }
}

export const VAULT_TABLES_TABS = [
  {
    name: 'Balances',
    value: 'balances' as const,
    content: BalanceTable,
  },
  {
    name: 'Positions',
    value: 'positions' as const,
    content: PositionsTable,
  },
  {
    name: 'Trade History',
    value: 'trade-history' as const,
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
    name: 'Deposits and Withdrawals',
    value: 'deposits-withdrawals' as const,
    content: DepositsWithdrawalsTable,
  },
  {
    name: 'Depositors',
    value: 'depositors' as const,
    content: DepositorsTable,
  },
]

export type VaultTablesTabValue = (typeof VAULT_TABLES_TABS)[number]['value']

export const VAULT_FILTER_VALUES = ['all', 'active', 'long', 'short'] as const
export type VaultFilterType = (typeof VAULT_FILTER_VALUES)[number]
export type VaultFilterValueString = `${VaultTablesTabValue}:${VaultFilterType}`

const VaultTablesContext = createContext<State>({} as State)

interface VaultTablesProviderProps {
  children: React.ReactNode
}

const VaultTablesProvider: FC<VaultTablesProviderProps> = ({ children }) => {
  const params = useParams()
  const vaultAddress = params.address as EvmAddress
  const [activeTab, setActiveTab] = useState<VaultTablesTabValue>(
    VAULT_TABLES_TABS[0].value,
  )
  const [vaultFilter, setVaultFilter] = useState<Partial<
    Record<VaultTablesTabValue, VaultFilterValueString>
  > | null>(null)
  const [shouldAggregateTradeHistory, setShouldAggregateTradeHistory] =
    useState<boolean>(false)
  const [expandAll, setExpandAll] = useState(false)

  const handleSetVaultFilter = useCallback(
    (filter: Partial<Record<VaultTablesTabValue, VaultFilterValueString>>) => {
      setVaultFilter(filter)
    },
    [],
  )

  return (
    <VaultTablesContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setActiveTab,
            handleSetVaultFilter,
            setShouldAggregateTradeHistory,
            setExpandAll,
          },
          state: {
            activeTab,
            vaultFilter,
            shouldAggregateTradeHistory,
            expandAll,
            vaultAddress,
          },
        }
      }, [
        vaultAddress,
        activeTab,
        vaultFilter,
        shouldAggregateTradeHistory,
        handleSetVaultFilter,
        expandAll,
      ])}
    >
      {children}
    </VaultTablesContext.Provider>
  )
}

const useVaultTables = () => {
  const context = useContext(VaultTablesContext)
  if (!context) {
    throw new Error('Hook can only be used inside VaultTables State Context')
  }

  return context
}

export { VaultTablesProvider, useVaultTables }
