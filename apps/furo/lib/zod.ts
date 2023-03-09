import { isAddress } from '@ethersproject/address'
import { Native, Token, tryParseAmount } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { useMemo } from 'react'
import { z } from 'zod'

export const ZToken = z.object({
  chainId: z.number(),
  address: z.string().optional(),
  symbol: z.string().optional(),
  name: z.string().optional(),
  decimals: z.number(),
  isNative: z.boolean(),
})

export const ZAddress = z.string().refine((val) => (val ? isAddress(val) : false), 'Invalid address')

export const ZAmount = z
  .object({
    token: ZToken,
    amount: z.string(),
  })
  .partial()

export const ZFundSource = z.string()

export const ZAmountToAmount = ZAmount.optional().transform((input) => {
  return tryParseAmount(input?.amount, ZTokenToToken.parse(input?.token))
})

export const ZTokenToToken = ZToken.transform(({ address, decimals, chainId, symbol, name, isNative }) => {
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
})

export const ZFundSourceToFundSource = ZFundSource.optional().transform((fundSource) => {
  if (fundSource) {
    return FundSource[fundSource as FundSource]
  }

  return undefined
})

export const useFundSourceFromZFundSource = (fundSource?: z.infer<typeof ZFundSource>) => {
  return useMemo(() => {
    return ZFundSourceToFundSource.parse(fundSource)
  }, [fundSource])
}

export const useAmountFromZAmount = (amount?: z.infer<typeof ZAmount>) => {
  return useMemo(() => {
    if (amount?.token && amount?.amount) {
      return ZAmountToAmount.parse(amount)
    }

    return undefined
  }, [amount])
}

export const useTokenFromZAmount = (amount?: z.infer<typeof ZAmount>) => {
  return useMemo(() => {
    if (amount?.token) return ZTokenToToken.parse(amount.token)

    return undefined
  }, [amount?.token])
}

export const useTokenFromZToken = (token?: z.infer<typeof ZToken>) => {
  return useMemo(() => {
    if (token) return ZTokenToToken.parse(token)

    return undefined
  }, [token])
}

export const useTokensFromZAmounts = (amounts: (z.infer<typeof ZAmount> | undefined)[]) => {
  return useMemo(() => {
    return amounts.map((amount) => {
      if (amount?.token) return ZTokenToToken.parse(amount.token)

      return undefined
    })
  }, [amounts])
}

export const useTokensFromZTokens = (tokens: (z.infer<typeof ZToken> | undefined)[]) => {
  return useMemo(() => {
    return tokens.map((token) => {
      if (token) {
        return ZTokenToToken.parse(token)
      }

      return undefined
    })
  }, [tokens])
}

export const useAmountsFromZAmounts = (amounts: (z.infer<typeof ZAmount> | undefined)[]) => {
  return useMemo(() => {
    return amounts.map((amount) => {
      if (amount?.token) return ZAmountToAmount.parse(amount)

      return undefined
    })
  }, [amounts])
}
