'use client'

import type { BladePosition } from '@sushiswap/graph-client/data-api'
import {
  Badge,
  Card,
  CardHeader,
  CardTitle,
  Currency,
  DataTable,
  SkeletonCircle,
  SkeletonText,
  Switch,
} from '@sushiswap/ui'
import { CurrencyFiatIcon } from '@sushiswap/ui/icons/CurrencyFiatIcon'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import { type FC, useMemo, useState } from 'react'
import {
  getPoolNameFromGroupedTokens,
  getPoolTokensGrouped,
} from 'src/lib/pool/blade'
import { useBladeUserPositions } from 'src/lib/pool/blade/useBladeUserPositions'
import { formatPercent, formatUSD } from 'sushi'
import { type BladeChainId, getEvmChainById } from 'sushi/evm'
import { useAccount } from 'wagmi'

interface BladePositionsTableProps {
  chainId: BladeChainId
}

interface BladePositionsTableMeta {
  showStablecoinTypes: boolean
}

const NAME_COLUMN: ColumnDef<BladePosition, unknown> = {
  id: 'name',
  header: 'Name',
  cell: ({ row, table }) => {
    const meta = table.options.meta as BladePositionsTableMeta
    const showStablecoinTypes = meta?.showStablecoinTypes ?? false
    const pool = row.original.pool

    const groupedTokens = useMemo(
      () => getPoolTokensGrouped(row.original.pool),
      [row.original.pool],
    )
    const poolName = useMemo(
      () =>
        getPoolNameFromGroupedTokens(groupedTokens, {
          showStableTypes: showStablecoinTypes,
        }),
      [groupedTokens, showStablecoinTypes],
    )

    const { tokens, stablecoinUsdTokens } = groupedTokens
    const hasStablecoin = stablecoinUsdTokens.length > 0

    return (
      <div className="flex items-center gap-3">
        <div className="flex min-w-[44px]">
          <Badge
            className="!-right-[6px] !-bottom-[2px] z-[11] rounded-full border-2 border-white"
            position="bottom-right"
            badgeContent={
              <NetworkIcon chainId={pool.chainId} width={14} height={14} />
            }
          >
            <Currency.IconList iconWidth={30} iconHeight={30}>
              {tokens.map((token) => (
                <Currency.Icon key={token.wrap().address} currency={token} />
              ))}
              {hasStablecoin && !showStablecoinTypes ? (
                <CurrencyFiatIcon width={30} height={30} />
              ) : (
                stablecoinUsdTokens.map((token) => (
                  <Currency.Icon key={token.wrap().address} currency={token} />
                ))
              )}
            </Currency.IconList>
          </Badge>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-gray-900 dark:text-slate-50">
            {poolName}
          </span>
          {pool.isDeprecated && (
            <div className="flex gap-1">
              <div className="bg-amber-100 text-amber-900 text-[10px] px-2 rounded-full">
                Deprecated
              </div>
            </div>
          )}
        </div>
      </div>
    )
  },
  size: 200,
  meta: {
    body: {
      skeleton: (
        <div className="flex items-center w-full gap-2">
          <div className="flex items-center">
            <SkeletonCircle radius={26} />
            <SkeletonCircle radius={26} className="-ml-[12px]" />
          </div>
          <div className="flex flex-col w-full">
            <SkeletonText fontSize="lg" />
          </div>
        </div>
      ),
    },
  },
}

const POSITION_SIZE_COLUMN: ColumnDef<BladePosition, number> = {
  id: 'positionSize',
  header: 'Position Size',
  accessorFn: (row) => {
    const balance = row.stakedBalance + row.unstakedBalance + row.vestingBalance
    const totalSupply = row.pool.liquidity
    const poolLiquidityUSD = row.pool.liquidityUSD

    const fractionOwned =
      totalSupply !== BigInt(0) ? Number(balance) / Number(totalSupply) : 0
    const positionSize = fractionOwned * poolLiquidityUSD

    return positionSize
  },
  cell: ({ getValue }) => {
    const positionSize = getValue()
    return (
      <span className="font-medium text-gray-900 dark:text-slate-50">
        {formatUSD(positionSize)}
      </span>
    )
  },
  size: 150,
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

const APR_COLUMN: ColumnDef<BladePosition, unknown> = {
  id: 'apr',
  header: 'APR',
  accessorFn: (row) => row.pool.totalApr1d,
  cell: ({ row }) => (
    <span className="font-medium text-gray-900 dark:text-slate-50">
      {formatPercent(row.original.pool.totalApr1d)}
    </span>
  ),
  size: 120,
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

const COLUMNS = [NAME_COLUMN, POSITION_SIZE_COLUMN, APR_COLUMN] as ColumnDef<
  BladePosition,
  unknown
>[]

const tableState = { sorting: [{ id: 'positionSize', desc: true }] }

export const BladePositionsTable: FC<BladePositionsTableProps> = ({
  chainId,
}) => {
  const { address } = useAccount()
  const [showStablecoinTypes, setShowStablecoinTypes] = useState(false)
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: positions, isLoading } = useBladeUserPositions({
    user: address,
    chainId,
  })

  const _positions = useMemo(() => {
    if (!positions) return []
    return positions
  }, [positions])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            <span>
              My Blade Positions{' '}
              <span className="text-gray-400 dark:text-slate-500">
                ({_positions.length})
              </span>
            </span>
            <div className="flex items-center gap-3 whitespace-nowrap">
              <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                Show stablecoin types
              </span>
              <Switch
                checked={showStablecoinTypes}
                onCheckedChange={setShowStablecoinTypes}
              />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <DataTable
        loading={isLoading}
        linkFormatter={(row) =>
          `/${getEvmChainById(chainId).key}/pool/blade/${row.pool.address}/add`
        }
        columns={COLUMNS}
        data={_positions}
        pagination={true}
        onPaginationChange={setPaginationState}
        state={{
          ...tableState,
          pagination: paginationState,
        }}
        meta={{ showStablecoinTypes }}
      />
    </Card>
  )
}
