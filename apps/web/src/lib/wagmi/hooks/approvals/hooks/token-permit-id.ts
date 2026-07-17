import type { EvmAddress, EvmChainId } from 'sushi/evm'

export function getTokenPermitId(
  tag: string,
  chainId: EvmChainId | undefined,
  tokenAddress: EvmAddress | undefined,
): string {
  return `${tag}:${chainId ?? 'unknown'}:${tokenAddress?.toLowerCase() ?? 'unknown'}`
}

export function isTokenPermitChainValid({
  activeChainId,
  signatureChainId,
  targetChainId,
}: {
  activeChainId: number | undefined
  signatureChainId: number | bigint | undefined
  targetChainId: EvmChainId | undefined
}): boolean {
  return Boolean(
    targetChainId &&
      activeChainId === targetChainId &&
      signatureChainId !== undefined &&
      Number(signatureChainId) === targetChainId,
  )
}
