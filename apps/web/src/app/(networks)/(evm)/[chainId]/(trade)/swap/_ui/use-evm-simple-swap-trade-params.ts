import { useMemo } from 'react'
import type { SupportedChainId } from 'src/config'
import { useSlippageTolerance } from 'src/lib/hooks/use-slippage-tolerance'
import type { UseDirectPoolTradeParams } from 'src/lib/swap/direct-pool/types'
import { useCarbonOffset } from 'src/lib/swap/use-carbon-offset'
import { ZERO } from 'sushi'
import { type EvmChainId, isEvmChainId } from 'sushi/evm'
import { useGasPrice } from 'wagmi'
import { useDerivedStateSimpleSwap } from './derivedstate-simple-swap-provider'

export function useEvmSimpleSwapTradeParams(
  enabled = true,
): UseDirectPoolTradeParams {
  const { state } = useDerivedStateSimpleSwap<EvmChainId & SupportedChainId>()
  const [slippagePercent] = useSlippageTolerance(
    state.slippageToleranceOptions?.storageKey,
    state.slippageToleranceOptions?.defaultValue,
  )
  const [carbonOffset] = useCarbonOffset()
  const evmChainId = isEvmChainId(state.chainId) ? state.chainId : undefined
  const { data: gasPrice } = useGasPrice({ chainId: evmChainId })

  return useMemo(
    () => ({
      chainId: evmChainId,
      fromToken: state.token0,
      toToken: state.token1,
      amount: state.swapAmount,
      slippagePercentage: slippagePercent.toString({ fixed: 2 }),
      gasPrice,
      fee: state.fee,
      recipient: state.recipient,
      enabled: Boolean(enabled && state.swapAmount?.gt(ZERO)),
      carbonOffset,
      directPool: state.directPool,
    }),
    [state, slippagePercent, gasPrice, carbonOffset, enabled, evmChainId],
  )
}
