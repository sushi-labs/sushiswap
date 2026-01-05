import type { LeaderboardEntry } from '@sushiswap/graph-client/leaderboard'
import {
  Badge,
  Chip,
  SkeletonCircle,
  SkeletonText,
  classNames,
  cloudinaryFetchLoader,
} from '@sushiswap/ui'
import { JazzIcon } from '@sushiswap/ui/icons/JazzIcon'
import type { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'
import { formatNumber, formatUSD, truncateString } from 'sushi'
import { type EvmAddress, EvmChainId } from 'sushi/evm'
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi'

const getClassForRank = (rank: number) => {
  switch (rank) {
    case 1:
      return 'text-[#8A6A00] dark:text-[#FFD84D] font-semibold' // Gold
    case 2:
      return 'text-[#5F6B7A] dark:text-[#E5E7EB] font-semibold' // Silver
    case 3:
      return 'text-[#7A4F2A] dark:text-[#D6A87C] font-semibold' // Bronze
    default:
      return ''
  }
}

export const getClassNameForRow = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-[rgba(255,223,66,0.3)] dark:from-[rgba(255,223,66,0.15)] to-transparent' // Gold
    case 2:
      return 'bg-gradient-to-r from-[rgba(219,219,219,0.25)] dark:from-[rgba(219,219,219,0.12)] to-transparent' // Silver
    case 3:
      return 'bg-gradient-to-r from-[rgba(170,139,103,0.15)] dark:from-[rgba(170,139,103,0.1)] to-transparent' // Bronze
    default:
      return ''
  }
}

export const RANK_COLUMN: ColumnDef<LeaderboardEntry, unknown> = {
  id: 'rank',
  header: 'Rank',
  cell: (props) => {
    const rank = props.row.original.rank

    return <span className={classNames(getClassForRank(rank))}>{rank}</span>
  },
  size: 20,
  meta: {
    body: {
      className: '!max-w-[60px]',
      skeleton: (
        <div className="w-[20px]">
          <SkeletonText fontSize="lg" />
        </div>
      ),
    },
  },
}
export const USER_COLUMN: ColumnDef<LeaderboardEntry, unknown> = {
  id: 'user',
  header: 'Trader',
  cell: (props) => {
    const { address: connectedAddress } = useAccount()
    const address = props.row.original.address as EvmAddress
    const isYou = connectedAddress?.toLowerCase() === address.toLowerCase()
    const rank = props.row.original.rank
    const { data: ensName } = useEnsName({
      chainId: EvmChainId.ETHEREUM,
      address,
    })

    const { data: avatar } = useEnsAvatar({
      name: ensName || undefined,
      chainId: EvmChainId.ETHEREUM,
    })
    return (
      <div className="flex items-center gap-2 min-w-[150px]">
        {avatar ? (
          <Image
            alt="ens-avatar"
            src={avatar}
            width={20}
            height={20}
            className="rounded-full w-[20px] h-[20px] object-fill"
            loader={cloudinaryFetchLoader}
          />
        ) : (
          <JazzIcon diameter={20} address={address} />
        )}
        <Badge
          position="top-right"
          className="!-top-2 !-right-12"
          badgeContent={isYou ? <Chip variant="blue">You</Chip> : <></>}
        >
          <div className={classNames(getClassForRank(rank))}>
            {truncateString(ensName ?? address, 10, 'middle')}
          </div>
        </Badge>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: (
        <div className="flex items-center w-full gap-2">
          <SkeletonCircle radius={30} />

          <div className="w-[130px]">
            <SkeletonText fontSize="lg" />
          </div>
        </div>
      ),
    },
  },
}

export const POINTS_COLUMN: ColumnDef<LeaderboardEntry, unknown> = {
  id: 'points',
  header: 'Points',
  accessorFn: (row) => row.points,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.points - rowB.points,
  cell: (props) => {
    const points = props.row.original.points
    return <span className="font-medium">{formatNumber(points)}</span>
  },
  meta: {
    body: {
      skeleton: (
        <div className="w-[80px]">
          <SkeletonText fontSize="lg" />
        </div>
      ),
    },
  },
}

export const VOLUME_COLUMN: ColumnDef<LeaderboardEntry, unknown> = {
  id: 'volumeUsd',
  header: 'Volume',
  accessorFn: (row) => row.volumeUsd,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.volumeUsd - rowB.volumeUsd,
  cell: (props) => {
    const volume = props.row.original.volumeUsd
    return <span className="font-medium">{formatUSD(volume)}</span>
  },
  meta: {
    body: {
      skeleton: (
        <div className="w-[80px]">
          <SkeletonText fontSize="lg" />
        </div>
      ),
    },
  },
}
