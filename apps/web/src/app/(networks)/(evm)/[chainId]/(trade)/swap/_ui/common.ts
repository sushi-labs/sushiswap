'use client'

import type { SupportedChainId } from 'src/config'
import { EvmNative, isEvmChainId } from 'sushi/evm'
import { SvmNative, isSvmChainId } from 'sushi/svm'

export function isWrapTrade<TCurrency extends CurrencyFor<SupportedChainId>>(
  token0: TCurrency | undefined,
  token1: TCurrency | undefined,
) {
  if (!token0 || !token1) return false
  if (token0.type !== 'native') return false

  if (isEvmChainId(token0.chainId)) {
    return (
      token1.wrap().address ===
      EvmNative.fromChainId(token0.chainId).wrap().address
    )
  }

  if (isSvmChainId(token0.chainId)) {
    return (
      token1.wrap().address ===
      SvmNative.fromChainId(token0.chainId).wrap().address
    )
  }

  return false
}

export function isUnwrapTrade<TCurrency extends CurrencyFor<SupportedChainId>>(
  token0: TCurrency | undefined,
  token1: TCurrency | undefined,
) {
  if (!token0 || !token1) return false
  if (token1.type !== 'native') return false

  if (isEvmChainId(token0.chainId)) {
    return (
      token0.wrap().address ===
      EvmNative.fromChainId(token0.chainId).wrap().address
    )
  }

  if (isSvmChainId(token0.chainId)) {
    return (
      token0.wrap().address ===
      SvmNative.fromChainId(token0.chainId).wrap().address
    )
  }

  return false
}
