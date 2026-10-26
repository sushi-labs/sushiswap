import {
  type EvmChainId,
  type EvmCurrency,
  EvmNative,
  EvmToken,
  type SerializedEvmToken,
  evmNativeAddress,
} from 'sushi/evm'
import type { Address } from 'viem'

/**
 * A pool token as the pool queries serialize it. V4 pools can hold the native
 * currency directly, which the API reports under `evmNativeAddress`.
 */
export type RawPoolToken<TChainId extends EvmChainId = EvmChainId> = Omit<
  SerializedEvmToken,
  'type' | 'metadata' | 'chainId'
> & { chainId: TChainId }

export function toRawPoolToken<TChainId extends EvmChainId>(
  token: { address: string; name: string; symbol: string; decimals: number },
  chainId: TChainId,
): RawPoolToken<TChainId> {
  return {
    address: token.address as Address,
    chainId,
    decimals: token.decimals,
    name: token.name,
    symbol: token.symbol,
  }
}

export function hydratePoolCurrency(token: RawPoolToken): EvmCurrency {
  return token.address.toLowerCase() === evmNativeAddress
    ? EvmNative.fromChainId(token.chainId)
    : new EvmToken(token)
}
