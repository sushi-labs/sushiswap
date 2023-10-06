import { isAddress } from '@ethersproject/address'
import { Native, Token } from 'sushi/currency'
import { FuroChainId } from '@sushiswap/furo-sdk'
import { FundSource } from '@sushiswap/hooks'
import { useMemo } from 'react'
import { Address } from 'viem'
import { z } from 'zod'

import { isSupportedChainId } from '../config'

export const ZToken = z.object({
  chainId: z.number(),
  address: z.string().optional(),
  symbol: z.string().optional(),
  name: z.string().optional(),
  decimals: z.number(),
  isNative: z.boolean(),
})

export const ZAddress = z
  .string()
  .refine((val) => (val ? isAddress(val) : false), 'Invalid address')
  .transform((val) => val as Address)

export const ZFundSource = z.string()

export const ZTokenToToken = ZToken.transform(
  ({ address, decimals, chainId, symbol, name, isNative }) => {
    if (isNative && address === undefined) {
      return Native.onChain(chainId)
    }

    return new Token({
      address: address as string,
      decimals,
      chainId,
      symbol,
      name,
    })
  },
)

export const ZFundSourceToFundSource = ZFundSource.optional().transform(
  (fundSource) => {
    if (fundSource) {
      return FundSource[fundSource as FundSource]
    }

    return undefined
  },
)

export const useFundSourceFromZFundSource = (
  fundSource?: z.infer<typeof ZFundSource>,
) => {
  return useMemo(() => {
    return ZFundSourceToFundSource.parse(fundSource)
  }, [fundSource])
}

export const useTokenFromZToken = (token?: z.infer<typeof ZToken>) => {
  return useMemo(() => {
    if (token) return ZTokenToToken.parse(token)

    return undefined
  }, [token])
}

export const useTokensFromZTokens = (
  tokens: (z.infer<typeof ZToken> | undefined)[],
) => {
  return useMemo(() => {
    return tokens.map((token) => {
      if (token) {
        return ZTokenToToken.parse(token)
      }

      return undefined
    })
  }, [tokens])
}

export const queryParamsSchema = z.object({
  id: z
    .string()
    .refine((val) => val.includes(':'), {
      message: 'TokenId not in the right format',
    })
    .transform((val) => {
      const [chainId, poolId] = val.split(':')
      return [+chainId, poolId] as [FuroChainId, string]
    })
    .refine(([chainId]) => isSupportedChainId(chainId), {
      message: 'ChainId not supported.',
    })
    .refine(([, streamId]) => typeof +streamId === 'number', {
      message: 'StreamId not supported.',
    }),
})
