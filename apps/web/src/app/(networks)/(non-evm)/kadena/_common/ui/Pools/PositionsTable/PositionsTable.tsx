'use client'

import { PlusIcon } from '@heroicons/react/20/solid'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  DataTable,
  LinkInternal,
  Loader,
} from '@sushiswap/ui'
import type { TableState } from '@tanstack/react-table'
import { useMemo } from 'react'
import { usePoolFilters } from 'src/ui/pool'
import { useMyPositions } from '~kadena/_common/lib/hooks/use-my-positions'

import InfiniteScroll from 'react-infinite-scroll-component'
import type { WalletPosition } from '~kadena/_common/types/get-positions'
import { useKadena } from '~kadena/kadena-wallet-provider'
import { WalletConnector } from '../../WalletConnector/WalletConnector'
import {
  APR_COLUMN,
  POSITION_NAME_COLUMN,
  VALUE_COLUMN,
} from './PositionColumns'

type PositionsTableProps = {
  hideNewPositionButton?: boolean
}

export const PositionsTable = ({
  hideNewPositionButton,
}: PositionsTableProps) => {
  const { tokenSymbols } = usePoolFilters()
  const { isConnected } = useKadena()

  const { data, isLoading, fetchNextPage, hasNextPage } = useMyPositions()

  const positions = data?.positions ?? []

  const filteredPositions = useMemo(() => {
    if (!positions.length || !tokenSymbols.length) return positions

    const queries = tokenSymbols.map((symbol) =>
      symbol.toLowerCase().replaceAll(' ', ''),
    )

    return positions.filter((pool) => {
      const poolValues = [
        pool.pair.address,
        pool.pair.token0.address,
        pool.pair.token1.address,
        pool.pair.token0.name,
        pool.pair.token1.name,
      ]
      return poolValues.some((value) =>
        queries.some((query) => value.toLowerCase().includes(query)),
      )
    })
  }, [tokenSymbols, positions])

  const state: Partial<TableState> = useMemo(() => {
    return {
      // sorting,
      pagination: {
        pageIndex: 0,
        pageSize: filteredPositions?.length,
      },
    }
  }, [filteredPositions])

  return (
    <InfiniteScroll
      dataLength={data?.positions.length ?? 0}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={
        <div className="flex justify-center w-full py-4">
          <Loader size={16} />
        </div>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span>
                My Positions{' '}
                <span className="text-gray-400 dark:text-slate-500">
                  ({data?.pages?.[0]?.totalCount ?? 0})
                </span>
              </span>
              <div className="flex gap-4">
                {!isConnected ? (
                  <WalletConnector />
                ) : !hideNewPositionButton ? (
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
          data={filteredPositions}
          columns={[POSITION_NAME_COLUMN, VALUE_COLUMN, APR_COLUMN]}
          linkFormatter={(data: WalletPosition) =>
            `/kadena/pool/${encodeURIComponent(data.pairId)}/add`
          }
          externalLink={false}
          state={state}
        />
      </Card>
    </InfiniteScroll>
  )
}
