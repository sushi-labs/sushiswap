import 'dotenv/config'
import './lib/wagmi.js'

import { ChainId } from '@sushiswap/chain'
import { ChefType, createClient, Prisma, RewarderType } from '@sushiswap/database'
import { fetch } from '@whatwg-node/fetch'
import { performance } from 'perf_hooks'

import { filterIncentives } from './etl/incentive/index.js'
import { mergeIncentives } from './etl/incentive/load.js'
import { updatePoolsWithIncentivesTotalApr } from './etl/pool/index.js'
import { createTokens } from './etl/token/load.js'

type MerklResponse = {
  pools: {
    [poolId: string]: {
      aprs: {
        [incentiveName: string]: number
      }[]
      distributionData: MerklDistribution[]
      tvl: number
    }
  }
}

type MerklDistribution = {
  amount: number
  start: number
  end: number
  token: string
}

type PriceResponse = {
  [token: string]: number
}

export async function execute() {
  try {
    console.log('Preparing to load farms/incentives')
    const startTime = performance.now()

    // EXTRACT
    const chainId = ChainId.POLYGON // FIXME: hardcoded for now, refactor later to run for all chains
    const incentives = await extract(chainId)

    console.log('EXTRACT - Extracted incentives.')

    // TRANSFORM
    const { incentivesToCreate, incentivesToUpdate, tokens } = await transform(chainId, incentives)

    // LOAD
    await createTokens(tokens)
    await mergeIncentives(incentivesToCreate, incentivesToUpdate)
    await updatePoolsWithIncentivesTotalApr()

    const endTime = performance.now()
    console.log(`COMPLETE - Script ran for ${((endTime - startTime) / 1000).toFixed(1)} seconds. `)
  } catch (e) {
    console.error(e)
    await (await createClient()).$disconnect()
  } finally {
    await (await createClient()).$disconnect()
  }
}

async function extract(chainId: ChainId) {
  return await fetch(`https://api.angle.money/v1/merkl?chainId=${chainId}`).then(
    (data) => data.json() as Promise<MerklResponse>
  )
}

async function transform(
  chainId: ChainId,
  data: MerklResponse
): Promise<{
  incentivesToCreate: Prisma.IncentiveCreateManyInput[]
  incentivesToUpdate: Prisma.IncentiveCreateManyInput[]
  tokens: Prisma.TokenCreateManyInput[]
}> {
  const incentives: Prisma.IncentiveCreateManyInput[] = []
  const prices = await fetch(`https://token-price.sushi.com/v1/${chainId}`).then(
    (data) => data.json() as Promise<PriceResponse>
  )

  for (const [poolAddress, pool] of Object.entries(data.pools)) {
    if (pool.distributionData.length > 0) {
      const rewardsByToken: Map<string, MerklDistribution[]> = new Map()
      // Group rewards by token
      for (const { amount, start, end, token } of pool.distributionData) {
        if (!rewardsByToken.has(token)) {
          rewardsByToken.set(token, [])
        }
        rewardsByToken.get(token).push({ amount, start, end, token })
      }

      const now = Date.now() / 1000
      // Calculate APR for each token
      for (const [token, rewards] of rewardsByToken) {
        const rewardPerDay = rewards.reduce((acc, { amount, start, end }) => {
          if (now >= end || now < start) {
            return acc // Not started or has ended
          }
          const duration = end - start
          const durationInDays = duration / 86400
          const amountPerDay = amount / durationInDays
          return acc + amountPerDay
        }, 0)

        const price = prices[token.toLowerCase()] ?? 0
        const rewardPerYearUSD = 365 * rewardPerDay * price
        const apr = pool.tvl ? rewardPerYearUSD / pool.tvl : 0

        const incentive = Prisma.validator<Prisma.IncentiveCreateManyInput>()({
          id: poolAddress.toLowerCase().concat(':').concat(token.toLowerCase()).concat(':').concat('merkl'),
          chainId: chainId,
          chefType: ChefType.Merkl,
          apr: isNaN(apr) || apr === Infinity ? 0 : apr,
          rewardTokenId: chainId.toString().concat(':').concat(token.toLowerCase()),
          rewardPerDay: rewardPerDay,
          poolId: chainId.toString().concat(':').concat(poolAddress.toLowerCase()),
          pid: 0, // Does not exist for merkl
          rewarderAddress: '0x0000000000000000000000000000000000000000',
          rewarderType: RewarderType.Primary,
        })
        incentives.push(incentive)
      }
    }
  }

  const { incentivesToCreate, incentivesToUpdate } = await filterIncentives(incentives)
  // TODO: not creating any new tokens for now, would have to do web3 calls to get the full token info as merkl doesn't provide full info
  return { incentivesToCreate, incentivesToUpdate, tokens: [] } 
}
