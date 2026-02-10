import { sz } from 'sushi'
import { type MerklChainId, isMerklChainId } from 'sushi/evm'
import * as z from 'zod'

const merklRewardsTokenValidator = z.object({
  address: sz.evm.address(),
  decimals: z.number().optional(),
  symbol: z.string().optional(),
  minimumAmountPerHour: z.string().transform((amount) => BigInt(amount)),
  isTest: z.boolean().optional(),
})

const merklChainIdValidator = z
  .number()
  .refine((chainId) => isMerklChainId(chainId))
  .transform((chainId) => chainId as MerklChainId)

export const merklRewardsTokensValidator = z.array(merklRewardsTokenValidator)

const merklRewardValidator = z.object({
  chain: z.object({
    id: merklChainIdValidator,
  }),
  rewards: z.array(
    z.object({
      root: sz.hex(),
      recipient: sz.evm.address(),
      amount: z.string().transform((value) => BigInt(value)),
      claimed: z.string().transform((value) => BigInt(value)),
      pending: z.string().transform((value) => BigInt(value)),
      proofs: z.array(sz.hex()),
      token: z.object({
        address: sz.evm.address(),
        chainId: merklChainIdValidator,
        symbol: z.string(),
        decimals: z.number(),
        price: z.coerce.number().optional(),
      }),
    }),
  ),
})

export const merklRewardsValidator = z.array(merklRewardValidator)

const merklCampaignValidator = z.object({
  id: z.string(),
  computeChainId: merklChainIdValidator,
  distributionChainId: merklChainIdValidator,
  campaignId: z.string(),
  amount: z.string(),
  startTimestamp: z.coerce.number(),
  endTimestamp: z.coerce.number(),
  params: z.object({
    blacklist: z.array(z.string()),
    whitelist: z.array(z.string()),
    isOutOfRangeIncentivized: z.boolean(),
  }),
  rewardToken: z.object({
    address: sz.evm.address(),
    chainId: merklChainIdValidator,
    symbol: z.string(),
    decimals: z.number(),
    name: z.string(),
  }),
})

export const merklCampaignsValidator = z.array(merklCampaignValidator)
