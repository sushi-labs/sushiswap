import { useLocalStorage } from '@sushiswap/hooks'
import { useMemo } from 'react'
import type { PendingMigration } from '~stellar/legacy-positions/types'
import { MINIMUM_DUST_LIQUIDITY } from '../../services/position-service'
import { type PositionSummary, useMyPosition } from './use-my-position'

type MyLegacyPositionData = {
  positions: PositionSummary[]
  isLoading: boolean
  error: Error | null
}

/**
 * Hook to get aggregated position data for the My Legacy Positions component
 */
export function useMyUnmigratedLegacyPositions({
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
  } = useMyPosition({ userAddress, excludeDust: false, isLegacy: false })

  const activeLegacyPositions = useMemo(() => {
    const activePositions = legacyPositions.filter((position) => {
      const isPendingMigration = Boolean(pendingMigrations[position.tokenId])
      const isMigrated = nonLegacyPositions.some((nonLegacyPosition) => {
        return (
          nonLegacyPosition.token0.contract === position.token0.contract &&
          nonLegacyPosition.token1.contract === position.token1.contract &&
          nonLegacyPosition.fee === position.fee &&
          nonLegacyPosition.tickLower === position.tickLower &&
          nonLegacyPosition.tickUpper === position.tickUpper
        )
      })
      return (
        BigInt(position.liquidity || '0') >= MINIMUM_DUST_LIQUIDITY ||
        position.feesToken0 >= MINIMUM_DUST_LIQUIDITY ||
        position.feesToken1 >= MINIMUM_DUST_LIQUIDITY ||
        (isPendingMigration && !isMigrated)
      )
    })
    return activePositions
  }, [legacyPositions, pendingMigrations, nonLegacyPositions])

  return {
    positions: activeLegacyPositions,
    isLoading: legacyPositionsLoading || nonLegacyPositionsLoading,
    error: legacyPositionsError || nonLegacyPositionsError,
  }
}
