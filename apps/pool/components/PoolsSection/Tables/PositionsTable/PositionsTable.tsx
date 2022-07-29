import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import React, { FC, useMemo } from 'react'
import useSWR from 'swr'
import { useAccount } from 'wagmi'

import { Pair, User } from '../../../../.graphclient'
import { APR_COLUMN, NAME_COLUMN, NETWORK_COLUMN, REWARDS_COLUMN, TVL_COLUMN } from '../contants'
import { GenericTable } from '../GenericTable'

const COLUMNS = [NETWORK_COLUMN, NAME_COLUMN, TVL_COLUMN, APR_COLUMN, REWARDS_COLUMN]

export const PositionsTable: FC = () => {
  const { address } = useAccount()
  const { data: user } = useSWR<User>(`/pool/api/user/${address}`, (url) =>
    fetch(url).then((response) => response.json())
  )

  const liquidityPositions = useMemo(() => {
    if (!user?.liquidityPositions) return []
    return user.liquidityPositions.map((el) => el.pair)
  }, [user])

  const table = useReactTable({
    data: liquidityPositions ?? [],
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
  })

  return <GenericTable<Pair> table={table} columns={COLUMNS} />
}
