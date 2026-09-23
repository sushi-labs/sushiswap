import type { PortfolioWalletToken } from '@sushiswap/graph-client/data-api'
import type { ChainId } from 'sushi'
import {
  type EvmAddress,
  EvmChainId,
  SUSHI,
  USDC,
  evmNativeAddress,
} from 'sushi/evm'

const nativeAddressAliases: Partial<Record<ChainId, EvmAddress>> = {
  [EvmChainId.CELO]: '0x471ece3750da237f93b8e339c536989b8978a438',
  [EvmChainId.MANTLE]: '0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000',
  [EvmChainId.POLYGON]: '0x0000000000000000000000000000000000001010',
}

function hasSushiToken(chainId: ChainId): chainId is keyof typeof SUSHI {
  return Object.hasOwn(SUSHI, chainId)
}

export function getTokenParams(
  token: Pick<PortfolioWalletToken, 'chainId' | 'address'>,
  isNative: boolean,
): string {
  if (
    hasSushiToken(token.chainId) &&
    token.address.toLowerCase() === SUSHI[token.chainId].address.toLowerCase()
  ) {
    return new URLSearchParams({
      token1: SUSHI[token.chainId].address,
    }).toString()
  }

  let token0: typeof token.address | 'NATIVE' = token.address

  if (
    token.chainId === EvmChainId.ARC &&
    token.address.toLowerCase() === evmNativeAddress.toLowerCase()
  ) {
    token0 = USDC[token.chainId].address
  } else if (
    isNative ||
    token.address.toLowerCase() === nativeAddressAliases[token.chainId]
  ) {
    token0 = 'NATIVE'
  }

  return new URLSearchParams({ token0 }).toString()
}
