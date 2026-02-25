import { useLocalStorage } from '@sushiswap/hooks'
import { useMemo } from 'react'
import type { PendingMigration } from '~stellar/legacy-positions/types'
import { MINIMUM_DUST_LIQUIDITY } from '../../services/position-service'
import {
  type MyPositionData,
  type PositionSummary,
  useMyPosition,
} from './use-my-position'

type MyLegacyPositionData = {
  positions: Array<PositionSummary & { isMigrated: boolean }>
  isLoading: boolean
  error: Error | null
}

/**
 * Hook to get aggregated position data for the My Legacy Positions component
 */
export function useMyLegacyPosition({
  userAddress,
}: {
  userAddress?: string
}): MyLegacyPositionData {
  const [pendingMigrations] = useLocalStorage<
    Record<PositionSummary['tokenId'], PendingMigration>
  >('stellar-pending-migrations', {})

  const {
    positions: legacyPositions = [],
    isLoading: legacyPositionsLoading,
    error: legacyPositionsError,
  } = useMyPosition({ userAddress, excludeDust: false, isLegacy: true })

  const {
    positions: nonLegacyPositions = [],
    isLoading: nonLegacyPositionsLoading,
    error: nonLegacyPositionsError,
  } = useMyPosition({ userAddress, excludeDust: true, isLegacy: false })

  const activeLegacyPositions = useMemo(() => {
    const activePositions = legacyPositions.filter((position) => {
      const isPendingMigration = Boolean(pendingMigrations[position.tokenId])
      return (
        Number(position.liquidity) >= MINIMUM_DUST_LIQUIDITY ||
        position.feesToken0 >= MINIMUM_DUST_LIQUIDITY ||
        position.feesToken1 >= MINIMUM_DUST_LIQUIDITY ||
        isPendingMigration
      )
    })
    return activePositions
  }, [legacyPositions, pendingMigrations])

  const legacyPositionsWithMigrationStatus = useMemo(() => {
    return activeLegacyPositions.map((position) => {
      return {
        ...position,
        isMigrated: nonLegacyPositions.some((nonLegacyPosition) => {
          return (
            nonLegacyPosition.principalToken0 === position.principalToken0 &&
            nonLegacyPosition.principalToken1 === position.principalToken1 &&
            nonLegacyPosition.pool === position.pool &&
            nonLegacyPosition.tickLower === position.tickLower &&
            nonLegacyPosition.tickUpper === position.tickUpper
          )
        }),
      }
    })
  }, [activeLegacyPositions, nonLegacyPositions])

  return {
    positions: legacyPositionsWithMigrationStatus,
    isLoading: legacyPositionsLoading || nonLegacyPositionsLoading,
    error: legacyPositionsError || nonLegacyPositionsError,
  }
}
