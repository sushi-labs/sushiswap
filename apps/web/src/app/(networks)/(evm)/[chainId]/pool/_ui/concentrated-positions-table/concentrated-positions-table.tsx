'use client'

import { PlusIcon } from '@heroicons/react/20/solid'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  DataTableSortMenu,
  DataTableVirtual,
  DialogTrigger,
  LinkInternal,
  MobileTable,
  Slot,
} from '@sushiswap/ui'
import type {
  ColumnDef,
  Row,
  SortingState,
  TableState,
} from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import { usePoolFilters } from 'src/app/(networks)/_ui/pools-filters-provider'
import { useConcentratedLiquidityPositions } from 'src/lib/wagmi/hooks/positions/hooks/use-concentrated-liquidity-positions'
import type { ConcentratedLiquidityPositionWithV3Pool } from 'src/lib/wagmi/hooks/positions/types'
import { Checker } from 'src/lib/wagmi/systems/checker'
import {
  type EvmChainId,
  getEvmChainById,
  isSushiSwapV3ChainId,
} from 'sushi/evm'
import { useConnection } from 'wagmi'
import { ConcentratedLiquidityCollectAllDialog } from '~evm/_ui/concentrated-liquidity-collect-all-dialog'
import {
  NAME_COLUMN_V3,
  POSITION_SIZE_CELL,
  POSITION_UNCLAIMED_CELL,
  PRICE_RANGE_COLUMN,
} from './columns'

const COLUMNS = [
  NAME_COLUMN_V3,
  PRICE_RANGE_COLUMN,
  POSITION_SIZE_CELL,
  POSITION_UNCLAIMED_CELL,
] satisfies ColumnDef<ConcentratedLiquidityPositionWithV3Pool, unknown>[]

const MOBILE_COLUMNS = [
  NAME_COLUMN_V3,
  { id: 'blank-1', header: () => null, cell: () => null },
  { id: 'blank-2', header: () => null, cell: () => null },
  POSITION_SIZE_CELL,
  POSITION_UNCLAIMED_CELL,
  { id: 'blank-3', header: () => null, cell: () => null },
  PRICE_RANGE_COLUMN,
] satisfies ColumnDef<ConcentratedLiquidityPositionWithV3Pool, unknown>[]

const SORT_OPTIONS = [
  { id: 'positionSize', label: 'Position Size' },
  { id: 'unclaimed', label: 'Unclaimed fees' },
]

interface ConcentratedPositionsTableProps {
  chainId: EvmChainId
  poolAddress?: string
  onRowClick?(row: ConcentratedLiquidityPositionWithV3Pool): void
  hideNewSmartPositionButton?: boolean
  hideNewPositionButton?: boolean
  hideClosedPositions?: boolean
  hideCollectAllButton?: boolean
  actions?: ReactNode
}

export function ConcentratedPositionsTable({
  chainId,
  onRowClick,
  poolAddress,
  hideNewSmartPositionButton = true,
  hideNewPositionButton = false,
  hideClosedPositions = true,
  hideCollectAllButton = false,
  actions,
}: ConcentratedPositionsTableProps): ReactNode {
  const router = useRouter()
  const { address } = useConnection()
  const { tokenSymbols } = usePoolFilters()

  const chainIds = useMemo(() => {
    return isSushiSwapV3ChainId(chainId) ? [chainId] : []
  }, [chainId])

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'positionSize', desc: true },
  ])

  const { data: positions, isInitialLoading } =
    useConcentratedLiquidityPositions({
      account: address,
      chainIds,
    })

  const _positions = useMemo(() => {
    const _tokenSymbols = tokenSymbols?.filter((el) => el !== '') || []
    return (positions || [])
      .filter((el) =>
        _tokenSymbols.length > 0
          ? _tokenSymbols.some((symbol) => {
              return [el.pool?.token0.symbol, el.pool?.token1.symbol].includes(
                symbol.toUpperCase(),
              )
            })
          : true,
      )
      .filter((el) => {
        return (
          (hideClosedPositions ? el.liquidity !== 0n : true) &&
          (poolAddress
            ? el.address.toLowerCase() === poolAddress.toLowerCase()
            : true)
        )
      })
  }, [tokenSymbols, positions, hideClosedPositions, poolAddress])

  const state = useMemo<Partial<TableState>>(
    () => ({
      sorting,
      pagination: { pageIndex: 0, pageSize: Math.max(_positions.length, 1) },
    }),
    [_positions.length, sorting],
  )

  const linkFormatter = useCallback(
    (row: ConcentratedLiquidityPositionWithV3Pool): string =>
      `/${getEvmChainById(chainId).key}/pool/v3/${row.address}/${row.tokenId}`,
    [chainId],
  )

  const rowRenderer = useCallback(
    (row: Row<ConcentratedLiquidityPositionWithV3Pool>, rowNode: ReactNode) => {
      if (onRowClick)
        return (
          <Slot
            className="cursor-pointer"
            onClick={() => onRowClick?.(row.original)}
          >
            {rowNode}
          </Slot>
        )
      return rowNode
    },
    [onRowClick],
  )

  const mobileRowRenderer = useCallback(
    (
      row: Row<ConcentratedLiquidityPositionWithV3Pool>,
      rowNode: ReactNode,
    ): ReactNode => {
      function navigate(): void {
        onRowClick?.(row.original)
        router.push(linkFormatter(row.original))
      }

      return (
        <div
          role="link"
          tabIndex={0}
          aria-label={`View ${row.original.pool.token0.symbol}/${row.original.pool.token1.symbol} position #${row.original.tokenId}`}
          className="cursor-pointer rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
          onClick={(event) => {
            if (
              event.defaultPrevented ||
              !(event.target instanceof Element) ||
              !event.currentTarget.contains(event.target) ||
              event.target.closest(
                'a, button, input, select, textarea, [role="button"], [role="menuitem"], [aria-haspopup]',
              )
            ) {
              return
            }
            navigate()
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && event.target === event.currentTarget) {
              event.preventDefault()
              navigate()
            }
          }}
        >
          {rowNode}
        </div>
      )
    },
    [linkFormatter, onRowClick, router],
  )

  return (
    <Card className="!bg-transparent md:!bg-secondary !border-transparent md:!border-accent">
      <CardHeader className="!px-0 md:!px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <CardTitle className="flex-grow whitespace-nowrap">
            My Positions{' '}
            <span className="text-muted-foreground text-sm font-normal">
              ({_positions.length})
            </span>
          </CardTitle>
          <DataTableSortMenu
            label="positions"
            options={SORT_OPTIONS}
            sorting={sorting}
            onSortingChange={setSorting}
            className="md:hidden"
          />
          {!hideCollectAllButton ? (
            <ConcentratedLiquidityCollectAllDialog
              positions={_positions}
              account={address}
              chainId={chainId}
            >
              {({ amounts }) => (
                <div>
                  <Checker.Connect size="sm">
                    <Checker.Network size="sm" chainId={chainId}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          disabled={!amounts.length}
                          testId="claim-fees-all"
                        >
                          Claim Fees
                        </Button>
                      </DialogTrigger>
                    </Checker.Network>
                  </Checker.Connect>
                </div>
              )}
            </ConcentratedLiquidityCollectAllDialog>
          ) : null}
          {!hideNewSmartPositionButton ? (
            <LinkInternal
              shallow={true}
              href={`/${getEvmChainById(chainId).key}/pool/v3/${poolAddress}/smart`}
              className="basis-full md:basis-[unset]"
            >
              <Button
                icon={PlusIcon}
                asChild
                size="sm"
                variant="outline"
                className="w-full"
              >
                Create smart position
              </Button>
            </LinkInternal>
          ) : null}
          {!hideNewPositionButton ? (
            <LinkInternal
              shallow={true}
              href={`/${getEvmChainById(chainId).key}/pool/v3/${poolAddress}/create`}
              className="basis-full md:basis-[unset]"
            >
              <Button icon={PlusIcon} asChild size="sm" className="w-full">
                Create position
              </Button>
            </LinkInternal>
          ) : null}
          {actions}
        </div>
      </CardHeader>
      <div className="hidden md:block">
        <DataTableVirtual
          testId="concentrated-positions"
          loading={isInitialLoading}
          linkFormatter={linkFormatter}
          rowRenderer={rowRenderer}
          columns={COLUMNS}
          data={_positions}
          state={state}
          onSortingChange={setSorting}
        />
      </div>
      <div className="md:hidden">
        <MobileTable
          sorting={sorting}
          isLoading={isInitialLoading}
          isExpandedOverride={true}
          hideExpand={true}
          rowRenderer={mobileRowRenderer}
          columns={MOBILE_COLUMNS}
          data={_positions}
        />
      </div>
    </Card>
  )
}
