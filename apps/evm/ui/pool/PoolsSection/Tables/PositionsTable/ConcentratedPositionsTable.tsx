import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid'
import { ChartBarIcon, DownloadIcon, PlusIcon, UploadIcon } from '@heroicons/react-v1/solid'
import {
  Button,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@sushiswap/ui'
import { SUSHISWAP_V3_SUPPORTED_CHAIN_IDS } from '@sushiswap/v3-sdk'
import { useAccount } from '@sushiswap/wagmi'
import { ConcentratedLiquidityPositionWithV3Pool } from '@sushiswap/wagmi/future'
import { ConcentratedLiquidityPosition, useConcentratedLiquidityPositions } from '@sushiswap/wagmi/future/hooks'
import { ColumnDef } from '@tanstack/react-table'
import React, { FC, useCallback, useMemo } from 'react'
import { Writeable } from 'zod'

import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { NAME_COLUMN_V3, POSITION_SIZE_CELL, POSITION_UNCLAIMED_CELL, PRICE_RANGE_COLUMN } from './Cells/columns'

const COLUMNS = [
  NAME_COLUMN_V3,
  PRICE_RANGE_COLUMN,
  POSITION_SIZE_CELL,
  POSITION_UNCLAIMED_CELL,
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
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Position</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem asChild>
                  <a href={`/pool/position/${row.original.chainId}:${row.original.id}?activeTab=deposit`}>
                    <ChartBarIcon width={16} height={16} className="mr-2" /> Details
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={`/pool/position/${row.original.chainId}:${row.original.id}?activeTab=deposit`}>
                    <DownloadIcon width={16} height={16} className="mr-2" />
                    Deposit
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={`/pool/position/${row.original.chainId}:${row.original.id}?activeTab=withdraw`}>
                    <UploadIcon width={16} height={16} className="mr-2" />
                    Withdraw
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href={`/pool/${row.original.id}?activeTab=new`}>
                    <PlusIcon width={16} height={16} className="mr-2" />
                    Create
                  </a>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href={`/pool/${row.original.chainId}:${row.original.address}`}>View Pool</a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
] satisfies ColumnDef<ConcentratedLiquidityPositionWithV3Pool, unknown>[]

const tableState = { sorting: [{ id: 'positionSize', desc: true }] }

export const ConcentratedPositionsTable: FC<{
  poolId?: string
  hideClosed?: boolean
}> = ({ poolId, hideClosed }) => {
  const { address } = useAccount()
  const { chainIds, tokenSymbols } = usePoolFilters()

  const { data: positions, isInitialLoading } = useConcentratedLiquidityPositions({
    account: address,
    chainIds: SUSHISWAP_V3_SUPPORTED_CHAIN_IDS as Writeable<typeof SUSHISWAP_V3_SUPPORTED_CHAIN_IDS>,
  })

  const _positions = useMemo(() => {
    const _tokenSymbols = tokenSymbols?.filter((el) => el !== '') || []
    return (positions || [])
      ?.filter((el) => chainIds.includes(el.chainId))
      .filter((el) =>
        _tokenSymbols.length > 0
          ? _tokenSymbols.some((symbol) => {
              return [el.pool?.token0.symbol, el.pool?.token1.symbol].includes(symbol.toUpperCase())
            })
          : true
      )
      .filter((el) => {
        return (
          (hideClosed ? !el.liquidity?.eq('0') : true) &&
          (poolId ? el.address.toLowerCase() === poolId.toLowerCase() : true)
        )
      })
  }, [hideClosed, poolId, positions, chainIds, tokenSymbols])

  const rowLink = useCallback((row: ConcentratedLiquidityPosition) => {
    return `/pool/position/${row.chainId}:${row.tokenId}`
  }, [])

  return (
    <DataTable
      testId="concentrated-positions"
      state={tableState}
      loading={isInitialLoading}
      linkFormatter={rowLink}
      columns={COLUMNS}
      data={_positions}
    />
  )
}
