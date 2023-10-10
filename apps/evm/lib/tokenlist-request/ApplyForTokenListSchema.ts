import { ChainId } from 'sushi/chain'
import { getAddress, isAddress } from 'viem'
import { z } from 'zod'

export enum ApplyForTokenListListType {
  DEFAULT = 'default-token-list',
  COMMUNITY = 'community-token-list',
}

const ZpdAddress = z
  .string()
  .refine((val) => (val ? isAddress(val) : false), 'Invalid address')

export const ApplyForTokenListTokenSchema = z.object({
  tokenAddress: ZpdAddress.transform(
    (tokenAddress) => getAddress(tokenAddress) as string,
  ),
  chainId: z.coerce
    .number()
    .transform((chainId) => chainId as ChainId)
    .default(ChainId.ETHEREUM),
  listType: z
    .enum([
      ApplyForTokenListListType.DEFAULT,
      ApplyForTokenListListType.COMMUNITY,
    ])
    .default(ApplyForTokenListListType.DEFAULT),
  logoFile: z.string(),
})

export type ApplyForTokenListTokenSchemaType = z.infer<
  typeof ApplyForTokenListTokenSchema
>
