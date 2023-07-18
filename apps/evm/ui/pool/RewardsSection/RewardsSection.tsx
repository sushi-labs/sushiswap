import { useBreakpoint } from '@sushiswap/hooks'
import { AngleRewardsPool, useAngleRewardsMultipleChains } from '@sushiswap/react-query'
import { Carousel } from '@sushiswap/ui/components/Carousel'
import { Container } from '@sushiswap/ui/components/container'
import { Dialog } from '@sushiswap/ui/components/dialog'
import { GenericTable } from '@sushiswap/ui/components/table/GenericTable'
import { useAccount } from '@sushiswap/wagmi'
import { getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import { ANGLE_ENABLED_NETWORKS } from 'config'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'

import { usePoolFilters } from '../PoolsFiltersProvider'
import { RewardSlide, RewardSlideSkeleton } from './RewardSlide'
import {
  REWARDS_V3_APR_COLUMN,
  REWARDS_V3_CLAIMABLE_COLUMN,
  REWARDS_V3_NAME_COLUMN,
  REWARDS_V3_POSITION_SIZE_COLUMN,
} from './Tables/RewardsTableV3'
import { RewardsTableV3RowPopover } from './Tables/RewardsTableV3/RewardsTableV3RowPopover'

const COLUMNS = [
  REWARDS_V3_NAME_COLUMN,
  REWARDS_V3_POSITION_SIZE_COLUMN,
  REWARDS_V3_APR_COLUMN,
  REWARDS_V3_CLAIMABLE_COLUMN,
] as any

export const RewardsSection: FC = () => {
  const [clickedRow, setClickedRow] = useState<AngleRewardsPool>()
  const { address } = useAccount()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')
  const { chainIds, tokenSymbols } = usePoolFilters()
  const { data, isInitialLoading } = useAngleRewardsMultipleChains({
    chainIds: ANGLE_ENABLED_NETWORKS,
    account: address,
  })

  const [sorting, setSorting] = useState<SortingState>([{ id: 'positionSize', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})

  const chainsSorted = useMemo(() => {
    if (!data) return undefined
    return data.sort((a, b) => {
      const aAmount = a.unclaimed.reduce((acc, cur) => acc + cur.amountUSD, 0)
      const bAmount = b.unclaimed.reduce((acc, cur) => acc + cur.amountUSD, 0)

      return bAmount - aAmount
    })
  }, [data])
  const positions = useMemo(() => {
    const _tokenSymbols = tokenSymbols?.filter((el) => el !== '') || []
    return (data ?? [])
      .filter((el) => chainIds.includes(el.chainId))
      .flatMap((el) => {
        return Object.values(el.pools ?? {})
          .filter(
            (el) =>
              (el?.userTotalBalance0 ?? 0) + (el?.userTotalBalance1 ?? 0) > 0 ||
              Object.keys(el.rewardsPerToken).length > 0
          )
          .filter((el) =>
            _tokenSymbols.length > 0
              ? _tokenSymbols.some((symbol) => {
                  return [el.token0.symbol, el.token1.symbol].includes(symbol.toUpperCase())
                })
              : true
          )
      })
  }, [chainIds, tokenSymbols, data])

  const table = useReactTable<AngleRewardsPool>({
    data: positions,
    state: {
      sorting,
      columnVisibility,
    },
    columns: COLUMNS,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  useEffect(() => {
    if (isSm && !isMd) {
      setColumnVisibility({ claimable: false })
    } else if (isSm) {
      setColumnVisibility({})
    } else {
      setColumnVisibility({
        claimable: false,
        apr: false,
      })
    }
  }, [isMd, isSm])

  const rowLink = useCallback((row: AngleRewardsPool) => {
    return `/pool/${row.id}`
  }, [])

  return (
    <>
      <div className="pl-4 xl:pl-2">
        <Container maxWidth="7xl" className="px-4 mx-auto !py-4">
          <h1 className="my-2 text-sm font-medium text-gray-700 dark:text-slate-200">
            Claim your rewards per network.
          </h1>
        </Container>
        <Carousel<NonNullable<typeof chainsSorted>[0] | number>
          containerWidth={1280}
          slides={chainsSorted || ANGLE_ENABLED_NETWORKS}
          render={(row) =>
            typeof row === 'number' ? <RewardSlideSkeleton /> : <RewardSlide data={row} address={address} />
          }
          className="!pt-0"
        />
      </div>
      <Container maxWidth="7xl" className="px-4 mx-auto mb-[120px]">
        <GenericTable<AngleRewardsPool>
          table={table}
          loading={isInitialLoading}
          placeholder="No positions found"
          pageSize={positions?.length ? positions.length : 1}
          HoverElement={isMd ? RewardsTableV3RowPopover : undefined}
          HoverElementWidth={420}
          onClick={!isMd ? setClickedRow : undefined}
          linkFormatter={rowLink}
        />
        {clickedRow && !isMd && (
          <Dialog appear open={true} onClose={() => setClickedRow(undefined)}>
            <Dialog.Content>
              <RewardsTableV3RowPopover row={clickedRow} />
            </Dialog.Content>
          </Dialog>
        )}
      </Container>
    </>
  )
}
