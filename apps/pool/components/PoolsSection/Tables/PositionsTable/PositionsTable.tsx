import { useBreakpoint } from '@sushiswap/ui'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import React, { FC, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { useAccount } from 'wagmi'

import { Pair, User } from '../../../../.graphclient'
import { usePoolFilters } from '../../../PoolsProvider'
import { APR_COLUMN, NAME_COLUMN, NETWORK_COLUMN, POSITION_COLUMN, VOLUME_COLUMN } from '../contants'
import { GenericTable } from '../GenericTable'
import { PositionQuickHoverTooltip } from '../PositionQuickHoverTooltip'

// @ts-ignore
const COLUMNS = [NETWORK_COLUMN, NAME_COLUMN, POSITION_COLUMN, VOLUME_COLUMN, APR_COLUMN]

export const PositionsTable: FC = () => {
  const { selectedNetworks } = usePoolFilters()
  const { address } = useAccount()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')
  const [columnVisibility, setColumnVisibility] = useState({})

  const { data: user, isValidating } = useSWR<User>(
    `/pool/api/user/${address}${selectedNetworks ? `?networks=${JSON.stringify(selectedNetworks)}` : ''}`,
    (url) => fetch(url).then((response) => response.json())
  )

  const positions = useMemo(() => {
    if (!user) return []
    return user?.liquidityPositions?.map((el) => el.pair)
  }, [user])

  const table = useReactTable<Pair>({
    data: positions || [],
    state: {
      columnVisibility,
    },
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    if (isSm && !isMd) {
      setColumnVisibility({ volume: false, network: false })
    } else if (isSm) {
      setColumnVisibility({})
    } else {
      setColumnVisibility({ volume: false, network: false, apr: false, liquidityUSD: false })
    }
  }, [isMd, isSm])

  return (
    <GenericTable<Pair>
      table={table}
      columns={COLUMNS}
      HoverElement={isMd ? PositionQuickHoverTooltip : undefined}
      loading={!user || isValidating}
      placeholder="No positions found"
      pageSize={Math.max(user?.liquidityPositions?.length || 0, 5)}
    />
  )
}
