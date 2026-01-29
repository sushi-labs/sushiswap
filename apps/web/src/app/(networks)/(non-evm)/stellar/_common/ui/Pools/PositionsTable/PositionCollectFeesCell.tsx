import { createErrorToast, createSuccessToast } from '@sushiswap/notifications'
import { Button } from '@sushiswap/ui'
import { ChainId, MAX_UINT128 } from 'sushi'
import { formatUnits } from 'viem'
import { useCollectFees } from '~stellar/_common/lib/hooks/position/use-positions'
import { getStellarTxnLink } from '~stellar/_common/lib/utils/stellarchain-helpers'
import { useStellarWallet } from '~stellar/providers'
import type { IPositionRowData } from './PositionsTable'

export const PositionCollectFeesCell = ({
  data,
}: { data: IPositionRowData }) => {
  const { feesToken0, feesToken1, token0, token1, tokenId } = data

  const { connectedAddress, signTransaction, signAuthEntry } =
    useStellarWallet()
  const collectFeesMutation = useCollectFees()

  const hasFees = feesToken0 > 0n || feesToken1 > 0n

  // Handle collect fees
  const handleCollectFees = async () => {
    if (!connectedAddress) {
      createErrorToast('Please connect your wallet', false)
      return
    }

    try {
      const result = await collectFeesMutation.mutateAsync({
        tokenId: tokenId,
        recipient: connectedAddress,
        amount0Max: MAX_UINT128,
        amount1Max: MAX_UINT128,
        signTransaction,
        signAuthEntry,
      })

      const token0Amount = formatUnits(result.amount0, token0.decimals)
      const token1Amount = formatUnits(result.amount1, token1.decimals)

      let summary = 'Fees collected successfully'
      if (result.amount0 > 0n && result.amount1 > 0n) {
        summary = `Collected ${token0Amount} ${token0.code} and ${token1Amount} ${token1.code}`
      } else if (result.amount0 > 0n) {
        summary = `Collected ${token0Amount} ${token0.code}`
      } else if (result.amount1 > 0n) {
        summary = `Collected ${token1Amount} ${token1.code}`
      }

      const timestamp = Date.now()
      createSuccessToast({
        summary,
        type: 'claimRewards',
        account: connectedAddress,
        chainId: ChainId.STELLAR,
        txHash: result.txHash,
        href: getStellarTxnLink(result.txHash),
        groupTimestamp: timestamp,
        timestamp,
      })
    } catch (error) {
      console.error(`Failed to collect fees from position ${tokenId}:`, error)

      // Show a concise error message
      const errorMessage =
        error instanceof Error ? error.message : `Failed to collect fees`

      createErrorToast(errorMessage, false)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        size="sm"
        onClick={handleCollectFees}
        disabled={collectFeesMutation.isPending || !hasFees}
      >
        {collectFeesMutation.isPending
          ? 'Collecting...'
          : hasFees
            ? 'Collect Fees'
            : 'No Fees to Collect'}
      </Button>
    </div>
  )
}
