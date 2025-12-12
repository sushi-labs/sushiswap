'use client'

import { useMemo } from 'react'
import { getChainIdAddressFromId } from 'sushi'
import {
  type EvmAddress,
  type EvmChainId,
  type EvmID,
  EvmNative,
  EvmToken,
  type PoolId,
  isEvmAddress,
} from 'sushi/evm'

export function getLiquidityTokenFromPool(pool: PoolId) {
  return new EvmToken({
    address: pool.address,
    name: 'SLP Token',
    decimals: 18,
    symbol: 'SLP',
    chainId: pool.chainId,
  })
}

export const getTokensFromPool = (pool: {
  id: EvmID | EvmAddress
  token0: {
    address: EvmAddress
    name: string
    decimals: number
    symbol: string
  }
  token1: {
    address: EvmAddress
    name: string
    decimals: number
    symbol: string
  }
  chainId: EvmChainId
}) => {
  const _token0 = new EvmToken({
    address: pool.token0.address,
    name: pool.token0.name,
    decimals: Number(pool.token0.decimals),
    symbol: pool.token0.symbol,
    chainId: pool.chainId,
  })

  const _token1 = new EvmToken({
    address: pool.token1.address,
    name: pool.token1.name,
    decimals: Number(pool.token1.decimals),
    symbol: pool.token1.symbol,
    chainId: pool.chainId,
  })

  const [token0, token1, liquidityToken] = [
    _token0.wrap().address ===
    EvmNative.fromChainId(_token0.chainId).wrap().address
      ? EvmNative.fromChainId(_token0.chainId)
      : _token0,
    _token1.wrap().address ===
    EvmNative.fromChainId(_token1.chainId).wrap().address
      ? EvmNative.fromChainId(_token1.chainId)
      : _token1,
    new EvmToken({
      address: pool.id.includes(':')
        ? getChainIdAddressFromId(pool.id as EvmID).address
        : (pool.id as EvmAddress),
      name: 'SLP Token',
      decimals: 18,
      symbol: 'SLP',
      chainId: pool.chainId,
    }),
  ]

  return {
    token0,
    token1,
    liquidityToken,
  }
}

export const useTokensFromPool = (pool: {
  id: EvmID | EvmAddress
  token0: {
    address: EvmAddress
    name: string
    decimals: number
    symbol: string
  }
  token1: {
    address: EvmAddress
    name: string
    decimals: number
    symbol: string
  }
  chainId: EvmChainId
}) => {
  return useMemo(() => {
    return getTokensFromPool(pool)
  }, [pool])
}
