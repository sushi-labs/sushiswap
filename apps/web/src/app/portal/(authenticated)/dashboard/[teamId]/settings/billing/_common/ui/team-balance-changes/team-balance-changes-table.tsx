'use client'

import { useIsMounted } from '@sushiswap/hooks'
import type { StyroResults } from '@sushiswap/styro-client'
import { Button, DataTable, classNames } from '@sushiswap/ui'
import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { _RemoveSectionUnstake } from '~aptos/_common/components/RemoveSection/remove-section-unstake'
import { Erc20DepositDialog } from './erc-20-deposit-dialog'

type Team = StyroResults['getTeamsTeamIdBilling']['data']['team']

type BillDeduction = Team['balanceDeductions']['billDeductions'][number] & {
  type: 'Bill Deduction'
}
export type Erc20Deposit = Team['balanceDeposits']['erc20Deposits'][number] & {
  type: 'ERC20 Deposit'
}
type VoucherDeposit = Team['balanceDeposits']['voucherDeposits'][number] & {
  type: 'Voucher Deposit'
}

type BalanceChange = BillDeduction | VoucherDeposit | Erc20Deposit

interface TeamBalanceChangesTable {
  team: Team
}

const columns = [
  {
    header: 'Date',
    id: 'createdAt',
    accessorFn: (row: BalanceChange) => row.createdAt,
    cell: ({ row }) => {
      const isMounted = useIsMounted()

      // Prevent hydration error
      if (!isMounted) return null

      return row.original.createdAt.toLocaleDateString(undefined, {
        hour: 'numeric',
        minute: 'numeric',
      })
    },
  },
  {
    header: 'Type',
    accessorFn: (row: BalanceChange) => row.type,
    cell: ({ row }) => {
      return <span className="capitalize">{row.original.type}</span>
    },
    enableSorting: false,
  },
  {
    header: 'Amount',
    accessorFn: (row: BalanceChange) => row.amountUSD,
    cell: ({ row }) => {
      const amountUSD = row.original.amountUSD

      return (
        <span
          className={classNames(
            amountUSD > 0 && 'text-green-500',
            amountUSD < 0 && 'text-red-500',
          )}
        >
          {amountUSD > 0 && '+'}
          {amountUSD.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}
        </span>
      )
    },
  },
  {
    header: 'Details',
    id: 'details',
    enableSorting: false,
    cell: ({ row }) => {
      switch (row.original.type) {
        case 'Voucher Deposit': {
          return '-'
        }
        case 'ERC20 Deposit': {
          return (
            <Erc20DepositDialog erc20Deposit={row.original}>
              <Button size="sm" variant="secondary">
                View More
              </Button>
            </Erc20DepositDialog>
          )
        }
        case 'Bill Deduction': {
          return <div>Plan: {row.original.planName}</div>
        }
      }
    },
  },
] satisfies ColumnDef<BalanceChange, unknown>[]

export function TeamBalanceChangesTable({ team }: TeamBalanceChangesTable) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ])

  const data = useMemo(() => {
    const voucherDeposits =
      team.balanceDeposits.voucherDeposits.map<VoucherDeposit>((deposit) => ({
        ...deposit,
        amountUSD: deposit.amountUSD,
        type: 'Voucher Deposit',
      }))

    const erc20Deposits = team.balanceDeposits.erc20Deposits.map<Erc20Deposit>(
      (deposit) => ({
        ...deposit,
        amountUSD: deposit.amountUSD,
        type: 'ERC20 Deposit',
      }),
    )

    const billDeductions =
      team.balanceDeductions.billDeductions.map<BillDeduction>((deduction) => ({
        ...deduction,
        amountUSD: -deduction.amountUSD,
        type: 'Bill Deduction',
      }))
    return [...voucherDeposits, ...erc20Deposits, ...billDeductions]
  }, [team])

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={false}
      pagination={true}
      onPaginationChange={setPagination}
      state={useMemo(() => ({ pagination, sorting }), [pagination, sorting])}
      onSortingChange={setSorting}
    />
  )
}
