import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid'
import { ChartBarIcon, DownloadIcon, PlusIcon, UserCircleIcon } from '@heroicons/react-v1/solid'
import { AngleRewardsPool, useAngleRewardsMultipleChains } from '@sushiswap/react-query'
import {
  Button,
  Container,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@sushiswap/ui'
import { Carousel } from '@sushiswap/ui/components/Carousel'
import { useAccount } from '@sushiswap/wagmi'
import { ColumnDef } from '@tanstack/react-table'
import { ANGLE_ENABLED_NETWORKS } from 'config'
import React, { FC, useCallback, useMemo } from 'react'

import { usePoolFilters } from '../PoolsFiltersProvider'
import { RewardSlide, RewardSlideSkeleton } from './RewardSlide'
import {
  REWARDS_V3_APR_COLUMN,
  REWARDS_V3_CLAIMABLE_COLUMN,
  REWARDS_V3_NAME_COLUMN,
  REWARDS_V3_POSITION_SIZE_COLUMN,
} from './Tables/RewardsTableV3'

const COLUMNS = [
  REWARDS_V3_NAME_COLUMN,
  REWARDS_V3_POSITION_SIZE_COLUMN,
  REWARDS_V3_APR_COLUMN,
  REWARDS_V3_CLAIMABLE_COLUMN,
  {
    id: 'actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button icon={EllipsisHorizontalIcon} variant="ghost" size="sm">
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[240px]">
          <DropdownMenuItem asChild>
            <a href={`/pool/${row.original.id}`}>
              <ChartBarIcon width={16} height={16} className="mr-2" /> Statistics
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a className="flex items-center" href={`/pool/${row.original.id}?activeTab=new`}>
              <DownloadIcon width={16} height={16} className="mr-2" />
              Deposit
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Position</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem asChild>
                  <a href={`/pool/${row.original.id}?activeTab=new`}>
                    <PlusIcon width={16} height={16} className="mr-2" />
                    Create new position
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={`/pool/${row.original.id}?activeTab=myPositions`}>
                    <UserCircleIcon width={16} height={16} className="mr-2" /> My positions
                  </a>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
] satisfies ColumnDef<AngleRewardsPool, unknown>[]

export const RewardsSection: FC = () => {
  const { address } = useAccount()
  const { chainIds, tokenSymbols } = usePoolFilters()
  const { data, isInitialLoading } = useAngleRewardsMultipleChains({
    chainIds: ANGLE_ENABLED_NETWORKS,
    account: address,
  })

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

  const rowLink = useCallback((row: AngleRewardsPool) => {
    return `/pool/${row.id}`
  }, [])

  return (
    <>
      <Carousel<NonNullable<typeof chainsSorted>[0] | number>
        containerWidth={1280}
        slides={chainsSorted || ANGLE_ENABLED_NETWORKS}
        render={(row) =>
          typeof row === 'number' ? <RewardSlideSkeleton /> : <RewardSlide data={row} address={address} />
        }
        className="!pt-0 px-2"
      />
      <Container maxWidth="7xl" className="px-4 mx-auto">
        <DataTable linkFormatter={rowLink} loading={isInitialLoading} columns={COLUMNS} data={positions} />
      </Container>
    </>
  )
}
