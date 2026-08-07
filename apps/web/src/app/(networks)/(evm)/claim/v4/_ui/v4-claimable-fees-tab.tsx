'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Container,
  DataTable,
  Message,
} from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import { type FC, useState } from 'react'
import {
  SUSHISWAP_V4_SUPPORTED_CHAIN_IDS,
  type SushiSwapV4ChainId,
  type SushiSwapV4Deployment,
  getSushiSwapV4Deployment,
  getSushiSwapV4PositionIds,
} from 'src/lib/pool/v4'
import { useConfig, useConnection } from 'wagmi'
import {
  V4_FEES_ACTION_COLUMN,
  V4_FEES_AMOUNT_COLUMN,
  V4_FEES_CHAIN_COLUMN,
  V4_FEES_POSITIONS_COLUMN,
} from './v4-columns'

export interface ClaimableV4Fees {
  chainId: SushiSwapV4ChainId
  deployment: SushiSwapV4Deployment
  tokenIds: bigint[]
}

const DEPLOYMENTS = SUSHISWAP_V4_SUPPORTED_CHAIN_IDS.flatMap((chainId) => {
  const deployment = getSushiSwapV4Deployment(chainId)
  return deployment ? [{ chainId, deployment }] : []
})

const COLUMNS = [
  V4_FEES_CHAIN_COLUMN,
  V4_FEES_POSITIONS_COLUMN,
  V4_FEES_AMOUNT_COLUMN,
  V4_FEES_ACTION_COLUMN,
] satisfies ColumnDef<ClaimableV4Fees, unknown>[]

export const V4ClaimableFeesTab: FC = () => {
  const { address, isConnecting } = useConnection()
  const config = useConfig()
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const positions = useQuery({
    queryKey: [
      'claimable-v4-fees',
      {
        account: address,
        positionManagers: DEPLOYMENTS.map(
          ({ chainId, deployment }) =>
            `${chainId}:${deployment.clPositionManager}`,
        ),
      },
    ],
    queryFn: async () => {
      if (!address) return []

      const results = await Promise.allSettled(
        DEPLOYMENTS.map(async ({ chainId, deployment }) => ({
          chainId,
          deployment,
          tokenIds: await getSushiSwapV4PositionIds({
            account: address,
            chainId,
            config,
            deployment,
          }),
        })),
      )

      return results.flatMap((result) =>
        result.status === 'fulfilled' && result.value.tokenIds.length > 0
          ? [result.value]
          : [],
      )
    },
    enabled: Boolean(address && DEPLOYMENTS.length > 0),
    staleTime: 30_000,
  })

  const data = positions.data ?? []
  const isLoading =
    isConnecting ||
    Boolean(address && DEPLOYMENTS.length > 0 && positions.isPending)

  return (
    <Container maxWidth="7xl" className="px-4 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            Claimable V4 Fees{' '}
            <span className="text-gray-400 dark:text-slate-500">
              ({data.length})
            </span>
          </CardTitle>
        </CardHeader>
        {DEPLOYMENTS.length === 0 ? (
          <CardContent>
            <Message variant="warning">
              SushiSwap V4 deployment addresses have not been configured yet.
            </Message>
          </CardContent>
        ) : null}
        <DataTable
          loading={isLoading}
          columns={COLUMNS}
          data={data}
          pagination
          onPaginationChange={setPaginationState}
          state={{ pagination: paginationState }}
        />
      </Card>
    </Container>
  )
}
