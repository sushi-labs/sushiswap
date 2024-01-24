import { ChainId } from 'sushi/chain'
import {
  ExtractorSupportedChainId,
  isExtractorSupportedChainId,
} from 'sushi/config'
import { STABLES } from 'sushi/currency'
import { getAddress } from 'viem'
import z from 'zod'

export const Currency = {
  USD: 'USD',
  NATIVE: 'NATIVE',
  ETHEREUM: 'ETHEREUM',
  BITCOIN: 'BITCOIN',
} as const

export type Currency = typeof Currency[keyof typeof Currency]

export const allPricesSchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256)
    .default(ChainId.ETHEREUM)
    .refine(
      (chainId) =>
        isExtractorSupportedChainId(chainId) && STABLES[chainId] !== undefined,
      {
        message: 'ChainId not supported.',
      },
    )
    .transform((chainId) => chainId as ExtractorSupportedChainId),
  currency: z.nativeEnum(Currency).default(Currency.USD),
})

export const singleAddressSchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256)
    .default(ChainId.ETHEREUM)
    .refine(
      (chainId) =>
        isExtractorSupportedChainId(chainId) && STABLES[chainId] !== undefined,
      {
        message: 'ChainId not supported.',
      },
    )
    .transform((chainId) => chainId as ExtractorSupportedChainId),
  address: z.coerce.string().transform((address) => getAddress(address)),
  currency: z.nativeEnum(Currency).default(Currency.USD),
})
