import { createErrorToast, createSuccessToast } from '@sushiswap/notifications'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@sushiswap/ui'
import type React from 'react'
import { useState } from 'react'
import { ChainId, MAX_UINT128 } from 'sushi'
import { formatUnits } from 'viem'
import { useStablePrice } from '~stellar/_common/lib/hooks/price/use-stable-price'
import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
import { useStellarWallet } from '~stellar/providers'
import { useMyPosition } from '../../lib/hooks/position/use-my-position'
import { useCollectFees } from '../../lib/hooks/position/use-positions'
import { getStellarTxnLink } from '../../lib/utils/stellarchain-helpers'
import { LiquidityItem } from './LiquidityItem'

interface CollectFeesBoxProps {
  pool: PoolInfo
}

export const CollectFeesBox: React.FC<CollectFeesBoxProps> = ({ pool }) => {
  const { connectedAddress, signTransaction, signAuthEntry } =
    useStellarWallet()
  const { positions, isLoading: isPositionsLoading } = useMyPosition({
    userAddress: connectedAddress || undefined,
    poolAddress: pool.address,
    excludeDust: true,
  })
  const collectFeesMutation = useCollectFees()
  const [isCollecting, setIsCollecting] = useState(false)
  const { data: priceToken0, isLoading: isLoadingPriceToken0 } = useStablePrice(
    { token: pool.token0 },
  )
  const { data: priceToken1, isLoading: isLoadingPriceToken1 } = useStablePrice(
    { token: pool.token1 },
  )
  const isLoading =
    isPositionsLoading || isLoadingPriceToken0 || isLoadingPriceToken1

  // Calculate total fees across all positions
  const totalFees = positions.reduce(
    (acc, position) => ({
      token0: acc.token0 + position.feesToken0,
      token1: acc.token1 + position.feesToken1,
    }),
    { token0: 0n, token1: 0n },
  )

  const hasFees = totalFees.token0 > 0n || totalFees.token1 > 0n

  // Handle collect fees
  const handleCollectFees = async () => {
    if (!connectedAddress || !signTransaction) {
      createErrorToast('Please connect your wallet', false)
      return
    }

    if (positions.length === 0) {
      createErrorToast('No positions found', false)
      return
    }

    try {
      setIsCollecting(true)

      // Count positions with fees
      const positionsWithFees = positions.filter(
        (p) => p.feesToken0 > 0n || p.feesToken1 > 0n,
      )

      if (positionsWithFees.length === 0) {
        return
      }

      const successfulCollections: Array<{
        txHash: string
        amount0: bigint
        amount1: bigint
      }> = []

      // Collect from all positions that have fees
      for (const position of positionsWithFees) {
        try {
          const result = await collectFeesMutation.mutateAsync({
            tokenId: position.tokenId,
            recipient: connectedAddress,
            amount0Max: MAX_UINT128,
            amount1Max: MAX_UINT128,
            signTransaction,
            signAuthEntry,
          })
          successfulCollections.push(result)
        } catch (error) {
          console.error(
            `Failed to collect fees from position ${position.tokenId}:`,
            error,
          )

          // Show a concise error message
          const errorMessage =
            error instanceof Error
              ? `Position #${position.tokenId}: ${error.message}`
              : `Position #${position.tokenId}: Failed to collect fees`

          createErrorToast(errorMessage, false)
        }
      }

      // Show success toast if at least one collection succeeded
      if (successfulCollections.length > 0) {
        const lastTxHash =
          successfulCollections[successfulCollections.length - 1].txHash

        // Sum up the actual amounts collected from all successful operations
        const totalCollected = successfulCollections.reduce(
          (acc, result) => ({
            token0: acc.token0 + result.amount0,
            token1: acc.token1 + result.amount1,
          }),
          { token0: 0n, token1: 0n },
        )

        const token0Amount = formatUnits(
          totalCollected.token0,
          pool.token0.decimals,
        )
        const token1Amount = formatUnits(
          totalCollected.token1,
          pool.token1.decimals,
        )

        let summary = 'Fees collected successfully'
        if (totalCollected.token0 > 0n && totalCollected.token1 > 0n) {
          summary = `Collected ${token0Amount} ${pool.token0.code} and ${token1Amount} ${pool.token1.code}`
        } else if (totalCollected.token0 > 0n) {
          summary = `Collected ${token0Amount} ${pool.token0.code}`
        } else if (totalCollected.token1 > 0n) {
          summary = `Collected ${token1Amount} ${pool.token1.code}`
        }

        const timestamp = Date.now()
        createSuccessToast({
          summary,
          type: 'claimRewards',
          account: connectedAddress,
          chainId: ChainId.STELLAR,
          txHash: lastTxHash,
          href: getStellarTxnLink(lastTxHash),
          groupTimestamp: timestamp,
          timestamp,
        })
      }
    } catch (error) {
      console.error('Failed to collect fees:', error)
      createErrorToast('Failed to collect fees. Please try again.', false)
    } finally {
      setIsCollecting(false)
    }
  }

  // Don't show the box if no positions
  if (!connectedAddress || positions.length === 0) {
    return null
  }

  return (
    <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Collect Fees</CardTitle>
            <div className="text-sm text-slate-400">
              Uncollected fees from your positions
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleCollectFees}
            disabled={collectFeesMutation.isPending || isCollecting || !hasFees}
          >
            {collectFeesMutation.isPending || isCollecting
              ? 'Collecting...'
              : hasFees
                ? 'Collect All Fees'
                : 'No Fees to Collect'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <LiquidityItem
            isLoading={isLoading}
            token={pool.token0}
            amount={formatUnits(totalFees.token0, pool.token0.decimals)}
            usdAmount={(
              Number(formatUnits(totalFees.token0, pool.token0.decimals)) *
              Number(priceToken0 ?? 0)
            ).toFixed(2)}
          />
          <LiquidityItem
            isLoading={isLoading}
            token={pool.token1}
            amount={formatUnits(totalFees.token1, pool.token1.decimals)}
            usdAmount={(
              Number(formatUnits(totalFees.token1, pool.token1.decimals)) *
              Number(priceToken1 ?? 0)
            ).toFixed(2)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
