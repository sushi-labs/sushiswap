import { useLocalStorage } from '@sushiswap/hooks'
import { createErrorToast } from '@sushiswap/notifications'
import { Button } from '@sushiswap/ui'
import { useState } from 'react'
import { formatUnits } from 'viem'
import { useAddLiquidity, useRemoveLiquidity } from '~stellar/_common/lib/hooks'
import type { PositionSummary } from '~stellar/_common/lib/hooks/position/use-my-position'
import type { IPositionRowData } from '~stellar/_common/ui/Pools/PositionsTable/PositionsTable'
import { useStellarWallet } from '~stellar/providers'
import type { PendingMigration } from '../types'

export const LegacyPositionMigrateCell = ({
  data,
}: { data: IPositionRowData }) => {
  const { connectedAddress, signTransaction, signAuthEntry } =
    useStellarWallet()
  const decreaseLiquidityMutation = useRemoveLiquidity({ isLegacy: true })
  const increaseLiquidityMutation = useAddLiquidity()
  const [pendingMigrations, setPendingMigrations] = useLocalStorage<
    Record<PositionSummary['tokenId'], PendingMigration>
  >('stellar-pending-migrations', {})

  const {
    tokenId,
    liquidity,
    token0,
    token1,
    pool,
    feesToken0,
    feesToken1,
    principalToken0,
    principalToken1,
    tickLower,
    tickUpper,
  } = data
  const [isMigrating, setIsMigrating] = useState(false)
  const isLegacyPositionActive =
    BigInt(liquidity || '0') > 0n || feesToken0 > 0n || feesToken1 > 0n

  // Handle migrate
  const handleMigrate = async () => {
    try {
      setIsMigrating(true)
      if (!connectedAddress) {
        createErrorToast('Please connect your wallet', false)
        return
      }

      const hasPendingMigration = Boolean(pendingMigrations[tokenId])
      const migrationParameters = hasPendingMigration
        ? pendingMigrations[tokenId]
        : {
            principal0: principalToken0.toString(),
            principal1: principalToken1.toString(),
          }

      if (isLegacyPositionActive) {
        if (!hasPendingMigration) {
          setPendingMigrations((prev) => ({
            ...prev,
            [tokenId]: migrationParameters,
          }))
        }
        await decreaseLiquidityMutation.mutateAsync({
          tokenId: tokenId,
          liquidity: BigInt(liquidity || '0'),
          amount0Min: 0n,
          amount1Min: 0n,
          token0,
          token1,
          poolAddress: pool,
        })
      }

      await increaseLiquidityMutation.mutateAsync({
        userAddress: connectedAddress,
        poolAddress: pool,
        token0Amount: formatUnits(
          BigInt(migrationParameters.principal0),
          token0.decimals,
        ),
        token1Amount: formatUnits(
          BigInt(migrationParameters.principal1),
          token1.decimals,
        ),
        token0Decimals: token0.decimals,
        token1Decimals: token1.decimals,
        tickLower,
        tickUpper,
        signTransaction,
        signAuthEntry,
      })

      setPendingMigrations((prev) => {
        const { [tokenId]: _, ...rest } = prev
        return rest
      })
    } finally {
      setIsMigrating(false)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <Button size="sm" onClick={handleMigrate} disabled={isMigrating}>
        {isMigrating ? 'Migrating...' : 'Migrate'}
      </Button>
    </div>
  )
}
