export interface StaticChainParam {
  chainId: string
}

export function getStaticChainParams(
  chainIds: readonly number[],
): StaticChainParam[] {
  return chainIds.map((chainId) => ({
    chainId: chainId.toString(),
  }))
}
