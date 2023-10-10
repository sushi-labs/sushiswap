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
      address: z.string(),
      chainId: z.number(),
      decimals: z.number(),
      name: z.string(),
      symbol: z.string(),
    }),
  ),
})
