'use client'

import { formatTickPrice } from 'src/lib/functions'

import { PlusIcon } from '@heroicons/react/20/solid'
import type { V4Position } from '@sushiswap/graph-client/data-api'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  DataTable,
  LinkInternal,
  SkeletonCircle,
  SkeletonText,
} from '@sushiswap/ui'
import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import {
  type ReactElement,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Bound } from 'src/lib/constants'
import { useTokenAmountDollarValues } from 'src/lib/hooks/use-token-amount-dollar-values'
import { getTickLimits } from 'src/lib/pool/cl'
import { useV4PoolById, useV4Positions } from 'src/lib/pool/v4'
import { useCurrencyPair } from 'src/lib/wagmi/hooks/tokens/use-currency-pair'
import { useWalletConnection } from 'src/lib/wallet'
import { Amount, formatUSD } from 'sushi'
import {
  type SushiSwapV4ChainId,
  getEvmChainById,
  sushiSwapV4TickToPrice,
} from 'sushi/evm'
import { useConnection } from 'wagmi'
import { PositionNameCell } from '../position-name-cell'
import { PositionPriceRangeCell } from '../position-price-range-cell'

function PriceRangeCell({ position }: { position: V4Position }): ReactElement {
  const { currency0, currency1 } = useCurrencyPair({
    chainId: position.chainId,
    address0: position.pool.currency0,
    address1: position.pool.currency1,
  })
  const [inverted, setInverted] = useState(false)
  const { data: pool } = useV4PoolById({
    chainId: position.chainId,
    poolId: position.pool.poolId,
  })
  if (!currency0 || !currency1) return <SkeletonText fontSize="lg" />

  const limits = getTickLimits(position.pool.tickSpacing)
  const closed = position.liquidity === 0n
  const lowerAtLimit = position.tickLower === limits[Bound.LOWER]
  const upperAtLimit = position.tickUpper === limits[Bound.UPPER]
  const atLimit = {
    [Bound.LOWER]: inverted ? upperAtLimit : lowerAtLimit,
    [Bound.UPPER]: inverted ? lowerAtLimit : upperAtLimit,
  }
  const priceLower = sushiSwapV4TickToPrice(
    currency0,
    currency1,
    position.tickLower,
  )
  const priceUpper = sushiSwapV4TickToPrice(
    currency0,
    currency1,
    position.tickUpper,
  )
  const lower = formatTickPrice({
    price: inverted ? priceUpper.invert() : priceLower,
    atLimit,
    direction: Bound.LOWER,
  })
  const upper = formatTickPrice({
    price: inverted ? priceLower.invert() : priceUpper,
    atLimit,
    direction: Bound.UPPER,
  })
  const quote = inverted ? currency0 : currency1
  const base = inverted ? currency1 : currency0
  const currentPrice = inverted ? pool?.currency1Price : pool?.currency0Price

  return (
    <PositionPriceRangeCell
      lower={lower}
      upper={upper}
      currentPrice={currentPrice?.toSignificant(6)}
      quoteSymbol={quote.symbol}
      baseSymbol={base.symbol}
      status={
        closed ? 'closed' : position.inRange ? 'in-range' : 'out-of-range'
      }
      onInvert={() => setInverted((previous) => !previous)}
    />
  )
}

function FeesCell({ position }: { position: V4Position }): ReactElement {
  const { currency0, currency1 } = useCurrencyPair({
    chainId: position.chainId,
    address0: position.pool.currency0,
    address1: position.pool.currency1,
  })
  const amounts = useMemo(
    () =>
      currency0 && currency1 && position.pendingFees
        ? [
            new Amount(currency0, position.pendingFees.amount0),
            new Amount(currency1, position.pendingFees.amount1),
          ]
        : undefined,
    [currency0, currency1, position.pendingFees],
  )
  const values = useTokenAmountDollarValues({
    chainId: position.chainId,
    amounts,
  })
  if (!position.pendingFees) return <span>-</span>
  if (!currency0 || !currency1) return <SkeletonText fontSize="lg" />

  return <>{formatUSD(values.reduce((total, value) => total + value, 0))}</>
}

const COLUMNS: ColumnDef<V4Position, unknown>[] = [
  {
    id: 'name',
    header: 'Name',
    cell: ({ row: { original } }) => (
      <PositionNameCell
        chainId={original.chainId}
        currency0={original.pool.currency0}
        currency1={original.pool.currency1}
        version="V4"
        fee={
          original.pool.fee.__typename === 'TerminalDynamicFee'
            ? 'dynamic'
            : original.pool.fee.rate
        }
      />
    ),
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
    size: 250,
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
  const { isRestoring, isPending } = useWalletConnection('evm')
  const { data: positions, isLoading } = useV4Positions({
    chainId,
    account: address,
  })

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'positionSize', desc: true },
  ])

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
  const maxPageIndex = Math.max(
    0,
    Math.ceil(filtered.length / paginationState.pageSize) - 1,
  )
  useEffect(() => {
    setPaginationState((previous) =>
      previous.pageIndex > maxPageIndex
        ? { ...previous, pageIndex: maxPageIndex }
        : previous,
    )
  }, [maxPageIndex])

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
        loading={isRestoring || isPending || isLoading}
        linkFormatter={(row) =>
          `/${chainKey}/pool/v4/${row.pool.poolId}/${row.tokenId}`
        }
        columns={COLUMNS}
        data={filtered}
        pagination
        onPaginationChange={setPaginationState}
        onSortingChange={setSorting}
        state={{ sorting, pagination: paginationState }}
      />
    </Card>
  )
}
