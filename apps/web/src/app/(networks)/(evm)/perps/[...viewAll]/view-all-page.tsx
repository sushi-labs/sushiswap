'use client'

import { Container } from '@sushiswap/ui'
import type { ComponentType } from 'react'
import { truncateString } from 'sushi'
import type { EvmAddress } from 'sushi/evm'
import { GeoBlockedMessage, PerpsCard } from '../_ui/_common'
import { DepositsWithdrawalsTable } from '../_ui/trade-tables/deposit-withdrawals-table'
import { ExportCsvButton } from '../_ui/trade-tables/export-csv-button'
import { FundingHistoryTable } from '../_ui/trade-tables/funding-history-table'
import { InterestTable } from '../_ui/trade-tables/interest-table'
import { OrderHistoryTable } from '../_ui/trade-tables/order-history-table'
import { TradeHistoryTable } from '../_ui/trade-tables/trade-history-table'
import {
  FillHistoryTwapTable,
  HistoryTwapTable,
} from '../_ui/trade-tables/twap-tables'
import { type ViewAllHref, viewAllHrefs } from './view-all-hrefs'

interface ViewAllTable {
  title: string
  Component: ComponentType
}

function OrderHistoryViewAllTable() {
  return <OrderHistoryTable isViewAll />
}

function FundingHistoryViewAllTable() {
  return <FundingHistoryTable isViewAll />
}

function TradeHistoryViewAllTable() {
  return <TradeHistoryTable isViewAll />
}

function HistoryTwapViewAllTable() {
  return <HistoryTwapTable isViewAll />
}

function FillHistoryTwapViewAllTable() {
  return <FillHistoryTwapTable isViewAll />
}

function InterestViewAllTable() {
  return <InterestTable isViewAll />
}

function DepositsWithdrawalsViewAllTable() {
  return <DepositsWithdrawalsTable isViewAll />
}

const viewAllTables = {
  [viewAllHrefs[0]]: {
    title: 'Trade History',
    Component: TradeHistoryViewAllTable,
  },
  [viewAllHrefs[1]]: {
    title: 'Funding History',
    Component: FundingHistoryViewAllTable,
  },
  [viewAllHrefs[2]]: {
    title: 'Order History',
    Component: OrderHistoryViewAllTable,
  },
  [viewAllHrefs[3]]: {
    title: 'Interest',
    Component: InterestViewAllTable,
  },
  [viewAllHrefs[4]]: {
    title: 'Deposits and Withdrawals',
    Component: DepositsWithdrawalsViewAllTable,
  },
  [viewAllHrefs[5]]: {
    title: 'TWAP History',
    Component: HistoryTwapViewAllTable,
  },
  [viewAllHrefs[6]]: {
    title: 'TWAP Fill History',
    Component: FillHistoryTwapViewAllTable,
  },
} satisfies Record<ViewAllHref, ViewAllTable>

interface ViewAllPageProps {
  href: ViewAllHref
  address: EvmAddress
}

export function ViewAllPage({ href, address }: ViewAllPageProps) {
  const { title, Component } = viewAllTables[href]

  return (
    <div className="overflow-x-hidden min-h-[calc(100vh-56px)] bg-perps-background">
      <GeoBlockedMessage />
      <Container maxWidth="8xl" className="px-2 pb-14 pt-6 md:px-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 px-1 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-medium text-perps-primary">
                {title}
              </h1>
              <div className="text-sm text-perps-muted">
                {truncateString(address, 10, 'middle')}
              </div>
            </div>
            <ExportCsvButton
              address={address}
              className="text-xs self-start sm:self-auto"
              href={href}
            />
          </div>
          <PerpsCard className="p-2">
            <Component />
          </PerpsCard>
        </div>
      </Container>
    </div>
  )
}
