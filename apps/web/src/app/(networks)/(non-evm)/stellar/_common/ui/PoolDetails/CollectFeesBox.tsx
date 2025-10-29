import { Button, Card, CardContent, CardHeader, CardTitle } from '@sushiswap/ui'
import type React from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useStablePrice } from '~stellar/_common/lib/hooks/price/use-stable-price'
import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
import { formatTokenAmount } from '~stellar/_common/lib/utils/format'
import { useStellarWallet } from '~stellar/providers'
import { useMyPosition } from '../../lib/hooks/position/use-my-position'
import { useCollectFees } from '../../lib/hooks/position/use-positions'
import { LiquidityItem } from './LiquidityItem'

interface CollectFeesBoxProps {
  pool: PoolInfo
}

export const CollectFeesBox: React.FC<CollectFeesBoxProps> = ({ pool }) => {
  const { connectedAddress, signTransaction } = useStellarWallet()
  const { positions, isLoading: isPositionsLoading } = useMyPosition(
    connectedAddress || undefined,
    pool.address,
  )
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
      toast.error('Please connect your wallet')
      return
    }

    if (positions.length === 0) {
      toast.error('No positions found')
      return
    }

    try {
      setIsCollecting(true)

      // Count positions with fees
      const positionsWithFees = positions.filter(
        (p) => p.feesToken0 > 0n || p.feesToken1 > 0n,
      )

      if (positionsWithFees.length === 0) {
        toast.info('No fees to collect')
        return
      }

      toast.info(
        `Collecting fees from ${positionsWithFees.length} position${positionsWithFees.length > 1 ? 's' : ''}...`,
      )

      let successCount = 0

      // Collect from all positions that have fees
      for (const position of positionsWithFees) {
        console.log(`Collecting fees from position ${position.tokenId}`)

        console.log(`Position ${position.tokenId} fees:`, {
          feesToken0: position.feesToken0.toString(),
          feesToken1: position.feesToken1.toString(),
        })

        // Max uint128 value for collecting all available fees
        const maxAmount = BigInt('340282366920938463463374607431768211455') // 2^128 - 1

        try {
          await collectFeesMutation.mutateAsync({
            tokenId: position.tokenId,
            recipient: connectedAddress,
            amount0Max: maxAmount,
            amount1Max: maxAmount,
            signTransaction,
          })

          successCount++
          console.log(
            `Successfully collected fees from position ${position.tokenId}`,
          )
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

          toast.error(errorMessage)
        }
      }

      if (successCount === positionsWithFees.length) {
        toast.success(
          `Successfully collected fees from ${successCount} position${successCount > 1 ? 's' : ''}!`,
        )
      } else if (successCount > 0) {
        toast.warning(
          `Collected fees from ${successCount} of ${positionsWithFees.length} positions`,
        )
      }
    } catch (error) {
      console.error('Failed to collect fees:', error)
      toast.error('Failed to collect fees. Please try again.')
    } finally {
      setIsCollecting(false)
    }
  }

  // Don't show the box if no positions
  if (!connectedAddress || positions.length === 0) {
    return null
  }

  return (
    <Card className="bg-slate-900/50 border-slate-800">
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
            amount={Number.parseFloat(
              formatTokenAmount(totalFees.token0, pool.token0.decimals),
            ).toFixed(6)}
            usdAmount={(
              Number(
                formatTokenAmount(totalFees.token0, pool.token0.decimals),
              ) * Number(priceToken0 ?? 0)
            ).toFixed(2)}
          />
          <LiquidityItem
            isLoading={isLoading}
            token={pool.token1}
            amount={Number.parseFloat(
              formatTokenAmount(totalFees.token1, pool.token1.decimals),
            ).toFixed(6)}
            usdAmount={(
              Number(
                formatTokenAmount(totalFees.token1, pool.token1.decimals),
              ) * Number(priceToken1 ?? 0)
            ).toFixed(2)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
