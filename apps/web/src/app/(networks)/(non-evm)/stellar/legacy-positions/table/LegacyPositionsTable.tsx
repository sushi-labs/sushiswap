'use client'

import { Card, CardHeader, CardTitle, DataTable } from '@sushiswap/ui'
import type { PaginationState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { usePoolFilters } from 'src/app/(networks)/_ui/pools-filters-provider'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { useAccount } from 'src/lib/wallet'
import { useMyUnmigratedLegacyPositions } from '~stellar/_common/lib/hooks/position/use-my-legacy-position'
import { useStellarWallet } from '~stellar/providers'
import {
  COLLECTABLE_FEES_COLUMN,
  MIGRATE_COLUMN,
  POSITION_NAME_COLUMN,
  PRICE_RANGE_COLUMN,
  PRINCIPAL_COLUMN,
} from './LegacyPositionColumns'

export const LegacyPositionsTable = () => {
  const account = useAccount('stellar')
  const { isLoading: isWalletLoading } = useStellarWallet()
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const { tokenSymbols } = usePoolFilters()
  const { positions, isLoading: isPositionLoading } =
    useMyUnmigratedLegacyPositions({
      userAddress: account,
    })

  const isLoading = isWalletLoading || isPositionLoading

  const filteredData = useMemo(() => {
    if (!positions) {
      return []
    }
    if (!tokenSymbols.length) {
      return positions
    }
    const queries = tokenSymbols.map((symbol) =>
      symbol.toLowerCase().replaceAll(' ', ''),
    )

    const searchResults = positions.filter((position) => {
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

    return searchResults
  }, [positions, tokenSymbols])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span>
              My Legacy Positions{' '}
              {isLoading ? null : (
                <span className="text-gray-400 dark:text-slate-500">
                  ({filteredData?.length})
                </span>
              )}
            </span>
            <div className="flex gap-2">
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
          PRINCIPAL_COLUMN,
          COLLECTABLE_FEES_COLUMN,
          MIGRATE_COLUMN,
        ]}
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
