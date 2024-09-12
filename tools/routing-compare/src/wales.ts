import { ChainId } from 'sushi'
import { WNATIVE } from 'sushi/currency'
import { Address } from 'viem'

export const whales: Record<number, Address> = {
  [ChainId.ETHEREUM]: '0x00000000219ab540356cBB839Cbe05303d7705Fa', // Beacon deposit
  [ChainId.FANTOM]: '0xFC00FACE00000000000000000000000000000000',
}

export function getNativeWhale(chainId: ChainId): Address | undefined {
  return whales[chainId] ?? WNATIVE[chainId as keyof typeof WNATIVE].address
}
