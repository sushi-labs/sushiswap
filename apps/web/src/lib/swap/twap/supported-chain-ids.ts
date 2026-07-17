import { EvmChainId } from 'sushi/evm'

export const TWAP_SUPPORTED_CHAIN_IDS = [
  EvmChainId.ETHEREUM,
  EvmChainId.BASE,
  EvmChainId.ARBITRUM,
  EvmChainId.KATANA,
] as const

export function isTwapSupportedChainId(
  chainId: number,
): chainId is (typeof TWAP_SUPPORTED_CHAIN_IDS)[number] {
  return TWAP_SUPPORTED_CHAIN_IDS.some(
    (supportedChainId) => supportedChainId === chainId,
  )
}
