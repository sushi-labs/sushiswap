import { Protocol } from '@sushiswap/database'
import { DataTable } from '@sushiswap/ui'
import { Sheet, SheetContent, SheetTrigger } from '@sushiswap/ui/components/sheet'
import { useAccount } from '@sushiswap/wagmi'
import { ColumnDef, Row } from '@tanstack/react-table'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { useUserPositions } from 'lib/hooks'
import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { PositionWithPool } from 'types'

import Page from '../../../../../app/pool/[id]/page'
import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { APR_COLUMN, NAME_COLUMN, VALUE_COLUMN } from './Cells/columns'

const COLUMNS = [NAME_COLUMN, VALUE_COLUMN, APR_COLUMN] satisfies ColumnDef<PositionWithPool, unknown>[]

interface PositionsTableProps {
  protocol: Protocol
}

const tableState = { sorting: [{ id: 'value', desc: true }] }

export const PositionsTable: FC<PositionsTableProps> = ({ protocol }) => {
  const { address } = useAccount()
  const { chainIds, tokenSymbols } = usePoolFilters()
  const [peekedId, setPeekedId] = useState<{ id: string }>({ id: '' })

  const { data: positions, isValidating } = useUserPositions({ id: address, chainIds: SUPPORTED_CHAIN_IDS })

  const _positions = useMemo(() => {
    if (!positions) return []

    const _tokenSymbols = tokenSymbols?.filter((el) => el !== '') || []
    const searchFiltered = positions.filter((el) =>
      _tokenSymbols.length > 0
        ? _tokenSymbols.some((symbol) => {
            return [el.pool?.token0.symbol, el.pool?.token1.symbol].includes(symbol.toUpperCase())
          })
        : true
    )
    const chainFiltered = searchFiltered.filter((el) => chainIds.includes(el.chainId))
    return chainFiltered.filter((el) => el.pool?.protocol === protocol)
  }, [positions, tokenSymbols, chainIds, protocol])

  const rowRenderer = useCallback((row: Row<PositionWithPool>, rowNode: ReactNode) => {
    return (
      <_SheetTrigger row={row} onPeek={setPeekedId}>
        {rowNode}
      </_SheetTrigger>
    )
  }, [])

  console.log(peekedId)
  return (
    <Sheet modal>
      <DataTable
        state={tableState}
        loading={isValidating}
        rowRenderer={rowRenderer}
        columns={COLUMNS}
        data={_positions}
      />
      <SheetContent side="right" className="overflow-auto min-w-[calc(100vw-16px)] md:min-w-[unset] !max-w-7xl">
        <Page params={peekedId} />
      </SheetContent>
    </Sheet>
  )
}

const _SheetTrigger: FC<{
  row: Row<PositionWithPool>
  children: ReactNode
  onPeek({ id }: { id: string }): void
}> = ({ row, children, onPeek }) => {
  const onMouseEnter = useCallback(() => {
    onPeek({ id: row.original.pool.id.replace(':', '%3A') })
  }, [onPeek, row.original.pool.id])

  return (
    <SheetTrigger asChild onMouseEnter={onMouseEnter} type={undefined}>
      {children}
    </SheetTrigger>
  )
}
