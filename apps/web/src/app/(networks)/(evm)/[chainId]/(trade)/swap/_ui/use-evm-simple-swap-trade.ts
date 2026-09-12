import { useEvmTrade } from 'src/lib/hooks/react-query/trade/use-evm-trade'
import {
  type CombinedEvmTradeQueryResult,
  combineEvmTradeQueries,
  useDirectPoolTrade,
} from 'src/lib/swap/direct-pool'
import { useEvmSimpleSwapTradeParams } from './use-evm-simple-swap-trade-params'

export function useEvmSimpleSwapTrade(
  enabled = true,
): CombinedEvmTradeQueryResult {
  const params = useEvmSimpleSwapTradeParams(enabled)

  if (enabled && !params.chainId) {
    throw new Error('useEvmSimpleSwapTrade is EVM-only')
  }

  const aggregatorTrade = useEvmTrade(params)
  const directPoolTrade = useDirectPoolTrade(params)

  return combineEvmTradeQueries(
    aggregatorTrade,
    directPoolTrade,
    Boolean(params.directPool),
  )
}
