import {
  ClipboardCheckIcon,
  ClipboardCopyIcon,
} from '@heroicons/react-v1/outline'
import { useCopyClipboard } from '@sushiswap/hooks'
import type { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import type { ReactElement } from 'react'
import { useUserAbstraction } from 'src/lib/perps/info/use-user-abstraction'
import { currencyFormatter } from 'src/lib/perps/utils'
import { truncateString } from 'sushi'
import type { EvmAddress } from 'sushi/evm'
import { TableButton } from '../../_ui/_common/table-button'
import { SubAccountTransferDialog } from '../../_ui/account-management/sub-account-transfer-dialog'
import { columnBodyMeta } from '../../_ui/trade-tables/_common/column-meta'
import { useActiveAccountState } from '../../active-account-provider'
import { RenameSubAccountDialog } from './rename-sub-account-dialog'

export type SubAccountTableRow = {
  address: EvmAddress
  masterAddress: EvmAddress
  name: string
  type: 'master' | 'sub'
  perpsEquity: number | null
  spotEquity: number | null
  isLoadingPerps: boolean
  isLoadingSpot: boolean
}

export const NAME_COLUMN: ColumnDef<SubAccountTableRow, unknown> = {
  id: 'name',
  header: 'Name',
  accessorFn: (row) => row.name,
  enableSorting: false,
  cell: ({ row }) => {
    const account = row.original
    return (
      <div className="flex items-center gap-2 font-medium lg:whitespace-nowrap ">
        <span>{account.name}</span>
        {account.type === 'sub' && (
          <RenameSubAccountDialog
            masterAddress={account.masterAddress}
            subAccount={{ subAccountUser: account.address, name: account.name }}
          />
        )}
      </div>
    )
  },
  meta: { body: columnBodyMeta, header: { className: 'pl-2' } },
}

export const ADDRESS_COLUMN: ColumnDef<SubAccountTableRow, unknown> = {
  id: 'address',
  header: 'Address',
  accessorFn: (row) => row.address,
  enableSorting: false,
  cell: function AddressCell({ row }): ReactElement {
    const account = row.original
    const [isCopied, copy] = useCopyClipboard()

    return (
      <div className="flex items-center gap-2 font-medium lg:whitespace-nowrap">
        <span title={account.address} className="hidden xl:inline">
          {account.address}
        </span>
        <span title={account.address} className="xl:hidden">
          {truncateString(account.address, 12, 'middle')}
        </span>
        <TableButton
          aria-label={
            isCopied
              ? `Copied ${account.name} address`
              : `Copy ${account.name} address`
          }
          onClick={(event) => {
            event.stopPropagation()
            copy(account.address)
          }}
        >
          {isCopied ? (
            <ClipboardCheckIcon className="h-3.5 w-3.5" />
          ) : (
            <ClipboardCopyIcon className="h-3.5 w-3.5" />
          )}
        </TableButton>
      </div>
    )
  },
  meta: { body: columnBodyMeta },
}

export const PERPS_EQUITY_COLUMN: ColumnDef<SubAccountTableRow, unknown> = {
  id: 'perpsEquity',
  header: 'Perps Account Equity',
  accessorFn: (row) => row.perpsEquity,
  enableSorting: false,
  cell: function PerpsEquityCell({ row }): ReactElement {
    const account = row.original
    const abstraction = useUserAbstraction({ address: account.address })
    const isUnified =
      abstraction.data === 'unifiedAccount' ||
      abstraction.data === 'portfolioMargin'
    const perpsEquity =
      abstraction.data && !isUnified ? account.perpsEquity : null

    return (
      <span
        className="font-medium lg:whitespace-nowrap"
        title={
          isUnified
            ? 'Equity is held in the spot balance for this account mode.'
            : undefined
        }
      >
        {abstraction.isLoading || (!isUnified && account.isLoadingPerps)
          ? 'Loading...'
          : perpsEquity === null
            ? '--'
            : currencyFormatter.format(perpsEquity)}
      </span>
    )
  },
  meta: { body: columnBodyMeta },
}

export const SPOT_EQUITY_COLUMN: ColumnDef<SubAccountTableRow, unknown> = {
  id: 'spotEquity',
  header: 'Spot Account Equity',
  accessorFn: (row) => row.spotEquity,
  enableSorting: false,
  cell: ({ row }) => {
    const { spotEquity, isLoadingSpot } = row.original
    return (
      <span className="font-medium lg:whitespace-nowrap">
        {isLoadingSpot
          ? 'Loading...'
          : spotEquity === null
            ? '--'
            : currencyFormatter.format(spotEquity)}
      </span>
    )
  },
  meta: { body: columnBodyMeta },
}

export const ACTIONS_COLUMN: ColumnDef<SubAccountTableRow, unknown> = {
  id: 'actions',
  header: 'Action',
  enableSorting: false,
  cell: function ActionsCell({ row }): ReactElement {
    const account = row.original
    const router = useRouter()
    const {
      mutate: { setActiveAccount },
    } = useActiveAccountState()

    function trade(): void {
      setActiveAccount(account.address, account.type, account.name)
      router.push('/perps')
    }

    return (
      <div className="flex items-center gap-4 lg:whitespace-nowrap lg:justify-end lg:pr-3">
        {account.type === 'sub' ? (
          <SubAccountTransferDialog
            masterAddress={account.masterAddress}
            subAccount={{ subAccountUser: account.address, name: account.name }}
            trigger={<TableButton>Transfer</TableButton>}
          />
        ) : null}
        <TableButton onClick={trade}>Trade</TableButton>
      </div>
    )
  },
  meta: {
    body: columnBodyMeta,
    header: { className: '!pl-2 text-right pr-3' },
  },
}
