import type { EvmChainId } from 'sushi/chain'
import type { MerklChainId } from 'sushi/config'
import { sz } from 'sushi/validate'
import z from 'zod'

const merklRewardsTokenValidator = z.object({
  address: sz.address(),
  decimals: z.number().optional(),
  symbol: z.string().optional(),
  minimumAmountPerHour: z.string().transform((amount) => BigInt(amount)),
  isTest: z.boolean().optional(),
})

export const merklRewardsTokensValidator = z.array(merklRewardsTokenValidator)

const merklRewardValidator = z.object({
  chain: z.object({
    id: z.number().transform((chainId) => chainId as MerklChainId),
  }),
  rewards: z.array(
    z.object({
      root: sz.hex(),
      recipient: sz.address(),
      amount: z.string().transform((value) => BigInt(value)),
      claimed: z.string().transform((value) => BigInt(value)),
      pending: z.string().transform((value) => BigInt(value)),
      proofs: z.array(sz.hex()),
      token: z.object({
        address: z.string(),
        chainId: z.number().transform((chainId) => chainId as EvmChainId),
        symbol: z.string(),
        decimals: z.number(),
      }),
    }),
  ),
})

export const merklRewardsValidator = z.array(merklRewardValidator)

const merklCampaignValidator = z.object({
  id: z.string(),
  computeChainId: z.number().transform((chainId) => chainId as EvmChainId),
  distributionChainId: z.number().transform((chainId) => chainId as EvmChainId),
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
    address: z.string(),
    chainId: z.number().transform((chainId) => chainId as EvmChainId),
    symbol: z.string(),
    decimals: z.number(),
  }),
})

export const merklCampaignsValidator = z.array(merklCampaignValidator)
