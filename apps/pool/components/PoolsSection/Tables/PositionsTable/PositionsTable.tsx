import { chainShortName } from '@sushiswap/chain'
import { useBreakpoint } from '@sushiswap/ui'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { useAccount, useQuery } from 'wagmi'

import { Pair, User } from '../../../../.graphclient'
import { PairWithBalance } from '../../../../types'
import { usePoolFilters } from '../../../PoolsProvider'
import { APR_COLUMN, NAME_COLUMN, NETWORK_COLUMN, POSITION_COLUMN, VOLUME_COLUMN } from '../contants'
import { GenericTable } from '../GenericTable'
import { PositionQuickHoverTooltip } from '../PositionQuickHoverTooltip'
import { usePoolFarmRewardsContext } from '../../../PoolFarmRewardsProvider'

// @ts-ignore
const COLUMNS = [NETWORK_COLUMN, NAME_COLUMN, POSITION_COLUMN, VOLUME_COLUMN, APR_COLUMN]

export const PositionsTable: FC = () => {
  const { getRewardsForPair } = usePoolFarmRewardsContext()
  const { selectedNetworks } = usePoolFilters()
  const { address } = useAccount()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')
  const [columnVisibility, setColumnVisibility] = useState({})
  const queryKey = `/pool/api/user/${address}${selectedNetworks ? `?networks=${JSON.stringify(selectedNetworks)}` : ''}`
  const {
    data: user,
    isError,
    isLoading,
  } = useQuery<User>([queryKey], () => fetch(queryKey).then((response) => response.json()))

  const liquidityPositions: PairWithBalance[] = useMemo(() => {
    if (!user?.liquidityPositions) return []
    return user.liquidityPositions.map((el) => {
      const id = `${chainShortName[el.pair.chainId]}:${el.pair.id}`
      const { incentives, farmId, chefType } = getRewardsForPair(el.pair)

      return {
        ...el.pair,
        id,
        liquidityTokenBalance: el.balance,
        incentives: incentives || [],
        farmId,
        chefType,
      }
    })
  }, [getRewardsForPair, user?.liquidityPositions])

  const table = useReactTable<Pair | PairWithBalance>({
    data: liquidityPositions ?? [],
    state: {
      columnVisibility,
    },
    // @ts-ignore
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
    <GenericTable<Pair | PairWithBalance>
      table={table}
      // @ts-ignore
      columns={COLUMNS}
      HoverElement={isMd ? PositionQuickHoverTooltip : undefined}
      loading={isLoading && !isError}
      placeholder="No positions found"
      pageSize={Math.max(liquidityPositions?.length, 5)}
    />
  )
}
