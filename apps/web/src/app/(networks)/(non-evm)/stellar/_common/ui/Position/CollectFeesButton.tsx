import { createErrorToast, createToast } from '@sushiswap/notifications'
import { Button } from '@sushiswap/ui'
import type React from 'react'
import { useCallback, useMemo } from 'react'
import { useCollectFees } from '../../lib/hooks/position/use-positions'
import { useUncollectedFees } from '../../lib/hooks/position/use-positions'
import { formatTokenAmount } from '../../lib/utils/format'
import { getStellarTxnLink } from '../../lib/utils/stellarchain-helpers'

interface CollectFeesButtonProps {
  tokenId: number
  userAddress: string
  signTransaction: (xdr: string) => Promise<string>
  signAuthEntry: (entryPreimageXdr: string) => Promise<string>
  token0Code: string
  token1Code: string
  disabled?: boolean
}

export const CollectFeesButton: React.FC<CollectFeesButtonProps> = ({
  tokenId,
  userAddress,
  signTransaction,
  signAuthEntry,
  token0Code,
  token1Code,
  disabled = false,
}) => {
  const { data: fees, isLoading: feesLoading } = useUncollectedFees(tokenId)
  const collectFeesMutation = useCollectFees()

  const hasFees = useMemo(() => {
    if (!fees) return false
    return fees.fees0 > 0n || fees.fees1 > 0n
  }, [fees])

  const handleCollectFees = useCallback(async () => {
    if (!fees || !hasFees) return

    try {
      const result = await collectFeesMutation.mutateAsync({
        tokenId,
        recipient: userAddress,
        amount0Max: fees.fees0,
        amount1Max: fees.fees1,
        signTransaction,
        signAuthEntry,
      })

      // Show success toast
      createToast({
        account: userAddress,
        type: 'claimRewards',
        chainId: 1, // Stellar testnet
        txHash: result.txHash,
        href: getStellarTxnLink(result.txHash),
        promise: Promise.resolve(result),
        summary: {
          pending: 'Collecting fees...',
          completed: 'Fees collected successfully',
          failed: 'Failed to collect fees',
        },
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Failed to collect fees:', error)
      createErrorToast(
        error instanceof Error ? error.message : 'Failed to collect fees',
        false,
      )
    }
  }, [
    fees,
    hasFees,
    collectFeesMutation,
    tokenId,
    userAddress,
    signTransaction,
    signAuthEntry,
  ])

  const buttonText = useMemo(() => {
    if (feesLoading) return 'Loading...'
    if (!fees || !hasFees) return 'No fees to collect'

    const amount0 = formatTokenAmount(fees.fees0, 7)
    const amount1 = formatTokenAmount(fees.fees1, 7)

    if (fees.fees0 > 0n && fees.fees1 > 0n) {
      return `Collect ${amount0} ${token0Code} + ${amount1} ${token1Code}`
    } else if (fees.fees0 > 0n) {
      return `Collect ${amount0} ${token0Code}`
    } else {
      return `Collect ${amount1} ${token1Code}`
    }
  }, [feesLoading, fees, hasFees, token0Code, token1Code])

  const isDisabled = disabled || !hasFees || collectFeesMutation.isPending

  return (
    <Button
      onClick={handleCollectFees}
      disabled={isDisabled}
      loading={collectFeesMutation.isPending}
      size="sm"
      variant="outline"
      className="w-full"
    >
      {buttonText}
    </Button>
  )
}
