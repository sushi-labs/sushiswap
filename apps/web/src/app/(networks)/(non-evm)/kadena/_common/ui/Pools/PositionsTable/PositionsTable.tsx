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
import { useEffect, useMemo, useState } from 'react'
import { usePoolFilters } from 'src/ui/pool'
import type { IMyPositionData } from '~kadena/_common/types/get-pools-type'
import type { IToken } from '~kadena/_common/types/token-type'
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
  token0: IToken
  token1: IToken
  pairAddress: string
  reserve0: string
  reserve1: string
}

export const PositionsTable = ({
  hideNewPositionButton,
}: PositionsTableProps) => {
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const { tokenSymbols } = usePoolFilters()
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, setIsPending] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
      setIsPending(false)
    }, 1200)
  }, [])

  const data: {
    token0: IToken
    token1: IToken
    pairAddress: string
    reserve0: string
    reserve1: string
  }[] = [
    {
      token0: {
        address: '0x1',
        symbol: 'TKN1',
        name: 'Token1',
        decimals: 12,
        logoURI: '',
      },
      token1: {
        address: '0x2',
        symbol: 'TKN2',
        name: 'Token2',
        decimals: 12,
        logoURI: '',
      },
      pairAddress: 'pairAddress',
      reserve0: 'reserve0',
      reserve1: 'reserve1',
    },
  ]
  const filteredData = useMemo(() => {
    if (!data) return []
    if (!tokenSymbols.length) return data
    const queries = tokenSymbols.map((symbol) =>
      symbol.toLowerCase()?.replaceAll(' ', ''),
    )

    return data.filter((pool) => {
      const poolValues = [
        pool.pairAddress,
        pool.token0?.address,
        pool.token1?.address,
        pool.token0?.symbol,
        pool.token1?.symbol,
        pool.token0?.name,
        pool.token1?.name,
      ]

      return poolValues.some((value) =>
        queries.some((query) => value?.toLowerCase().includes(query)),
      )
    })
  }, [tokenSymbols])

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
        loading={isLoading || isPending}
        data={
          filteredData?.map((pool) => ({
            token0: pool?.token0,
            token1: pool?.token1,
            pairAddress: pool?.pairAddress,
            reserve0: pool?.reserve0,
            reserve1: pool?.reserve1,
          })) ?? []
        }
        columns={[POSITION_NAME_COLUMN, VALUE_COLUMN, SIZE_COLUMN, APR_COLUMN]}
        linkFormatter={(data: IMyPositionData) => {
          const token0 = data?.token0?.address
          const token1 = data?.token1?.address
          return `/kadena/pool/${token0}:${token1}:${data?.pairAddress}`
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
