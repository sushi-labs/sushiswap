import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import React, { FC, useMemo } from 'react'
import useSWR from 'swr'
import { useAccount } from 'wagmi'

import { Pair, User } from '../../../../.graphclient'
import { PairWithBalance } from '../../../../types'
import { APR_COLUMN, NAME_COLUMN, NETWORK_COLUMN, POSITION_COLUMN, REWARDS_COLUMN } from '../contants'
import { GenericTable } from '../GenericTable'
import { PositionQuickHoverTooltip } from '../PositionQuickHoverTooltip'

const COLUMNS = [NETWORK_COLUMN, NAME_COLUMN, POSITION_COLUMN, APR_COLUMN, REWARDS_COLUMN]

export const PositionsTable: FC = () => {
  const { address } = useAccount()
  const { data: user } = useSWR<User>(`/pool/api/user/${address}`, (url) =>
    fetch(url).then((response) => response.json())
  )

  const liquidityPositions: PairWithBalance[] = useMemo(() => {
    if (!user?.liquidityPositions) return []
    return user.liquidityPositions.map((el) => ({
      ...el.pair,
      liquidityTokenBalance: el.liquidityTokenBalance,
    }))
  }, [user])

  const table = useReactTable<Pair | PairWithBalance>({
    data: liquidityPositions ?? [],
    // @ts-ignore
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    // @ts-ignore
    <GenericTable<Pair | PairWithBalance> table={table} columns={COLUMNS} HoverElement={PositionQuickHoverTooltip} />
  )
}
