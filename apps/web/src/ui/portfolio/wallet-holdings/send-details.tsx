import { Collapsible, SkeletonBox } from '@sushiswap/ui'
import { useMemo } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { useAverageBlockTime } from 'src/lib/wagmi/hooks/block/use-average-blocktime'
import type { EvmChainId } from 'sushi'
import { Amount } from 'sushi/currency'
import { Native } from 'sushi/currency'
import { formatUnits } from 'viem'
import { useEstimateGas, useGasPrice } from 'wagmi'
import { useSendTokens } from './send-token-provider'

export const SendDetails = ({
  isRecipientValid,
}: { isRecipientValid: boolean }) => {
  const { state } = useSendTokens()

  const {
    data: avgBlockTime,
    isLoading: isAvgBlockTimeLoading,
    isFetching: isAvgBlockTimeFetching,
  } = useAverageBlockTime()

  const isLoadingTxTime = isAvgBlockTimeLoading || isAvgBlockTimeFetching

  const {
    data: gasEst,
    isLoading: isGasEstLoading,
    isFetching: isGasEstFetching,
  } = useEstimateGas({
    chainId: state.token0?.chainId,
    query: {
      refetchInterval: 10000,
      enabled: Boolean(state.token0) && Boolean(state.amount),
    },
  })

  const {
    data: gasPrice,
    isLoading: isGasPriceLoading,
    isFetching: isGasPriceFetching,
  } = useGasPrice({
    chainId: state.token0?.chainId,
    query: {
      refetchInterval: 10000,
      enabled: Boolean(state.token0) && Boolean(state.amount),
    },
  })
  const isLoadingGasPrice =
    isGasEstLoading ||
    isGasPriceLoading ||
    isGasEstFetching ||
    isGasPriceFetching

  const nativeToken = useMemo(() => {
    if (state.token0?.chainId === undefined) return undefined

    const token = Native.onChain(state.token0.chainId)
    return token
  }, [state.token0?.chainId])

  const formattedGasCost = useMemo(() => {
    if (!gasEst || !gasPrice || !nativeToken) return null

    const totalCostWei = gasEst * gasPrice

    return {
      raw: totalCostWei,
      formatted: formatUnits(totalCostWei, nativeToken.decimals),
    }
  }, [gasEst, gasPrice, nativeToken])

  const [gasCostUsd] = useTokenAmountDollarValues({
    chainId: state.token0?.chainId,
    amounts:
      formattedGasCost?.raw && nativeToken
        ? [Amount.fromRawAmount(nativeToken, formattedGasCost.raw)]
        : [],
  })

  const estimatedConfirmationTime = useMemo(() => {
    if (!avgBlockTime) return null
    const expectedBlocksToConfirm = 1
    return avgBlockTime * expectedBlocksToConfirm
  }, [avgBlockTime])

  return (
    <Collapsible
      open={
        Boolean(state.token0) &&
        Boolean(state.amount) &&
        !Number.isNaN(Number(state.amount)) &&
        Boolean(state.resolvedRecipientAddress) &&
        isRecipientValid
      }
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Network fee</span>
          <div className="flex gap-0.5 items-center">
            {gasCostUsd && formattedGasCost && !isLoadingGasPrice ? (
              <>
                <span>(~${gasCostUsd.toFixed(2)})</span>
                <span className="font-medium">
                  {formattedGasCost.formatted} {nativeToken?.symbol}
                </span>
              </>
            ) : (
              <SkeletonBox className="h-4 py-0.5 w-[240px]" />
            )}
          </div>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Estimated Time</span>
          <div className="flex gap-0.5">
            {estimatedConfirmationTime && !isLoadingTxTime ? (
              <span className="font-medium">
                {Math.round(estimatedConfirmationTime)} seconds
              </span>
            ) : (
              <SkeletonBox className="h-4 py-0.5 w-[70px]" />
            )}
          </div>
        </div>
      </div>
    </Collapsible>
  )
}
