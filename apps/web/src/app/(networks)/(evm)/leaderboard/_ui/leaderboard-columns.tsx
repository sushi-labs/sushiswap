import type { LeaderboardEntry } from '@sushiswap/graph-client/leaderboard'
import {
  Chip,
  SkeletonCircle,
  SkeletonText,
  classNames,
  cloudinaryFetchLoader,
} from '@sushiswap/ui'
import { CrownIcon } from '@sushiswap/ui/icons/CrownIcon'
import { JazzIcon } from '@sushiswap/ui/icons/JazzIcon'
import type { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'
import { useMemo } from 'react'
import { formatNumber, formatUSD, truncateString } from 'sushi'
import { type EvmAddress, EvmChainId } from 'sushi/evm'
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi'

const getClassForRank = (rank: number) => {
  switch (rank) {
    case 1:
      return 'dark:text-[#FFD84D] text-[#AE8A13] !font-semibold' // Gold
    case 2:
      return 'dark:text-white text-[#8A8A8A] !font-semibold' // Silver
    case 3:
      return 'dark:text-[#D6A87C] text-[#B15C0B] !font-semibold' // Bronze
    default:
      return ''
  }
}

export const getClassNameForRow = (rank: number) => {
  switch (rank) {
    case 1:
      return '!border-b !border-b-black/[4%] dark:!border-b-white/[4%] bg-gradient-to-r from-[rgba(59,130,246,0.1)] to-[rgba(251,42,255,0.01)] dark:from-[rgba(219,219,219,0.12)] dark:to-transparent'
    case 2:
      return '!border-b !border-b-black/[4%] dark:!border-b-white/[4%] bg-gradient-to-r from-[rgba(59,130,246,0.1)] to-[rgba(251,42,255,0.01)] dark:from-[rgba(219,219,219,0.12)] dark:to-transparent'
    case 3:
      return 'bg-gradient-to-r from-[rgba(59,130,246,0.1)] to-[rgba(251,42,255,0.01)] dark:from-[rgba(219,219,219,0.12)] dark:to-transparent'
    default:
      return ''
  }
}

const shouldShowCrown = (rank: number) => rank >= 1 && rank <= 3

export const RANK_COLUMN: ColumnDef<LeaderboardEntry, unknown> = {
  id: 'rank',
  header: 'Rank',
  cell: (props) => {
    const { address: connectedAddress } = useAccount()
    const address = props.row.original.address as EvmAddress
    const isYou = connectedAddress?.toLowerCase() === address?.toLowerCase()
    const rank = props.row.original.rank

    return (
      <span
        className={classNames(
          isYou ? 'text-blue' : '',
          '!font-medium',
          getClassForRank(rank),
        )}
      >
        {rank}
      </span>
    )
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
    const isYou = connectedAddress?.toLowerCase() === address?.toLowerCase()
    const rank = props.row.original.rank
    const { data: ensName } = useEnsName({
      chainId: EvmChainId.ETHEREUM,
      address,
    })

    const { data: avatar } = useEnsAvatar({
      name: ensName || undefined,
      chainId: EvmChainId.ETHEREUM,
    })

    const _shouldShowCrown = useMemo(() => shouldShowCrown(rank), [rank])
    const classesForRank = useMemo(() => getClassForRank(rank), [rank])

    return (
      <div className="flex items-center gap-4 justify-between w-fit min-w-[150px]">
        <div className="flex items-center gap-2">
          {avatar ? (
            <Image
              alt="ens-avatar"
              src={avatar}
              width={32}
              height={32}
              className="rounded-full w-[20px] h-[20px] object-fill"
              loader={cloudinaryFetchLoader}
            />
          ) : (
            <JazzIcon diameter={32} address={address} />
          )}
          <div className="flex flex-col">
            <div className={classNames(classesForRank)}>
              {truncateString(ensName ?? address, 10, 'middle')}
            </div>
            <div className="text-xs">💎 Tier: todo</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {_shouldShowCrown ? (
            <div
              className={classNames(
                'rounded-lg p-2.5 flex items-center justify-center bg-black/[4%]',
                classesForRank,
              )}
            >
              <CrownIcon className="w-3.5 h-3.5" />
            </div>
          ) : null}
          {isYou ? (
            <Chip variant="blue" className="h-[24px] !font-bold">
              YOU
            </Chip>
          ) : null}
        </div>
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
