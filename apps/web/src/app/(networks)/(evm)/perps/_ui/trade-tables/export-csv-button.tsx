'use client'

import { createErrorToast } from '@sushiswap/notifications'
import { useCallback, useState } from 'react'
import type {
  FundingHistoryItemType,
  TradeHistoryItemType,
  UserBorrowLendInterestItemType,
  UserNonFundingLedgerUpdatesItemType,
} from 'src/lib/perps'
import {
  useFundingHistory,
  useTradeHistory,
  useUserBorrowLendInterest,
  useUserNonFundingLedgerUpdates,
} from 'src/lib/perps'
import type { EvmAddress } from 'sushi/evm'
import {
  type ViewAllHref,
  viewAllHrefs,
} from '../../[...viewAll]/view-all-hrefs'
import { useActiveAccountState } from '../../active-account-provider'
import { TableButton } from '../_common'

type CsvCell = boolean | number | string | null | undefined

interface CsvColumn<T> {
  header: string
  getValue: (row: T) => CsvCell
}

interface ExportCsvButtonProps {
  href: ViewAllHref
  address: EvmAddress
  className?: string
  hasRows?: boolean
}

interface CsvExportButtonProps<T> {
  address: EvmAddress
  className?: string
  columns: readonly CsvColumn<T>[]
  filePrefix: string
  hasRows?: boolean
  isLoading?: boolean
  rows: readonly T[] | undefined
  refetchRows: () => Promise<readonly T[]>
}

const tradeHistoryColumns = [
  {
    header: 'Time',
    getValue: (row) => formatCsvTimestamp(row.time),
  },
  {
    header: 'Coin',
    getValue: (row) =>
      row.symbol ?? row.token0Symbol ?? row.cleanedCoin ?? row.coin,
  },
  {
    header: 'Direction',
    getValue: (row) => row.dir,
  },
  {
    header: 'Side',
    getValue: (row) => row.side,
  },
  {
    header: 'Price',
    getValue: (row) => row.px,
  },
  {
    header: 'Size',
    getValue: (row) => row.sz,
  },
  {
    header: 'Trade Value',
    getValue: (row) => {
      const price = parseCsvNumber(row.px)
      const size = parseCsvNumber(row.sz)
      return price === undefined || size === undefined
        ? undefined
        : price * size
    },
  },
  {
    header: 'Fee',
    getValue: (row) => row.fee,
  },
  {
    header: 'Fee Token',
    getValue: (row) => row.feeToken,
  },
  {
    header: 'Closed PnL',
    getValue: (row) => row.closedPnl,
  },
  {
    header: 'Closed PnL After Fees',
    getValue: (row) => {
      const closedPnl = parseCsvNumber(row.closedPnl)
      const fee = parseCsvNumber(row.fee)
      return closedPnl === undefined || fee === undefined
        ? undefined
        : closedPnl - fee
    },
  },
  {
    header: 'Order ID',
    getValue: (row) => row.oid,
  },
  {
    header: 'Trade ID',
    getValue: (row) => row.tid,
  },
  {
    header: 'Hash',
    getValue: (row) => row.hash,
  },
  {
    header: 'Perps Dex',
    getValue: (row) => row.perpsDex,
  },
] satisfies CsvColumn<TradeHistoryItemType>[]

const fundingHistoryColumns = [
  {
    header: 'Time',
    getValue: (row) => formatCsvTimestamp(row.timestamp),
  },
  {
    header: 'Coin',
    getValue: (row) => row.coin,
  },
  {
    header: 'Asset Symbol',
    getValue: (row) => row.assetSymbol,
  },
  {
    header: 'Side',
    getValue: (row) => row.side,
  },
  {
    header: 'Size',
    getValue: (row) => row.size,
  },
  {
    header: 'Payment',
    getValue: (row) => row.payment,
  },
  {
    header: 'Rate',
    getValue: (row) => row.rate,
  },
  {
    header: 'Samples',
    getValue: (row) => row.nSamples,
  },
  {
    header: 'Market Type',
    getValue: (row) => row.marketType,
  },
] satisfies CsvColumn<FundingHistoryItemType>[]

const interestColumns = [
  {
    header: 'Time',
    getValue: (row) => formatCsvTimestamp(row.time),
  },
  {
    header: 'Token',
    getValue: (row) => row.token,
  },
  {
    header: 'Paid',
    getValue: (row) => row.borrow,
  },
  {
    header: 'Earned',
    getValue: (row) => row.supply,
  },
] satisfies CsvColumn<UserBorrowLendInterestItemType>[]

const depositsWithdrawalsColumns = [
  {
    header: 'Time',
    getValue: (row) => formatCsvTimestamp(row.timestamp),
  },
  {
    header: 'Status',
    getValue: (row) => row.status,
  },
  {
    header: 'Action',
    getValue: (row) => row.action,
  },
  {
    header: 'Source',
    getValue: (row) => row.source,
  },
  {
    header: 'Destination',
    getValue: (row) => row.destination,
  },
  {
    header: 'Account Value Change',
    getValue: (row) => row.accountValueChange,
  },
  {
    header: 'Account Value Change Amount',
    getValue: (row) => row.accValChange,
  },
  {
    header: 'Fee Amount',
    getValue: (row) => row.feeAmount,
  },
  {
    header: 'Fee Token',
    getValue: (row) => row.feeToken ?? 'USDC',
  },
] satisfies CsvColumn<UserNonFundingLedgerUpdatesItemType>[]

export function ExportCsvButton({
  href,
  address,
  className,
  hasRows,
}: ExportCsvButtonProps) {
  switch (href) {
    case viewAllHrefs[0]:
      return (
        <TradeHistoryCsvButton
          address={address}
          className={className}
          hasRows={hasRows}
        />
      )
    case viewAllHrefs[1]:
      return (
        <FundingHistoryCsvButton
          address={address}
          className={className}
          hasRows={hasRows}
        />
      )
    case viewAllHrefs[3]:
      return (
        <InterestCsvButton
          address={address}
          className={className}
          hasRows={hasRows}
        />
      )
    case viewAllHrefs[4]:
      return (
        <DepositsWithdrawalsCsvButton
          address={address}
          className={className}
          hasRows={hasRows}
        />
      )
    default:
      return null
  }
}

function TradeHistoryCsvButton({
  address,
  className,
  hasRows,
}: Omit<ExportCsvButtonProps, 'href'>) {
  const { data, isLoading, refetch } = useTradeHistory({
    isViewAll: true,
    enabled: false,
  })

  return (
    <CsvExportButton
      address={address}
      className={className}
      columns={tradeHistoryColumns}
      filePrefix="perps-trade-history"
      hasRows={hasRows}
      isLoading={isLoading}
      rows={data}
      refetchRows={refetch}
    />
  )
}

function FundingHistoryCsvButton({
  address,
  className,
  hasRows,
}: Omit<ExportCsvButtonProps, 'href'>) {
  const { data, isLoading, refetch } = useFundingHistory({
    isViewAll: true,
    enabled: false,
  })

  return (
    <CsvExportButton
      address={address}
      className={className}
      columns={fundingHistoryColumns}
      filePrefix="perps-funding-history"
      hasRows={hasRows}
      isLoading={isLoading}
      rows={data}
      refetchRows={refetch}
    />
  )
}

function InterestCsvButton({
  address,
  className,
  hasRows,
}: Omit<ExportCsvButtonProps, 'href'>) {
  const { data, isLoading, refetch } = useUserBorrowLendInterest({
    address,
    isViewAll: true,
    enabled: false,
  })
  const refetchRows = useCallback(async () => {
    const result = await refetch()
    return result.data ?? []
  }, [refetch])

  return (
    <CsvExportButton
      address={address}
      className={className}
      columns={interestColumns}
      filePrefix="perps-interest"
      hasRows={hasRows}
      isLoading={isLoading}
      rows={data}
      refetchRows={refetchRows}
    />
  )
}

function DepositsWithdrawalsCsvButton({
  address,
  className,
  hasRows,
}: Omit<ExportCsvButtonProps, 'href'>) {
  const {
    state: { activeAccount },
  } = useActiveAccountState()
  const { data, isLoading, refetch } = useUserNonFundingLedgerUpdates({
    address,
    isVault: activeAccount?.type === 'vault',
    isViewAll: true,
    enabled: false,
  })
  const refetchRows = useCallback(async () => {
    const result = await refetch()
    return result.data ?? []
  }, [refetch])

  return (
    <CsvExportButton
      address={address}
      className={className}
      columns={depositsWithdrawalsColumns}
      filePrefix="perps-deposits-withdrawals"
      hasRows={hasRows}
      isLoading={isLoading}
      rows={data}
      refetchRows={refetchRows}
    />
  )
}

function CsvExportButton<T>({
  address,
  className,
  columns,
  filePrefix,
  hasRows,
  isLoading,
  rows,
  refetchRows,
}: CsvExportButtonProps<T>) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = useCallback(async () => {
    setIsExporting(true)

    try {
      const rowsToExport = rows?.length ? rows : await refetchRows()
      downloadCsv(
        getCsvFileName(filePrefix, address),
        buildCsv(columns, rowsToExport),
      )
    } catch {
      createErrorToast('Failed to export CSV.', false, 'perps')
    } finally {
      setIsExporting(false)
    }
  }, [address, columns, filePrefix, refetchRows, rows])

  if (hasRows === false || (hasRows === undefined && !rows?.length)) {
    return null
  }

  return (
    <TableButton
      aria-busy={isExporting}
      className={className}
      disabled={isLoading || isExporting}
      onClick={handleExport}
    >
      Export as CSV
    </TableButton>
  )
}

function buildCsv<T>(
  columns: readonly CsvColumn<T>[],
  rows: readonly T[],
): string {
  const headerRow = columns.map((column) => escapeCsvCell(column.header))
  const bodyRows = rows.map((row) =>
    columns.map((column) => escapeCsvCell(column.getValue(row))).join(','),
  )

  return [headerRow.join(','), ...bodyRows].join('\r\n')
}

function escapeCsvCell(value: CsvCell): string {
  const text = value === null || value === undefined ? '' : String(value)

  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`
  }

  return text
}

function downloadCsv(fileName: string, csv: string) {
  const blob = new Blob(['\uFEFF', csv], {
    type: 'text/csv;charset=utf-8;',
  })
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = objectUrl
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(objectUrl)
}

function getCsvFileName(filePrefix: string, address: EvmAddress): string {
  const timestamp = new Date().toISOString().replace(/[:]/g, '-')
  const safeAddress = address.replace(/[^a-zA-Z0-9.-]/g, '-')

  return `${filePrefix}-${safeAddress}-${timestamp}.csv`
}

function formatCsvTimestamp(timestamp: number | undefined): string {
  if (timestamp === undefined) return ''

  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return String(timestamp)

  return date.toISOString()
}

function parseCsvNumber(
  value: number | string | undefined,
): number | undefined {
  const parsed =
    typeof value === 'number' ? value : Number.parseFloat(value ?? '')

  return Number.isFinite(parsed) ? parsed : undefined
}
