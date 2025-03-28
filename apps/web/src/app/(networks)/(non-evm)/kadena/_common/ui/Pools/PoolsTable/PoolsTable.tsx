'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  DataTable,
  SkeletonText,
} from '@sushiswap/ui'
import type { ColumnDef, SortingState, TableState } from '@tanstack/react-table'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { usePoolFilters } from 'src/ui/pool'
import { type TopPool, useTopPools } from '~tron/_common/lib/hooks/useTopPools'
import {
  APR_COLUMN,
  FEES_1D_COLUMN,
  NAME_COLUMN,
  TRANSACTIONS_1D_COLUMN,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
} from './PoolColumns'

const COLUMNS = [
  NAME_COLUMN,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  FEES_1D_COLUMN,
  TRANSACTIONS_1D_COLUMN,
  APR_COLUMN,
] satisfies ColumnDef<TopPool, unknown>[]

export const PoolsTable = () => {
  const { tokenSymbols, farmsOnly } = usePoolFilters()

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'liquidityUSD', desc: true },
  ])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1200)
  }, [])

  const pools: {
    token0PriceUSD: number
    token1Address: string
    token0Address: string
    token1Price: number
    token0Price: number
    protocol: string
    swapFee: number
    createdAt: string
    address: string
    name: string
    chainId: string
    id: string

    source: string
    wasIncentivized: boolean
    isIncentivized: boolean
    isSmartPool: boolean
    incentiveApr: number
    totalApr1d: number
    feeApr1d: number
    volumeUSD1d: number
    volumeUSD1h: number
    feeUSD1d: number
    feeUSD1h: number
    txCount1d: number
    txCount1h: number
    liquidityUSD: number
    token1PriceUSD: number
  }[] = [
    {
      token0PriceUSD: 3000,
      token1Address:
        'abf594a764e49a90a98cddf30872d8497e37399684c1d8e2b8e96fd865728cc2',
      token0Address:
        'abf594a764e49a90a98cddf30872d8497e37399684c1d8e2b8e96fd865728cc2',
      token1Price: 1 / 3000,
      token0Price: 3000,
      protocol: 'SushiSwapV2',
      swapFee: 0.003,
      createdAt: new Date('2023-01-01T00:00:00Z').toISOString(),
      address:
        'abf594a764e49a90a98cddf30872d8497e37399684c1d8e2b8e96fd865728cc2',
      name: 'TKN1-TKN2',
      chainId: '1',
      id: 'abf594a764e49a90a98cddf30872d8497e37399684c1d8e2b8e96fd865728cc2',

      source: 'subgraph',
      wasIncentivized: false,
      isIncentivized: false,
      isSmartPool: false,
      incentiveApr: 6.25,
      totalApr1d: 18.75,
      feeApr1d: 12.5,
      volumeUSD1d: 250000,
      volumeUSD1h: 10500,
      feeUSD1d: 750,
      feeUSD1h: 31.5,
      txCount1d: 1200,
      txCount1h: 55,
      liquidityUSD: 1_500_000,
      token1PriceUSD: 1,
    },
  ]

  const rowLink = useCallback((row: TopPool) => {
    return `/kadena/pool/${row.token0Address}:${row.token1Address}:${row.address}`
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const filtered = useMemo(() => {
    if (!pools) return [] as TopPool[]

    return pools.filter((pool) => {
      if (farmsOnly) {
        if (!pool.isIncentivized) return false
      }

      if (tokenSymbols.length) {
        if (
          !tokenSymbols.every((symbol) => {
            symbol = symbol.toLowerCase()

            if (pool.name.toLowerCase().includes(symbol)) return true

            return false
          })
        ) {
          return false
        }
      }

      return true
    })
  }, [farmsOnly, tokenSymbols])

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: filtered?.length,
      },
    }
  }, [sorting, filtered])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isLoading ? (
            <div className="!w-28 !h-[18px]">
              <SkeletonText />
            </div>
          ) : (
            <span>
              Pools{' '}
              <span className="text-gray-400 dark:text-slate-500">
                ({filtered.length})
              </span>
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <DataTable
        state={state}
        onSortingChange={setSorting}
        loading={isLoading}
        linkFormatter={rowLink}
        columns={COLUMNS}
        data={filtered}
      />
    </Card>
  )
}
