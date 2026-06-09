'use client'
import { getPerpsPointsOverview } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { DEFAULT_TIERS, getTier } from '~evm/perps/points/_ui/overview'
import { perpsNumberFormatter } from '../utils'

export function usePointsData({
  address,
}: {
  address: EvmAddress | undefined
}) {
  return useQuery({
    queryKey: ['usePointsData', address],
    queryFn: async () => {
      if (!address) {
        throw new Error('address is required')
      }

      const data = await getPerpsPointsOverview({
        address,
      })

      const totalVolumeUsd = data?.totalVolumeUsd || 0
      const pointMultipliers = data?.pointMultipliers
      const current = pointMultipliers.findLast(
        (i) => i.thresholdUsd <= totalVolumeUsd,
      )
      const currentThresholdUsd = current?.thresholdUsd || 0

      const currentTier = !currentThresholdUsd
        ? DEFAULT_TIERS[0]
        : getTier(currentThresholdUsd)
      let currentMultiplier = current?.multiplier || 1
      if (currentMultiplier === 1) {
        currentMultiplier = 1.069
      }

      const currentTierIdx = pointMultipliers.findLastIndex(
        (i) => i.thresholdUsd <= currentThresholdUsd,
      )
      let _nextTier = pointMultipliers[currentTierIdx + 1]
      let percentageCompletedTier = 1
      let nextMultiplier = _nextTier?.multiplier
      if (!_nextTier) {
        percentageCompletedTier = 1
        nextMultiplier = currentMultiplier
        _nextTier = {
          multiplier: 2,
          thresholdUsd: Number.POSITIVE_INFINITY,
        }
      }

      const nextThresholdUsd = _nextTier?.thresholdUsd
      percentageCompletedTier =
        nextThresholdUsd && Number.isFinite(nextThresholdUsd)
          ? Math.min(
              1,
              Math.max(
                0,
                (totalVolumeUsd - currentThresholdUsd) /
                  (nextThresholdUsd - currentThresholdUsd),
              ),
            )
          : 1
      if (
        totalVolumeUsd >= currentThresholdUsd &&
        currentTier.id === 'legend'
      ) {
        percentageCompletedTier = 1
      }

      const currentPoints = data?.totalPoints
        ? perpsNumberFormatter({
            value: data?.totalPoints,
            minFraxDigits: 0,
            maxFraxDigits: 0,
          })
        : '0'

      return {
        currentThresholdUsd,
        currentMultiplier,
        percentageCompletedTier,
        nextMultiplier,
        currentPoints,
        currentTier,
        pointMultipliers: data?.pointMultipliers || [],
        totalVolumeUsd,
      }
    },
    enabled: Boolean(address),
  })
}
