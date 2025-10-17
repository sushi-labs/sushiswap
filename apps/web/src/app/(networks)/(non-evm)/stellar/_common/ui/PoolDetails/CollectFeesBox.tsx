import { Button, Card, CardContent, CardHeader, CardTitle } from '@sushiswap/ui'
import type React from 'react'
import { useState } from 'react'
import { formatUSD } from 'sushi/format'
import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
import { useStellarWallet } from '~stellar/providers'
import { useMyPosition } from '../../lib/hooks/position/use-my-position'
import { useCollectFees } from '../../lib/hooks/position/use-positions'
import { LiquidityItem } from './LiquidityItem'

interface CollectFeesBoxProps {
  pool: PoolInfo
}

export const CollectFeesBox: React.FC<CollectFeesBoxProps> = ({ pool }) => {
  const { connectedAddress, signTransaction } = useStellarWallet()
  const { positions, isLoading } = useMyPosition(
    connectedAddress || undefined,
    pool.address,
  )
  const collectFeesMutation = useCollectFees()
  const [isCollecting, setIsCollecting] = useState(false)

  // Calculate total fees across all positions
  const totalFees = positions.reduce(
    (acc, position) => ({
      token0: acc.token0 + Number.parseFloat(position.feesToken0),
      token1: acc.token1 + Number.parseFloat(position.feesToken1),
    }),
    { token0: 0, token1: 0 },
  )

  const hasFees = totalFees.token0 > 0 || totalFees.token1 > 0

  // Handle collect fees
  const handleCollectFees = async () => {
    if (!connectedAddress || !signTransaction) {
      console.error('Wallet not connected')
      return
    }

    if (positions.length === 0) {
      console.error('No positions found')
      return
    }

    try {
      setIsCollecting(true)

      // Collect from all positions that have fees
      for (const position of positions) {
        const hasPositionFees =
          Number.parseFloat(position.feesToken0) > 0 ||
          Number.parseFloat(position.feesToken1) > 0

        if (hasPositionFees) {
          console.log(`Collecting fees from position ${position.tokenId}`)

          // Max uint128 value for collecting all available fees
          const maxAmount = BigInt('340282366920938463463374607431768211455') // 2^128 - 1

          await collectFeesMutation.mutateAsync({
            tokenId: position.tokenId,
            recipient: connectedAddress,
            amount0Max: maxAmount,
            amount1Max: maxAmount,
            signTransaction,
          })

          console.log(
            `Successfully collected fees from position ${position.tokenId}`,
          )
        }
      }
    } catch (error) {
      console.error('Failed to collect fees:', error)
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
            amount={totalFees.token0.toFixed(6)}
            usdAmount="0.00" // TODO: Calculate USD value for fees
          />
          <LiquidityItem
            isLoading={isLoading}
            token={pool.token1}
            amount={totalFees.token1.toFixed(6)}
            usdAmount="0.00" // TODO: Calculate USD value for fees
          />
        </div>
      </CardContent>
    </Card>
  )
}
