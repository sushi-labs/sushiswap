'use client'

import { PoolChainIds } from '@sushiswap/graph-client/data-api'
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
import { type SushiSwapV3ChainId, isSushiSwapV3ChainId } from 'sushi/config'
import { useAccount } from 'wagmi'
import {
  CLAIM_POSITIONS_CHAIN_COLUMN,
  CLAIM_POSITIONS_FEES_ACTIONS_COLUMN,
  CLAIM_POSITIONS_FEES_AMOUNTS_COLUMN,
} from './columns'

const COLUMNS = [
  CLAIM_POSITIONS_CHAIN_COLUMN,
  CLAIM_POSITIONS_FEES_AMOUNTS_COLUMN,
  CLAIM_POSITIONS_FEES_ACTIONS_COLUMN,
] satisfies ColumnDef<
  {
    chainId: SushiSwapV3ChainId
    positions: ConcentratedLiquidityPositionWithV3Pool[]
  },
  unknown
>[]

export const ClaimableFeesTab: FC = () => {
  const { address, isConnecting } = useAccount()
  const poolChainIds = useMemo(
    () => PoolChainIds.filter((el) => isSushiSwapV3ChainId(el)),
    [],
  )
  const { data: positionsData, isInitialLoading: isLoading } =
    useConcentratedLiquidityPositions({
      account: address,
      chainIds: poolChainIds,
    })
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const positionsByChain = useMemo(() => {
    return positionsData?.reduce(
      (acc, position) => {
        acc[position.chainId] = acc[position.chainId] || []
        acc[position.chainId].push(position)
        return acc
      },
      {} as Record<
        SushiSwapV3ChainId,
        ConcentratedLiquidityPositionWithV3Pool[]
      >,
    )
  }, [positionsData])

  const chainsCount = useMemo(() => {
    return Object.keys(positionsByChain || {}).length
  }, [positionsByChain])

  const data = useMemo(() => {
    return Object.entries(positionsByChain || {}).map(
      ([chainId, positions]) => ({
        chainId: Number(chainId) as SushiSwapV3ChainId,
        positions,
      }),
    )
  }, [positionsByChain])

  return (
    <Container maxWidth="7xl" className="px-4 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            Claimable Fees{' '}
            <span className="text-gray-400 dark:text-slate-500">
              ({chainsCount})
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
