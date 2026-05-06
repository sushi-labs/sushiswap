'use client'
import {
  Button,
  LinkInternal,
  SkeletonBox,
  SkeletonCircle,
} from '@sushiswap/ui'
import { useMemo } from 'react'
import { usePointsData } from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet/hooks'
import { DEFAULT_TIERS } from './overview'

const FALLBACK_TIER = DEFAULT_TIERS[0]

export const PointsCTA = () => {
  const address = useAccount('evm')
  const { data, isLoading } = usePointsData({ address })

  const tier = useMemo(() => {
    if (!address) return FALLBACK_TIER

    return data?.currentTier
  }, [data?.currentTier, address])

  if (isLoading) {
    return <_Skeleton />
  }

  return (
    <LinkInternal href="/perps/points">
      <Button
        variant="perps-secondary"
        className="relative overflow-hidden !px-2"
      >
        <div
          className="w-[80px] animate-float z-[1] h-[80px] rounded-full absolute -top-5 -left-10 opacity-40 blur-[20px] pointer-events-none"
          style={{
            background: tier?.bgGradient,
          }}
        />

        <div className="flex items-center z-[2] gap-1">
          <div className="w-[25px] h-[25px] max-w-[25px] pt-[1px] ">
            {tier?.icon}
          </div>
          <div className="bg-gradient-to-r w-fit from-[#27B0E6] from-2% via-[#7D8ACA] via-5% to-[#FA52A0] to-100% text-transparent bg-clip-text font-semibold hidden sm:block">
            {!address ? 1.069 : data?.currentMultiplier}x
          </div>
        </div>
      </Button>
    </LinkInternal>
  )
}

const _Skeleton = () => {
  return (
    <LinkInternal href="/perps/points">
      <Button
        variant="perps-secondary"
        className="relative overflow-hidden !px-2"
      >
        <div className="flex items-center z-[2] gap-1">
          <div className="w-[25px] h-[25px] max-w-[25px]">
            <SkeletonCircle radius={25} />
          </div>
          <SkeletonBox className="rounded-md w-[40px] h-5  hidden sm:block" />
        </div>
      </Button>
    </LinkInternal>
  )
}
