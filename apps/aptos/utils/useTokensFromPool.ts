import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Pool } from './usePools'
import { Token } from './tokenType'
import { useTokens } from './useTokens'
import { useCustomTokens } from './useCustomTokens'

export function useTokensFromPools(row: Pool) {
  const [chainId] = row?.id?.split(':')
  const { data: tokens } = useTokens(Number(chainId))
  const address0 = row?.data?.token_x_details?.token_address
  const address1 = row?.data?.token_y_details?.token_address
  let token0: Token
  if (tokens?.[address0]) {
    token0 = tokens?.[address0]
  } else {
    token0 = {
      address: row?.data?.token_x_details?.token_address,
      chainId: Number(chainId),
      decimals: row?.data?.token_x_details?.decimals,
      name: row?.data?.token_x_details?.name,
      symbol: row?.data?.token_x_details?.symbol,
    }
  }
  let token1: Token
  if (tokens?.[address1]) {
    token1 = tokens?.[address1]
  } else {
    token1 = {
      address: row?.data?.token_y_details?.token_address,
      chainId: Number(chainId),
      decimals: row?.data?.token_y_details?.decimals,
      name: row?.data?.token_y_details?.name,
      symbol: row?.data?.token_y_details?.symbol,
    }
  }
  return { token0, token1 }
}
