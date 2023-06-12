'use client'

import { RefreshIcon } from '@heroicons/react-v1/solid'
import { ChainId, chainName } from '@sushiswap/chain'
import { formatNumber, formatPercent } from '@sushiswap/format'
import { CHAIN_NAME } from '@sushiswap/graph-config'
import { CheckIcon, NetworkIcon, Tooltip } from '@sushiswap/ui'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { GenericTable } from '@sushiswap/ui/table'
import { Subgraph } from '../lib'

interface SubgraphTable {
  subgraphs: Subgraph[]
  groupBy: keyof Subgraph
}

const columnHelper = createColumnHelper<Subgraph>()
const columns = [
  columnHelper.accessor('category', {
    header: 'Category',
    cell: (info) => info.getValue(),
    enableHiding: true,
  }),
  columnHelper.accessor('chainId', {
    header: 'Chain',
    cell: (info) => {
      const chainId = info.getValue()

      return (
        <div className="flex space-x-2">
          <NetworkIcon type="circle" chainId={chainId as ChainId} width={20} height={20} />
          <div>{CHAIN_NAME[chainId as ChainId] ?? chainName[chainId as ChainId]}</div>
        </div>
      )
    },
    enableHiding: true,
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: (info) => (
      <div className="flex justify-center">
        {info.getValue() === 'Current' ? (
          <Tooltip panel={<>Synced</>} button={<CheckIcon width={24} height={24} />} />
        ) : (
          <Tooltip panel={<>Syncing</>} button={<RefreshIcon width={24} height={24} />} />
        )}
      </div>
    ),
  }),
  columnHelper.accessor('subgraphName', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('startBlock', {
    header: 'Start Block',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'Synced %',
    header: 'Synced %',
    cell: ({ row }) => formatPercent(row.original.lastSyncedBlock / row.original.chainHeadBlock),
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
              {status} ({formatNumber(unsyncedBlockCount).replace(/\.(00|0)/, '')})
            </div>
          );
        case 'Failed':
          return <div className="text-red">{status}</div>
      }
    },
  }),
]

export function SubgraphTable({ subgraphs, groupBy }: SubgraphTable) {
  const table = useReactTable<Subgraph>({
    data: subgraphs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnVisibility: { [groupBy]: false },
    },
  })

  return (
    // @ts-ignore
    <GenericTable<Subgraph>
      table={table}
      // @ts-ignore
      columns={columns}
      pageSize={20}
      getLink={(row) => `https://thegraph.com/hosted-service/subgraph/${row.subgraphName}`}
    />
  )
}
