'use client'

import {
  Button,
  DataTableVirtual,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  MobileTable,
  useBreakpoint,
} from '@sushiswap/ui'
import type { ColumnDef, Row, TableState } from '@tanstack/react-table'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  DialogProvider,
  DialogType,
  useDialog,
} from 'src/lib/transaction-dialog'
import { useConcentratedLiquidityPositions } from 'src/lib/wagmi/hooks/positions/hooks/use-concentrated-liquidity-positions'
import type { ConcentratedLiquidityPositionWithV3Pool } from 'src/lib/wagmi/hooks/positions/types'
import { Amount } from 'sushi'
import {
  type EvmCurrency,
  type SushiSwapV3ChainId,
  SushiSwapV3ChainIds,
} from 'sushi/evm'
import { useConnection } from 'wagmi'
import { useMultiChainPrices } from '~evm/_common/ui/price-provider/price-provider/use-multi-chain-prices'
import { ConcentratedLiquidityCollectAllDialogContent } from '~evm/_ui/concentrated-liquidity-collect-all-dialog'
import { ClaimableFeesActionCell } from './claimable-fees-action-cell'
import { ClaimableFeesAmountCell } from './claimable-fees-amount-cell'
import { ClaimableFeesChainCell } from './claimable-fees-chain-cell'
import {
  FEES_AMOUNT_COLUMN,
  FEES_CHAIN_COLUMN,
  createFeesActionColumn,
} from './columns'

export type ClaimableFees = {
  chainId: SushiSwapV3ChainId
  feeAmounts: Record<string, Amount<EvmCurrency>>
  feeAmountsUSD: Record<string, number>
  totalFeesUSD: number
  positions: ConcentratedLiquidityPositionWithV3Pool[]
}

function renderMobileRow(
  row: Row<ClaimableFees>,
  onClaim: (claim: ClaimableFees) => void,
): ReactNode {
  return (
    <dl className="flex flex-col gap-4 rounded-2xl border border-accent bg-secondary p-4 text-xs">
      <div className="flex flex-col gap-1">
        <dt className="text-muted-foreground">Chain</dt>
        <dd>
          <ClaimableFeesChainCell {...row} />
        </dd>
      </div>
      <div className="flex flex-col gap-1">
        <dt className="text-muted-foreground">Fees Amount</dt>
        <dd>
          <ClaimableFeesAmountCell {...row} />
        </dd>
      </div>
      <div className="flex flex-col gap-1">
        <dt className="text-muted-foreground">Action</dt>
        <dd>
          <ClaimableFeesActionCell {...row} onClaim={onClaim} />
        </dd>
      </div>
    </dl>
  )
}

export function ClaimableFeesDialog(): ReactNode {
  return (
    <DialogProvider>
      <ClaimableFeesDialogContent />
    </DialogProvider>
  )
}

function ClaimableFeesDialogContent(): ReactNode {
  const { isMd } = useBreakpoint('md')
  const { address, isConnecting } = useConnection()
  const { open: isReviewOpen, setOpen: setReviewOpen } = useDialog(
    DialogType.Review,
  )
  const { open: isConfirmOpen } = useDialog(DialogType.Confirm)
  // Preserve the active claim when a refetch removes its table row.
  const [selectedClaim, setSelectedClaim] = useState<ClaimableFees>()

  const onClaim = useCallback(
    (claim: ClaimableFees) => {
      setSelectedClaim(claim)
      setReviewOpen(true)
    },
    [setReviewOpen],
  )

  useEffect(() => {
    if (!isReviewOpen && !isConfirmOpen) setSelectedClaim(undefined)
  }, [isReviewOpen, isConfirmOpen])

  const columns = useMemo<ColumnDef<ClaimableFees, unknown>[]>(
    () => [
      FEES_CHAIN_COLUMN,
      FEES_AMOUNT_COLUMN,
      createFeesActionColumn(onClaim),
    ],
    [onClaim],
  )
  const { data: _data, isInitialLoading: isPositionsLoading } =
    useConcentratedLiquidityPositions({
      account: address,
      chainIds: SushiSwapV3ChainIds,
    })

  const { data: prices, isLoading: isPricesLoading } = useMultiChainPrices({
    chainIds: SushiSwapV3ChainIds,
    enabled: Boolean(address),
  })

  const isLoading = isPositionsLoading || isPricesLoading

  const data = useMemo(() => {
    if (!_data) return []
    const positionsByChain = _data.reduce(
      (accum, cur) => {
        accum[cur.chainId] = accum[cur.chainId] || []
        accum[cur.chainId].push(cur)
        return accum
      },
      {} as Record<
        SushiSwapV3ChainId,
        ConcentratedLiquidityPositionWithV3Pool[]
      >,
    )

    const feesByChain = Object.entries(positionsByChain).reduce(
      (accum, [_chainId, positions]) => {
        if (positions.length === 0) return accum

        const chainId = +_chainId as SushiSwapV3ChainId

        const feeAmounts = {} as Record<string, Amount<EvmCurrency>>

        positions.forEach((position) => {
          if (
            !position.fees ||
            (position.fees[0] === 0n && position.fees[1] === 0n)
          )
            return

          const fees0 = position.fees[0]
          const fees1 = position.fees[1]

          const currentValue0 = feeAmounts[position.token0.id]
          const currentValue1 = feeAmounts[position.token1.id]

          if (currentValue0) {
            const amount = currentValue0.add(
              new Amount(currentValue0.currency, fees0),
            )
            feeAmounts[position.token0.id] = amount
          } else {
            const amount = new Amount(position.pool.token0, fees0)
            feeAmounts[position.token0.id] = amount
          }

          if (currentValue1) {
            const amount = currentValue1.add(
              new Amount(currentValue1.currency, fees1),
            )
            feeAmounts[position.token1.id] = amount
          } else {
            const amount = new Amount(position.pool.token1, fees1)
            feeAmounts[position.token1.id] = amount
          }
        })

        if (Object.keys(feeAmounts).length === 0) return accum

        const feeAmountsUSD = Object.entries(feeAmounts).reduce(
          (prev, [key, amount]) => {
            const price = prices
              ?.get(chainId)
              ?.get(amount.currency.wrap().address.toLowerCase())

            if (!price) {
              return prev
            }

            const _amountUSD = Number(
              Number(amount.toString()) * Number(price.toFixed()),
            )

            const amountUSD =
              Number.isNaN(price) || +price.toFixed(10) < 0.000001
                ? 0
                : _amountUSD

            prev[key] = amountUSD
            return prev
          },
          {} as Record<string, number>,
        )

        const totalFeesUSD = Object.values(feeAmountsUSD).reduce(
          (prev, amount) => prev + amount,
          0,
        )

        accum[chainId] = {
          chainId,
          feeAmounts,
          feeAmountsUSD,
          totalFeesUSD,
          positions,
        }

        return accum
      },
      {} as Record<SushiSwapV3ChainId, ClaimableFees>,
    )

    return Object.values(feesByChain)
  }, [_data, prices])

  const state = useMemo<Partial<TableState>>(
    () => ({
      pagination: { pageIndex: 0, pageSize: Math.max(data.length, 1) },
    }),
    [data.length],
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Claim Fees</Button>
      </DialogTrigger>
      <DialogContent className="md:!max-w-2xl">
        <DialogHeader>
          <DialogTitle>Claimable Fees ({data?.length ?? 0})</DialogTitle>
        </DialogHeader>
        {isMd ? (
          <DataTableVirtual
            loading={isLoading || isConnecting}
            columns={columns}
            data={data}
            state={state}
            scrollClassName="max-h-[60dvh]"
            estimateSize={72}
          />
        ) : (
          <MobileTable
            sorting={[]}
            isLoading={isLoading || isConnecting}
            isExpandedOverride={true}
            hideExpand={true}
            rowRenderer={(row) => renderMobileRow(row, onClaim)}
            columns={columns}
            data={data}
            scrollClassName="max-h-[60dvh] !min-h-0 overflow-y-auto"
          />
        )}
        {selectedClaim ? (
          <ConcentratedLiquidityCollectAllDialogContent
            positions={selectedClaim.positions}
            chainId={selectedClaim.chainId}
            account={address}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
