import { PoolExtended } from 'lib/pool/hooks/use-pools-extended'
import { useMemo } from 'react'
import { Token } from '../tokenType'
import { Pool } from './usePools'
import { useTokens } from './useTokens'

export function useTokensFromPool(row: Pool) {
  let token0: Token = {} as Token
  let token1: Token = {} as Token

  const { data: tokens } = useTokens()
  const address0 = row?.data?.token_x_details?.address
  const address1 = row?.data?.token_y_details?.address
  if (tokens?.[address0]) {
    token0 = tokens?.[address0]
  } else {
    token0 = {
      address: row?.data?.token_x_details?.address,
      decimals: row?.data?.token_x_details?.decimals,
      name: row?.data?.token_x_details?.name,
      symbol: row?.data?.token_x_details?.symbol,
    }
  }
  if (tokens?.[address1]) {
    token1 = tokens?.[address1]
  } else {
    token1 = {
      address: row?.data?.token_y_details?.address,
      decimals: row?.data?.token_y_details?.decimals,
      name: row?.data?.token_y_details?.name,
      symbol: row?.data?.token_y_details?.symbol,
    }
  }

  return useMemo(() => {
    return { token0, token1 }
  }, [token0, token1])
}

export function useTokensFromExtendedPool(row: PoolExtended) {
  let token0: Token = {} as Token
  let token1: Token = {} as Token

  const { data: tokens } = useTokens()
  if (tokens?.[row.token0.address]) {
    token0 = tokens?.[row.token0.address]
  } else {
    token0 = row.token0
  }
  if (tokens?.[row.token1.address]) {
    token1 = tokens?.[row.token1.address]
  } else {
    token1 = row.token1
  }

  return useMemo(() => {
    return { token0, token1 }
  }, [token0, token1])
}
