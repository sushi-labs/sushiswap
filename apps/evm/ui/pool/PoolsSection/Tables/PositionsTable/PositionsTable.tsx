import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid'
import { DownloadIcon, UploadIcon } from '@heroicons/react-v1/solid'
import { Protocol } from '@sushiswap/database'
import {
  Button,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@sushiswap/ui'
import { useAccount } from '@sushiswap/wagmi'
import { ColumnDef } from '@tanstack/react-table'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { useUserPositions } from 'lib/hooks'
import React, { FC, useCallback, useMemo } from 'react'
import { PositionWithPool } from 'types'

import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { APR_COLUMN, NAME_COLUMN, VALUE_COLUMN } from './Cells/columns'

const COLUMNS = [
  NAME_COLUMN,
  VALUE_COLUMN,
  APR_COLUMN,
  {
    id: 'actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button icon={EllipsisHorizontalIcon} variant="ghost" size="sm">
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem asChild>
            <a href={`/pool/${row.original.chainId}:${row.original.pool.address}`}>View pool</a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a
              className="flex items-center"
              href={`/pool/${row.original.chainId}:${row.original.pool.address}/deposit`}
            >
              <DownloadIcon width={16} height={16} className="mr-2" />
              Deposit
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              className="flex items-center"
              href={`/pool/${row.original.chainId}:${row.original.pool.address}/withdraw`}
            >
              <UploadIcon width={16} height={16} className="mr-2" />
              Withdraw
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
] satisfies ColumnDef<PositionWithPool, unknown>[]

interface PositionsTableProps {
  protocol: Protocol
}

const tableState = { sorting: [{ id: 'value', desc: true }] }

export const PositionsTable: FC<PositionsTableProps> = ({ protocol }) => {
  const { address } = useAccount()
  const { chainIds, tokenSymbols } = usePoolFilters()

  const { data: positions, isValidating } = useUserPositions({ id: address, chainIds: SUPPORTED_CHAIN_IDS })

  const _positions = useMemo(() => {
    if (!positions) return []

    const _tokenSymbols = tokenSymbols?.filter((el) => el !== '') || []
    const searchFiltered = positions.filter((el) =>
      _tokenSymbols.length > 0
        ? _tokenSymbols.some((symbol) => {
            return [el.pool?.token0.symbol, el.pool?.token1.symbol].includes(symbol.toUpperCase())
          })
        : true
    )
    const chainFiltered = searchFiltered.filter((el) => chainIds.includes(el.chainId))
    return chainFiltered.filter((el) => el.pool?.protocol === protocol)
  }, [positions, tokenSymbols, chainIds, protocol])

  const rowLink = useCallback((row: PositionWithPool) => {
    return `/pool/${row.pool.id}`
  }, [])

  return (
    <DataTable state={tableState} loading={isValidating} linkFormatter={rowLink} columns={COLUMNS} data={_positions} />
  )
}
