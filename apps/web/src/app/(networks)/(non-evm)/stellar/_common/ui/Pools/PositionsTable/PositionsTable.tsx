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
import { usePoolFilters } from 'src/app/(networks)/_ui/pools-filters-provider'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { useAccount } from 'src/lib/wallet'
import {
  type PositionSummary,
  useMyPosition,
} from '~stellar/_common/lib/hooks/position/use-my-position'
import { useStellarWallet } from '~stellar/providers'
import {
  APR_COLUMN,
  COLLECTABLE_FEES_COLUMN,
  COLLECT_FEES_COLUMN,
  POSITION_NAME_COLUMN,
  PRICE_RANGE_COLUMN,
  SIZE_COLUMN,
  VALUE_COLUMN,
} from './PositionColumns'

type PositionsTableProps = {
  hideNewPositionButton?: boolean
}

export type IPositionRowData = PositionSummary

export const PositionsTable = ({
  hideNewPositionButton,
}: PositionsTableProps) => {
  const account = useAccount('stellar')
  const { isLoading: isWalletLoading } = useStellarWallet()
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const { tokenSymbols } = usePoolFilters()
  const { positions, isLoading: isPositionLoading } = useMyPosition({
    userAddress: account ?? undefined,
    excludeDust: true,
  })

  const isLoading = isWalletLoading || isPositionLoading

  const filteredData = useMemo(() => {
    if (!positions) return []
    if (!tokenSymbols.length) return positions
    const queries = tokenSymbols.map((symbol) =>
      symbol.toLowerCase().replaceAll(' ', ''),
    )

    return positions.filter((position) => {
      const positionValues = [
        position.pool,
        position.token0.contract,
        position.token1.contract,
        position.token0.code,
        position.token1.code,
        position.token0.name,
        position.token1.name,
      ]

      return positionValues.some((value) =>
        queries.some((query) => value.toLowerCase().includes(query)),
      )
    })
  }, [positions, tokenSymbols])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span>
              My Positions{' '}
              {isLoading ? null : (
                <span className="text-gray-400 dark:text-slate-500">
                  ({filteredData?.length})
                </span>
              )}
            </span>
            <div className="flex gap-2">
              {!hideNewPositionButton && account ? (
                <LinkInternal shallow={true} href={`/stellar/pool/add`}>
                  <Button icon={PlusIcon} asChild size="sm">
                    Create position
                  </Button>
                </LinkInternal>
              ) : null}
              {!account ? (
                <ConnectButton namespace="stellar" size="sm" />
              ) : null}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <DataTable
        loading={isLoading}
        data={filteredData}
        columns={[
          POSITION_NAME_COLUMN,
          PRICE_RANGE_COLUMN,
          VALUE_COLUMN,
          SIZE_COLUMN,
          APR_COLUMN,
          COLLECTABLE_FEES_COLUMN,
          COLLECT_FEES_COLUMN,
        ]}
        linkFormatter={(data: IPositionRowData) => {
          return `/stellar/pool/${data.pool}`
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
