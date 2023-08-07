'use client'

import { EllipsisHorizontalIcon, GiftIcon } from '@heroicons/react/24/outline'
import { AngleRewardsPool, useAngleRewardsMultipleChains } from '@sushiswap/react-query'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Container,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@sushiswap/ui'
import { Carousel } from '@sushiswap/ui/components/Carousel'
import { useAccount } from '@sushiswap/wagmi'
import { ColumnDef, PaginationState } from '@tanstack/react-table'
import { ANGLE_ENABLED_NETWORKS } from 'config'
import Link from 'next/link'
import React, { FC, useCallback, useMemo, useState } from 'react'

import { unwrapToken } from '../../lib/functions'
import {
  REWARDS_V3_APR_COLUMN,
  REWARDS_V3_CLAIMABLE_COLUMN,
  REWARDS_V3_NAME_COLUMN,
  REWARDS_V3_POSITION_SIZE_COLUMN,
} from './columns'
import { usePoolFilters } from './PoolsFiltersProvider'
import { RewardSlide, RewardSlideSkeleton } from './RewardSlide'

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
            <Link
              onClick={(e) => e.stopPropagation()}
              shallow={true}
              className="flex items-center"
              href={`/pool/incentivize?chainId=${row.original.chainId}&fromCurrency=${
                unwrapToken(row.original.token0).isNative ? 'NATIVE' : row.original.token0.address
              }&toCurrency=${
                unwrapToken(row.original.token1).isNative ? 'NATIVE' : row.original.token1.address
              }&feeAmount=${row.original.poolFee * 10_000}`}
            >
              <GiftIcon width={16} height={16} className="mr-2" />
              Add incentive
            </Link>
          </DropdownMenuItem>
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

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
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
        <Card>
          <CardHeader>
            <CardTitle>
              My Rewards <span className="text-gray-400 dark:text-slate-500">({positions.length})</span>
            </CardTitle>
          </CardHeader>
          <DataTable
            linkFormatter={rowLink}
            loading={isInitialLoading}
            columns={COLUMNS}
            data={positions}
            pagination={true}
            onPaginationChange={setPaginationState}
            state={{
              pagination: paginationState,
            }}
          />
        </Card>
      </Container>
    </>
  )
}
