import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { AngleRewardsPool, useAngleRewardsMultipleChains } from '@sushiswap/react-query'
import { Carousel } from '@sushiswap/ui/future/components/Carousel'
import { RewardSlide } from './RewardSlide'
import { useAccount } from '@sushiswap/wagmi'
import Container from '@sushiswap/ui/future/components/Container'
import { usePoolFilters } from '../PoolsFiltersProvider'
import { getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import { useBreakpoint } from '@sushiswap/hooks'
import { GenericTable } from '@sushiswap/ui/future/components/table/GenericTable'
import {
  REWARDS_V3_APR_COLUMN,
  REWARDS_V3_CLAIMABLE_COLUMN,
  REWARDS_V3_NAME_COLUMN,
  REWARDS_V3_POSITION_SIZE_COLUMN,
} from './Tables/RewardsTableV3'
import { ANGLE_ENABLED_NETWORKS } from '../../config'
import { Dialog } from '@sushiswap/ui/future/components/dialog'
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

  const positions = useMemo(() => {
    const _tokenSymbols = tokenSymbols?.filter((el) => el !== '') || []
    return (data ?? [])
      .filter((el) => chainIds.includes(el.chainId))
      .map((el) => {
        return Object.values(el.pools ?? {})
          .filter((el) => el.userTotalBalance0 + el.userTotalBalance1 > 0 || Object.keys(el.rewardsPerToken).length > 0)
          .filter((el) =>
            _tokenSymbols.length > 0
              ? _tokenSymbols.some((symbol) => {
                  return [el.token0.symbol, el.token1.symbol].includes(symbol.toUpperCase())
                })
              : true
          )
      })
      .flat()
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
    return `/${row.id}`
  }, [])

  return (
    <>
      <div className="pl-4 xl:pl-2">
        <Container maxWidth="7xl" className="px-4 mx-auto !py-4">
          <h1 className="font-medium text-sm my-2 text-gray-700 dark:text-slate-200">
            Claim your rewards per network.
          </h1>
        </Container>
        <Carousel
          containerWidth={1280}
          slides={data ?? []}
          render={(row) => <RewardSlide data={row} address={address} />}
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
