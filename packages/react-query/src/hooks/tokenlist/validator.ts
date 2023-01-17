import z from 'zod'

export const tokenValidator = z.object({
  address: z.string(),
  chainId: z.number(),
  decimals: z.number(),
  logoURI: z.string().optional(),
  name: z.string(),
  symbol: z.string(),
})

export const tokenListValidator = z.object({
  name: z.string(),
  timestamp: z.string(),
  version: z.object({
    major: z.number(),
    minor: z.number(),
    patch: z.number(),
  }),
  tags: z.object({}),
  logoURI: z.string(),
  keyword: z.array(z.string()).optional(),
  tokens: z.array(tokenValidator),
})
