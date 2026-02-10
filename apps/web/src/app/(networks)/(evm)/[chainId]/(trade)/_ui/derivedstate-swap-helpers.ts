import type { SupportedChainId } from 'src/config'
import { isWNativeSupported, normalizeAddress } from 'sushi'
import {
  EvmNative,
  defaultCurrency,
  defaultQuoteCurrency,
  isEvmAddress,
  isEvmChainId,
} from 'sushi/evm'
import {
  SvmNative,
  isSvmAddress,
  isSvmChainId,
  svmDefaultCurrency,
  svmDefaultQuoteCurrency,
} from 'sushi/svm'

export function getTokenAsString<TChainId extends SupportedChainId>(
  chainId: TChainId,
  token: CurrencyFor<TChainId> | string,
) {
  if (typeof token === 'string') {
    if (isEvmAddress(token) || isSvmAddress(token)) {
      return normalizeAddress(chainId, token as AddressFor<typeof chainId>)
    }
    throw new Error(`Invalid token address: ${token}`)
  } else if (token.type === 'native') {
    return 'NATIVE' as const
  }

  return token.wrap().address as AddressFor<TChainId>
}

export function getDefaultCurrency(chainId: SupportedChainId) {
  if (isEvmChainId(chainId)) {
    return getTokenAsString(chainId, defaultCurrency[chainId])
  } else if (isSvmChainId(chainId)) {
    return getTokenAsString(chainId, svmDefaultCurrency[chainId])
  }

  throw new Error(`Unsupported chainId: ${chainId}`)
}

export function getQuoteCurrency(chainId: SupportedChainId) {
  if (isEvmChainId(chainId)) {
    return getTokenAsString(chainId, defaultQuoteCurrency[chainId])
  } else if (isSvmChainId(chainId)) {
    return getTokenAsString(chainId, svmDefaultQuoteCurrency[chainId])
  }

  throw new Error(`Unsupported chainId: ${chainId}`)
}

export function getNativeIfNativeAndWNativeSupported<
  TChainId extends SupportedChainId,
>(
  chainId: TChainId,
  token: CurrencyFor<TChainId> | undefined,
  address: string,
): CurrencyFor<TChainId> | undefined {
  if (address !== 'NATIVE') {
    return token
  }

  if (isEvmChainId(chainId)) {
    if (isWNativeSupported(chainId)) {
      return EvmNative.fromChainId(chainId) as CurrencyFor<TChainId>
    }
    return token
  }

  if (isSvmChainId(chainId)) {
    return SvmNative.fromChainId(chainId) as CurrencyFor<TChainId>
  }

  throw new Error(`Unsupported chainId: ${chainId}`)
}
