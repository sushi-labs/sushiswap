'use client'

import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Currency,
  DataTable,
  NetworkIcon,
  SkeletonText,
} from '@sushiswap/ui'
import {
  ColumnDef,
  PaginationState,
  SortingState,
  TableState,
} from '@tanstack/react-table'
import React, { FC, useMemo, useState } from 'react'
import { formatNumber, formatUSD } from 'sushi/format'

import {
  BentoBoxToken,
  GetBentoBoxTokenArgs,
  useBentoBoxTokens,
} from './use-bentobox-tokens'

import { usePoolFilters } from 'src/ui/pool'

const COLUMNS: ColumnDef<BentoBoxToken, unknown>[] = [
  {
    id: 'tokenName',
    header: 'Name',
    cell: ({
      row: {
        original: { token },
      },
    }) => (
      <div className="flex items-center gap-5">
        <div className="flex">
          <Badge
            className="border-2 border-slate-900 rounded-full z-[11]"
            position="bottom-right"
            badgeContent={
              <NetworkIcon chainId={token.chainId} width={14} height={14} />
            }
          >
            <Currency.Icon
              disableLink
              currency={token}
              width={26}
              height={26}
            />
          </Badge>
        </div>
        <div className="flex flex-col">
          <p>{token.symbol}</p>
          <p className="text-xs text-muted-foreground">{token.name}</p>
        </div>
      </div>
    ),
    meta: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
  {
    id: 'liquidity',
    header: 'Liquidity',
    cell: (props) => {
      return formatNumber(props.row.original.liquidity)
    },
    meta: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
  {
    id: 'liquidityUSD',
    header: 'Liquidity (USD)',
    accessorFn: (row) => row.liquidityUSD,
    cell: (props) => {
      return formatUSD(props.row.original.liquidityUSD)
    },
    meta: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
]

export const BentoBoxTokenTable: FC = () => {
  const { chainIds, tokenSymbols } = usePoolFilters()

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'liquidityUSD', desc: true },
  ])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const args = useMemo<GetBentoBoxTokenArgs>(
    () => ({
      chainIds,
      tokenSymbols,
    }),
    [chainIds, tokenSymbols],
  )

  const { data: bentoBoxTokens, isLoading } = useBentoBoxTokens(args)

  const data = useMemo(() => bentoBoxTokens || [], [bentoBoxTokens])

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination,
    }
  }, [pagination, sorting])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Tokens{' '}
          {bentoBoxTokens?.length ? (
            <span className="text-gray-400 dark:text-slate-500">
              ({bentoBoxTokens?.length})
            </span>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="!px-0 !pb-0">
        <DataTable
          loading={isLoading}
          columns={COLUMNS}
          data={data}
          pagination={true}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          state={state}
        />
      </CardContent>
    </Card>
  )
}
