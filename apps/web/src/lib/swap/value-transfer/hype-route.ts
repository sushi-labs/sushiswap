import { EvmChainId } from 'sushi/evm'
import { VALUE_TRANSFER_PENDING_HYPE_DEPLOYMENTS } from './config'

function isHypeToken(
  chainId: number | undefined,
  tokenParam: string | undefined,
): boolean {
  // The adapter bridges native HYPE; its contract is not the user's token.
  if (chainId === EvmChainId.HYPEREVM) return tokenParam === 'NATIVE'

  if (chainId !== EvmChainId.ROBINHOOD && chainId !== EvmChainId.ARBITRUM) {
    return false
  }

  const deployment = VALUE_TRANSFER_PENDING_HYPE_DEPLOYMENTS[chainId]
  return tokenParam?.toLowerCase() === deployment.contractAddress.toLowerCase()
}

export function isValueTransferHypeRoute({
  chainId0,
  chainId1,
  token0Param,
  token1Param,
}: {
  chainId0: number | undefined
  chainId1: number | undefined
  token0Param: string | undefined
  token1Param: string | undefined
}): boolean {
  return (
    chainId0 !== chainId1 &&
    isHypeToken(chainId0, token0Param) &&
    isHypeToken(chainId1, token1Param)
  )
}
