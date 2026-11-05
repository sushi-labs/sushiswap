'use client'

import { formatTickPrice } from 'src/lib/functions'

import { PlusIcon } from '@heroicons/react/20/solid'
import type { V4Position } from '@sushiswap/graph-client/data-api'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Currency,
  DataTable,
  FormattedNumber,
  LinkInternal,
  SkeletonCircle,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import { type ReactElement, type ReactNode, useMemo, useState } from 'react'
import { Bound } from 'src/lib/constants'
import { getTickLimits } from 'src/lib/pool/cl'
import { useV4Positions } from 'src/lib/pool/v4'
import { useCurrencyWithCache } from 'src/lib/wagmi/hooks/tokens/use-currency-with-cache'
import { Amount, formatUSD } from 'sushi'
import {
  type SushiSwapV4ChainId,
  getEvmChainById,
  sushiSwapV4TickToPrice,
} from 'sushi/evm'
import { useConnection } from 'wagmi'

function useV4PositionCurrencies(position: V4Position) {
  const currency0 = useCurrencyWithCache({
    chainId: position.chainId,
    address: position.pool.currency0,
  })
  const currency1 = useCurrencyWithCache({
    chainId: position.chainId,
    address: position.pool.currency1,
  })
  return [currency0.data, currency1.data] as const
}

function NameCell({ position }: { position: V4Position }): ReactElement {
  const [currency0, currency1] = useV4PositionCurrencies(position)
  if (!currency0 || !currency1) return <SkeletonText fontSize="lg" />

  return (
    <div className="flex items-center gap-5">
      <Currency.IconList iconWidth={26} iconHeight={26}>
        <Currency.Icon disableLink currency={currency0} />
        <Currency.Icon disableLink currency={currency1} />
      </Currency.IconList>
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {currency0.symbol}
          <span className="font-normal text-gray-900 dark:text-slate-500">
            /
          </span>
          {currency1.symbol}
        </span>
        <span className="text-xs text-gray-500 dark:text-slate-400">
          #{position.tokenId.toString()}
        </span>
      </div>
    </div>
  )
}

function PriceRangeCell({ position }: { position: V4Position }): ReactElement {
  const [currency0, currency1] = useV4PositionCurrencies(position)
  if (!currency0 || !currency1) return <SkeletonText fontSize="lg" />

  const limits = getTickLimits(position.pool.tickSpacing)
  const closed = position.liquidity === 0n
  const atLimit = {
    [Bound.LOWER]: position.tickLower === limits[Bound.LOWER],
    [Bound.UPPER]: position.tickUpper === limits[Bound.UPPER],
  }
  const lower = formatTickPrice({
    price: sushiSwapV4TickToPrice(currency0, currency1, position.tickLower),
    atLimit,
    direction: Bound.LOWER,
  })
  const upper = formatTickPrice({
    price: sushiSwapV4TickToPrice(currency0, currency1, position.tickUpper),
    atLimit,
    direction: Bound.UPPER,
  })

  return (
    <div className="flex items-center gap-2">
      <div
        className={classNames(
          closed ? 'bg-gray-400' : position.inRange ? 'bg-green' : 'bg-red',
          'w-2 h-2 rounded-full',
        )}
      />
      <span className="text-sm">
        <FormattedNumber number={lower} /> - <FormattedNumber number={upper} />{' '}
        <span className="text-muted-foreground">
          {currency1.symbol} per {currency0.symbol}
        </span>
      </span>
    </div>
  )
}

function FeesCell({ position }: { position: V4Position }): ReactElement {
  const [currency0, currency1] = useV4PositionCurrencies(position)
  if (!position.pendingFees) return <span>-</span>
  if (!currency0 || !currency1) return <SkeletonText fontSize="lg" />

  return (
    <div className="flex flex-col text-sm">
      <span>
        {new Amount(currency0, position.pendingFees.amount0).toSignificant(4)}{' '}
        {currency0.symbol}
      </span>
      <span>
        {new Amount(currency1, position.pendingFees.amount1).toSignificant(4)}{' '}
        {currency1.symbol}
      </span>
    </div>
  )
}

const COLUMNS: ColumnDef<V4Position, unknown>[] = [
  {
    id: 'name',
    header: 'Name',
    cell: (props) => <NameCell position={props.row.original} />,
    meta: {
      body: {
        skeleton: (
          <div className="flex items-center w-full gap-2">
            <div className="flex items-center">
              <SkeletonCircle radius={26} />
              <SkeletonCircle radius={26} className="-ml-[12px]" />
            </div>
            <SkeletonText fontSize="lg" />
          </div>
        ),
      },
    },
  },
  {
    id: 'priceRange',
    header: 'Price Range',
    cell: (props) => <PriceRangeCell position={props.row.original} />,
    meta: { body: { skeleton: <SkeletonText fontSize="lg" /> } },
  },
  {
    id: 'positionSize',
    header: 'Position Size',
    accessorFn: (row) => row.amountUSD ?? 0,
    cell: (props) =>
      props.row.original.amountUSD === null
        ? '-'
        : formatUSD(props.row.original.amountUSD),
    meta: { body: { skeleton: <SkeletonText fontSize="lg" /> } },
  },
  {
    id: 'unclaimed',
    header: 'Unclaimed fees',
    cell: (props) => <FeesCell position={props.row.original} />,
    meta: { body: { skeleton: <SkeletonText fontSize="lg" /> } },
  },
]

const tableState = { sorting: [{ id: 'positionSize', desc: true }] }

interface V4PositionsTableProps {
  chainId: SushiSwapV4ChainId
  /** Only this pool's positions, with a button to create one in it. */
  poolId?: `0x${string}`
  hideClosedPositions?: boolean
  actions?: ReactNode
}

export function V4PositionsTable({
  chainId,
  poolId,
  hideClosedPositions = true,
  actions,
}: V4PositionsTableProps): ReactElement {
  const { address } = useConnection()
  const { data: positions, isLoading } = useV4Positions({
    chainId,
    account: address,
  })

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const filtered = useMemo(
    () =>
      (positions ?? []).filter(
        (position) =>
          (!hideClosedPositions || position.liquidity !== 0n) &&
          (!poolId ||
            position.pool.poolId.toLowerCase() === poolId.toLowerCase()),
      ),
    [positions, hideClosedPositions, poolId],
  )

  const chainKey = getEvmChainById(chainId).key

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="flex-grow whitespace-nowrap">
              My Positions{' '}
              <span className="text-gray-400 dark:text-slate-500">
                ({filtered.length})
              </span>
            </span>
            {poolId ? (
              <LinkInternal
                shallow
                href={`/${chainKey}/pool/v4/${poolId}/create`}
                className="basis-full md:basis-[unset]"
              >
                <Button icon={PlusIcon} asChild size="sm" className="w-full">
                  Create position
                </Button>
              </LinkInternal>
            ) : null}
            {actions}
          </div>
        </CardTitle>
      </CardHeader>
      <DataTable
        testId="v4-positions"
        loading={isLoading}
        linkFormatter={(row) =>
          `/${chainKey}/pool/v4/${row.pool.poolId}/${row.tokenId}`
        }
        columns={COLUMNS}
        data={filtered}
        pagination
        onPaginationChange={setPaginationState}
        state={{ ...tableState, pagination: paginationState }}
      />
    </Card>
  )
}
