'use client'

import { RollingNumber, SkeletonBox } from '@sushiswap/ui'
import { useMemo } from 'react'
import { useSeasonStats } from 'src/lib/hooks/react-query/leaderboard'

export const SeasonSwapVolume = ({
  seasonName,
}: {
  seasonName: string
}) => {
  const {
    data: seasonData,
    isLoading,
    isError,
  } = useSeasonStats({ enabled: true })

  const totalVolume = useMemo(() => {
    return seasonData?.reduce((acc, stat) => acc + stat.volume, 0) || 0
  }, [seasonData])
  return (
    <div className="flex flex-col items-start md:items-center gap-2">
      <p className="uppercase whitespace-nowrap font-medium flex gap-1 text-[#99A1AF]">
        {seasonName} TOTAL SWAP VOLUME
      </p>
      {isError ? (
        '-'
      ) : isLoading ? (
        <SkeletonBox className="w-40 h-10 rounded-md" />
      ) : (
        <div className="dark:text-white text-black font-bold text-4xl">
          <RollingNumber
            willChange
            format={{
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            }}
            value={totalVolume}
            delayMs={250}
          />
        </div>
      )}
    </div>
  )
}
