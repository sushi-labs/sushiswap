import { sz } from 'sushi'
import { type MerklChainId, isEvmChainId } from 'sushi/evm'
import z from 'zod'

const merklRewardsTokenValidator = z.object({
  address: sz.evm.address(),
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
      recipient: sz.evm.address(),
      amount: z.string().transform((value) => BigInt(value)),
      claimed: z.string().transform((value) => BigInt(value)),
      pending: z.string().transform((value) => BigInt(value)),
      proofs: z.array(sz.hex()),
      token: z.object({
        address: sz.evm.address(),
        chainId: z.number().refine(isEvmChainId),
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
  computeChainId: z.number().refine(isEvmChainId),
  distributionChainId: z.number().refine(isEvmChainId),
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
    chainId: z.number().refine(isEvmChainId),
    symbol: z.string(),
    decimals: z.number(),
    name: z.string(),
  }),
})

export const merklCampaignsValidator = z.array(merklCampaignValidator)
