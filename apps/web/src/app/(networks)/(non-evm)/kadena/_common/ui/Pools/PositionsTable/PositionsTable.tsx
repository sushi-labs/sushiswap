'use client'

import { PlusIcon } from '@heroicons/react/20/solid'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  DataTable,
  LinkInternal,
} from '@sushiswap/ui'
import type { PaginationState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { usePoolFilters } from 'src/ui/pool'
import { useMyPositions } from '~kadena/_common/lib/hooks/use-my-positions'
import type { WalletPosition } from '~kadena/_common/types/get-positions'
import type { KadenaToken } from '~kadena/_common/types/token-type'
import {
  APR_COLUMN,
  POSITION_NAME_COLUMN,
  SIZE_COLUMN,
  VALUE_COLUMN,
} from './PositionColumns'

type PositionsTableProps = {
  hideNewPositionButton?: boolean
}

export type IPositionRowData = {
  token0: {
    address: string
    symbol: string
    name: string
  }
  token1: {
    address: string
    symbol: string
    name: string
  }
  poolId: string
  reserve0: string
  reserve1: string
  apr24h: string
  valueUsd: string
}

export const MOCK_TOKEN_1: KadenaToken = {
  tokenAddress:
    'abf594a764e49a90a98cddf30872d8497e37399684c1d8e2b8e96fd865728cc2',
  tokenSymbol: 'TKN1',
  tokenDecimals: 12,
  tokenName: 'Token1',
  tokenImage: '',
  validated: true,
}

export const MOCK_TOKEN_2: KadenaToken = {
  tokenAddress:
    'abf594a764e49a90a98cddf30872d8497e37399684c1d8e2b8e96fd865728cc2',
  tokenSymbol: 'TKN2',
  tokenDecimals: 12,
  tokenName: 'Token2',
  tokenImage: '',
  validated: true,
}

export const POOLS: {
  token0: KadenaToken
  token1: KadenaToken
  pairAddress: string
  reserve0: string
  reserve1: string
}[] = [
  {
    token0: MOCK_TOKEN_1,
    token1: MOCK_TOKEN_2,
    pairAddress:
      'abf594a764e49a90a98cddf30872d8497e37399684c1d8e2b8e96fd865728cc2',
    reserve0: 'reserve0',
    reserve1: 'reserve1',
  },
]

export const PositionsTable = ({
  hideNewPositionButton,
}: PositionsTableProps) => {
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const { tokenSymbols } = usePoolFilters()

  const { data: positions, isLoading } = useMyPositions()
  console.log('positions', positions)

  const filteredData = useMemo(() => {
    if (!positions) return []
    if (!tokenSymbols.length) return positions
    const queries = tokenSymbols.map((symbol) =>
      symbol.toLowerCase()?.replaceAll(' ', ''),
    )

    return positions.filter((pool) => {
      const poolValues = [
        pool.pair.address,
        pool.pair.reserve0,
        pool.pair.reserve1,
      ]

      return poolValues.some((value) =>
        queries.some((query) => value?.toLowerCase().includes(query)),
      )
    })
  }, [tokenSymbols, positions])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span>
              My Positions{' '}
              <span className="text-gray-400 dark:text-slate-500">
                ({filteredData.length})
              </span>
            </span>
            <div className="flex gap-4">
              {!hideNewPositionButton ? (
                <LinkInternal shallow={true} href={`/kadena/pool/add`}>
                  <Button icon={PlusIcon} asChild size="sm">
                    Create position
                  </Button>
                </LinkInternal>
              ) : null}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <DataTable
        loading={isLoading}
        data={
          filteredData?.map((pool) => ({
            token0: {
              address: pool?.pair.reserve0,
              symbol: 'TKN1',
              name: 'Token1',
            },
            token1: {
              address: pool?.pair.reserve1,
              symbol: 'TKN2',
              name: 'Token2',
            },
            poolId: pool?.id,
            reserve0: pool?.pair.reserve0,
            reserve1: pool?.pair.reserve1,
            apr24h: pool?.apr24h,
            valueUsd: pool?.valueUsd,
          })) ?? []
        }
        columns={[POSITION_NAME_COLUMN, VALUE_COLUMN, APR_COLUMN]}
        linkFormatter={(data: IPositionRowData) => {
          return `/kadena/pool/${data?.poolId}/add`
        }}
        externalLink={false}
        pagination={true}
        state={{
          pagination: paginationState,
        }}
        onPaginationChange={setPaginationState}
      />
    </Card>
  )
}
