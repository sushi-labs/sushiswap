'use client'

import { SkeletonBox } from '@sushiswap/ui'
import { useCurrentSeason } from 'src/lib/hooks/react-query/leaderboard'

export const SeasonBadge = ({
  seasonName,
}: {
  seasonName?: string
}) => {
  const {
    data: currentSeason,
    isLoading,
    isError,
  } = useCurrentSeason({ enabled: !seasonName })

  if (isError && !seasonName) return null

  if (isLoading && !seasonName) {
    return <SkeletonBox className="w-20 h-7 !rounded-full" />
  }
  return (
    <div className="py-0.5 px-2 max-w-fit h-7 flex items-center justify-center rounded-full bg-gradient-to-r from-[rgba(9,147,236,0.3)] to-[rgba(243,56,195,0.3)]">
      <span className="text-sm whitespace-nowrap uppercase font-semibold bg-clip-text dark:text-white text-transparent bg-gradient-to-r from-[#0993EC] to-[#F338C3]">
        {seasonName ?? currentSeason?.name}
      </span>
    </div>
  )
}
