import { getAddress, isAddress } from 'viem'
import z from 'zod'

export const tokenValidator = z.object({
  id: z.string(),
  address: z.string(),
  chainId: z.number(),
  decimals: z.number(),
  name: z.string(),
  symbol: z.string(),
})

export const tokenListValidator = z.array(tokenValidator)

export const otherTokenListValidator = z.object({
  tokens: z.array(
    z.object({
      address: z
        .string()
        .transform((address) =>
          isAddress(address) && address === address.toLowerCase()
            ? getAddress(address)
            : address,
        ),
      chainId: z.number(),
      decimals: z.number(),
      name: z.string(),
      symbol: z.string(),
    }),
  ),
})
