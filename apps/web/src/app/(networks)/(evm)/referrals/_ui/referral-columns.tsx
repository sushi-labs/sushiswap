import type { ReferredUser } from '@sushiswap/graph-client/leaderboard'
import {
  SkeletonCircle,
  SkeletonText,
  cloudinaryFetchLoader,
} from '@sushiswap/ui'
import { JazzIcon } from '@sushiswap/ui/icons/JazzIcon'
import type { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'
import { formatNumber, formatUSD, truncateString } from 'sushi'
import { type EvmAddress, EvmChainId } from 'sushi/evm'
import { useEnsAvatar, useEnsName } from 'wagmi'

export const USER_COLUMN: ColumnDef<ReferredUser, unknown> = {
  id: 'user',
  header: 'User',
  cell: (props) => {
    const address = props.row.original.address as EvmAddress

    const { data: ensName, isLoading: isLoadingEnsName } = useEnsName({
      chainId: EvmChainId.ETHEREUM,
      address,
    })

    const { data: avatar, isLoading } = useEnsAvatar({
      name: ensName || undefined,
      chainId: EvmChainId.ETHEREUM,
    })

    return (
      <div className="flex items-center gap-2 w-full">
        {isLoading || isLoadingEnsName ? (
          <SkeletonCircle radius={24} />
        ) : avatar ? (
          <Image
            alt="ens-avatar"
            src={avatar}
            width={24}
            height={24}
            className="rounded-full w-[32px] h-[32px] object-fill"
            loader={cloudinaryFetchLoader}
          />
        ) : (
          <JazzIcon diameter={24} address={address} />
        )}
        <div className="flex flex-col">
          <div>{truncateString(ensName ?? address, 10, 'middle')}</div>
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

export const POINTS_COLUMN: ColumnDef<ReferredUser, unknown> = {
  id: 'points',
  header: 'Points Earned',
  cell: (props) => {
    const points = props.row.original.referralPoints
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

export const VOLUME_COLUMN: ColumnDef<ReferredUser, unknown> = {
  id: 'volumeUsd',
  header: 'Volume (All-Time)',
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
