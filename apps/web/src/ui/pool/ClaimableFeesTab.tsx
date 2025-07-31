'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  Container,
  DataTable,
} from '@sushiswap/ui'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import React, { type FC, useMemo, useState } from 'react'
import { useConcentratedLiquidityPositions } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedLiquidityPositions'
import type { ConcentratedLiquidityPositionWithV3Pool } from 'src/lib/wagmi/hooks/positions/types'
import { Amount } from 'sushi'
import {
  type EvmCurrency,
  type SushiSwapV3ChainId,
  SushiSwapV3ChainIds,
} from 'sushi/evm'
import { useAccount } from 'wagmi'
import { useMultiChainPrices } from '~evm/_common/ui/price-provider/price-provider/use-multi-chain-prices'
import {
  FEES_ACTION_COLUMN,
  FEES_AMOUNT_COLUMN,
  FEES_CHAIN_COLUMN,
} from './columns'

export type ClaimableFees = {
  chainId: SushiSwapV3ChainId
  feeAmounts: Record<string, Amount<EvmCurrency>>
  feeAmountsUSD: Record<string, number>
  totalFeesUSD: number
  positions: ConcentratedLiquidityPositionWithV3Pool[]
}

const COLUMNS = [
  FEES_CHAIN_COLUMN,
  FEES_AMOUNT_COLUMN,
  FEES_ACTION_COLUMN,
] satisfies ColumnDef<ClaimableFees, unknown>[]

export const ClaimableFeesTab: FC = () => {
  const { address, isConnecting } = useAccount()
  const { data: _data, isInitialLoading: isPositionsLoading } =
    useConcentratedLiquidityPositions({
      account: address,
      chainIds: SushiSwapV3ChainIds,
    })

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
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

  return (
    <Container maxWidth="7xl" className="px-4 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            Claimable Fees{' '}
            <span className="text-gray-400 dark:text-slate-500">
              ({data.length})
            </span>
          </CardTitle>
        </CardHeader>
        <DataTable
          loading={isLoading || isConnecting}
          columns={COLUMNS}
          data={data}
          pagination={true}
          onPaginationChange={setPaginationState}
          state={{
            pagination: paginationState,
          }}
        />
      </Card>
    </Container>
  )
}
