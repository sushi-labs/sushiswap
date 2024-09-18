import { ChainId } from 'sushi/chain'
import { getAddress, isAddress } from 'viem'
import { z } from 'zod'

const ZpdAddress = z
  .string()
  .refine((val) => (val ? isAddress(val) : false), 'Invalid address')

export const ApplyForTokenListTokenSchema = z.object({
  tokenAddress: ZpdAddress.transform(
    (tokenAddress) => getAddress(tokenAddress),
  ),
  chainId: z.coerce
    .number()
    .transform((chainId) => chainId as ChainId)
    .default(ChainId.ETHEREUM),
  logoFile: z.string(),
})

export type ApplyForTokenListTokenSchemaType = z.infer<
  typeof ApplyForTokenListTokenSchema
>
