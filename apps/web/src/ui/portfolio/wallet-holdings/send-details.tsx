import { Collapsible, SkeletonBox } from '@sushiswap/ui'
import { useMemo } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
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
    data: gasEst,
    isLoading: isGasEstLoading,
    isFetching: isGasEstFetching,
  } = useEstimateGas({
    chainId: state.token0?.chainId,
    query: {
      refetchInterval: 10000,
      enabled: !!state.token0 && !!state.amount,
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
      enabled: !!state.token0 && !!state.amount,
    },
  })
  const isLoading =
    isGasEstLoading ||
    isGasPriceLoading ||
    isGasEstFetching ||
    isGasPriceFetching

  const nativeToken = Native.onChain(state.token0?.chainId as EvmChainId)

  const formattedGasCost = useMemo(() => {
    if (!gasEst || !gasPrice) return null

    const totalCostWei = gasEst * gasPrice

    return {
      raw: totalCostWei,
      formatted: formatUnits(totalCostWei, nativeToken.decimals),
    }
  }, [gasEst, gasPrice, nativeToken.decimals])

  const [gasCostUsd] = useTokenAmountDollarValues({
    chainId: state.token0?.chainId as EvmChainId,
    amounts: formattedGasCost?.raw
      ? [Amount.fromRawAmount(nativeToken, formattedGasCost.raw)]
      : [],
  })

  return (
    <Collapsible
      open={
        !!state.token0 &&
        !!state.amount &&
        !Number.isNaN(Number(state.amount)) &&
        !!state.recipientAddress &&
        isRecipientValid
      }
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Network fee</span>
          <div className="flex gap-0.5 items-center">
            {gasCostUsd && formattedGasCost && !isLoading ? (
              <>
                <span>(~${gasCostUsd.toFixed(2)})</span>
                <span className="font-medium">
                  {formattedGasCost.formatted} {nativeToken.symbol}
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
            <span className="font-medium">5 seconds</span>
          </div>
        </div>
      </div>
    </Collapsible>
  )
}
