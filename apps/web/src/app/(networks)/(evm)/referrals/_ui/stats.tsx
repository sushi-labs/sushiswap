'use client'
import { ExternalLinkIcon } from '@heroicons/react-v1/solid'
import { Card, LinkExternal, SkeletonText } from '@sushiswap/ui'
import { DiscordIcon } from '@sushiswap/ui/icons/DiscordIcon'
import { XIcon } from '@sushiswap/ui/icons/XIcon'
import { useUserReferralStats } from 'src/lib/hooks/react-query/referral/use-user-referral-stats'
import { formatNumber, formatUSD } from 'sushi'
import { useAccount } from 'wagmi'

export const Stats = () => {
  const { address } = useAccount()
  const { data, isLoading, isError } = useUserReferralStats({
    address: address,
    enabled: Boolean(address),
  })
  return (
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {isLoading ? (
        <>
          {new Array(3).fill(0).map((_, i) => (
            <_StatItemSkeleton key={i} />
          ))}
        </>
      ) : isError ? (
        <div>Error loading stats</div>
      ) : (
        <>
          <_StatItem
            title="Referral Volume"
            value={!address ? '-' : formatUSD(data?.totalVolumeUsd ?? 0)}
          />
          <_StatItem
            title="Leaderboard Rank"
            value={
              !address || !data?.totalVolumeUsd
                ? '-'
                : data?.currentRank
                  ? `#${data.currentRank}`
                  : '-'
            }
          />
          <_StatItem
            title="Points Earned"
            value={!address ? '-' : formatNumber(data?.totalPoints ?? 0)}
          />
        </>
      )}
      <div className="flex flex-col justify-center gap-2 items-start h-full p-2">
        <LinkExternal href="/discord">
          <div className="flex items-center whitespace-nowrap">
            <DiscordIcon className="w-5 h-5 mr-2" />
            <span>Community on Discord</span>
            <ExternalLinkIcon className="w-4 h-4 ml-1" />
          </div>
        </LinkExternal>
        <LinkExternal href="/twitter">
          <div className="flex items-center whitespace-nowrap">
            <XIcon className="w-5 h-5 mr-2" />
            <span>Follow us on X</span>
            <ExternalLinkIcon className="w-4 h-4 ml-1" />
          </div>
        </LinkExternal>
      </div>
    </div>
  )
}

const _StatItem = ({ title, value }: { title: string; value: string }) => {
  return (
    <Card className="flex p-5 flex-col gap-1 w-full">
      <p className="text-muted-foreground">{title}</p>
      <p className="text-3xl font-medium">{value}</p>
    </Card>
  )
}

const _StatItemSkeleton = () => {
  return (
    <Card className="flex p-5 flex-col w-full">
      <SkeletonText className="!max-w-[40%]" fontSize="default" />
      <SkeletonText className="!max-w-[60%]" fontSize="2xl" />
    </Card>
  )
}
