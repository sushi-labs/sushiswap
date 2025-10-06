import { useMemo } from 'react'
import {
  SUPPORTED_CHAIN_IDS,
  TWAP_SUPPORTED_CHAIN_IDS,
  XSWAP_SUPPORTED_CHAIN_IDS,
  getSortedChainIds,
} from 'src/config'
import { useIsCrossChain } from './useIsCrossChain'
import { useTradeMode } from './useTradeMode'

export const useNetworkOptions = () => {
  const { isCrossChain } = useIsCrossChain()
  const { tradeMode } = useTradeMode()

  const networkOptions = useMemo(() => {
    return tradeMode === 'dca' || tradeMode === 'limit'
      ? getSortedChainIds(TWAP_SUPPORTED_CHAIN_IDS)
      : tradeMode === 'fiat'
        ? getSortedChainIds(SUPPORTED_CHAIN_IDS)
        : isCrossChain
          ? getSortedChainIds(XSWAP_SUPPORTED_CHAIN_IDS)
          : getSortedChainIds(SUPPORTED_CHAIN_IDS)
  }, [isCrossChain, tradeMode])

  return {
    networkOptions,
  }
}
