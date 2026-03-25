import { useParams } from 'next/navigation'
import { useMemo } from 'react'
import { EvmChainId } from 'sushi/evm'

export const useTwapMinTradeSize = () => {
  const { chainId: _chainId } = useParams()
  const chainId = _chainId ? +_chainId : undefined

  return useMemo(() => {
    switch (chainId) {
      case EvmChainId.ETHEREUM:
        return 5
      case EvmChainId.ARBITRUM:
        return 5
      case EvmChainId.BASE:
        return 5
      case EvmChainId.KATANA:
        return 5
      default:
        return 5
    }
  }, [chainId])
}
