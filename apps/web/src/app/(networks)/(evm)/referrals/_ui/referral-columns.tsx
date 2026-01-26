import {
  SkeletonCircle,
  SkeletonText,
  cloudinaryFetchLoader,
} from '@sushiswap/ui'
import { JazzIcon } from '@sushiswap/ui/icons/JazzIcon'
import type { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'
import { formatNumber, formatUSD, truncateString } from 'sushi'
import { EvmChainId } from 'sushi/evm'
import { useEnsAvatar, useEnsName } from 'wagmi'
import type { ReferralEntry } from './referral-table'

export const USER_COLUMN: ColumnDef<ReferralEntry, unknown> = {
  id: 'user',
  header: 'User',
  cell: (props) => {
    const address = props.row.original.address

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

export const POINTS_COLUMN: ColumnDef<ReferralEntry, unknown> = {
  id: 'points',
  header: 'Points Earned',
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

export const VOLUME_COLUMN: ColumnDef<ReferralEntry, unknown> = {
  id: 'volumeUsd',
  header: 'Volume (All-Time)',
  cell: (props) => {
    const volume = props.row.original.volume
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
