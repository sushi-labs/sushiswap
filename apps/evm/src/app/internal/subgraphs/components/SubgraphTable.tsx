'use client'

import { RefreshIcon } from '@heroicons/react-v1/solid'
import { CHAIN_NAME } from '@sushiswap/graph-config'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CheckIcon,
  DataTable,
  NetworkIcon,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import {
  ColumnDef,
  PaginationState,
  createColumnHelper,
} from '@tanstack/react-table'
import { useState } from 'react'
import { ChainId, chainName } from 'sushi/chain'
import { formatNumber, formatPercent } from 'sushi/format'

import { Subgraph } from '../lib'

interface SubgraphTable {
  subgraphs: Subgraph[]
  groupBy: keyof Subgraph
  title: string
}

const columnHelper = createColumnHelper<Subgraph>()
const columns: ColumnDef<Subgraph, unknown>[] = [
  columnHelper.display({
    id: 'category',
    header: 'Category',
    cell: ({
      row: {
        original: { category },
      },
    }) => category,
    enableHiding: true,
  }),
  columnHelper.display({
    id: 'chainId',
    header: 'Chain',
    cell: ({
      row: {
        original: { chainId },
      },
    }) => {
      return (
        <div className="flex space-x-2">
          <NetworkIcon
            type="circle"
            chainId={chainId as ChainId}
            width={20}
            height={20}
          />
          <div>
            {CHAIN_NAME[chainId as ChainId] ?? chainName[chainId as ChainId]}
          </div>
        </div>
      )
    },
    enableHiding: true,
  }),
  columnHelper.display({
    id: 'type',
    header: 'Type',
    cell: ({
      row: {
        original: { type },
      },
    }) => {
      return (
        <div className="flex justify-center">
          {type === 'Current' ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <CheckIcon width={24} height={24} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Synced</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <RefreshIcon width={24} height={24} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Syncing</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )
    },
  }),
  columnHelper.display({
    id: 'subgraphName',
    header: 'Name',
    cell: ({
      row: {
        original: { subgraphName },
      },
    }) => subgraphName,
  }),
  columnHelper.accessor('startBlock', {
    header: 'Start Block',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'Synced %',
    header: 'Synced %',
    cell: ({ row }) =>
      formatPercent(row.original.lastSyncedBlock / row.original.chainHeadBlock),
  }),
  columnHelper.accessor('lastSyncedBlock', {
    header: 'Synced Block',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('chainHeadBlock', {
    header: 'Last Block',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('nonFatalErrorCount', {
    header: 'NFError Count',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'Status',
    header: 'Status',
    cell: ({
      row: {
        original: { status, chainHeadBlock, lastSyncedBlock },
      },
    }) => {
      const unsyncedBlockCount = chainHeadBlock - lastSyncedBlock

      switch (status) {
        case 'Synced':
          return (
            <div className="text-green">
              {status} {unsyncedBlockCount !== 0 && <>({unsyncedBlockCount})</>}
            </div>
          )
        case 'Syncing':
          return (
            <div className="text-yellow">
              {status} (
              {formatNumber(unsyncedBlockCount).replace(/\.(00|0)/, '')})
            </div>
          )
        case 'Failed':
          return <div className="text-red">{status}</div>
      }
    },
  }),
]

export function SubgraphTable({ title, subgraphs, groupBy }: SubgraphTable) {
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="!px-0">
        <DataTable
          loading={false}
          columns={columns}
          data={subgraphs}
          pagination={true}
          onPaginationChange={setPaginationState}
          state={{
            columnVisibility: { [groupBy]: false },
            pagination: paginationState,
          }}
          externalLink={true}
          linkFormatter={(row) =>
            `https://thegraph.com/hosted-service/subgraph/${row.subgraphName}`
          }
        />
      </CardContent>
    </Card>
  )
}
