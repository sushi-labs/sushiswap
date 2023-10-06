import 'dotenv/config'
import './lib/wagmi.js'

import { ChainId } from 'sushi/chain'
import { ChefType, createClient, Prisma, RewarderType } from '@sushiswap/database'
import { Address, fetchToken } from '@wagmi/core'
import { fetch } from '@whatwg-node/fetch'
import { performance } from 'perf_hooks'

import { filterIncentives } from './etl/incentive/index.js'
import { mergeIncentives } from './etl/incentive/load.js'
import { updatePoolsWithIncentivesTotalApr } from './etl/pool/index.js'
import { createTokens, getMissingTokens } from './etl/token/load.js'

const TEST_TOKENS = [{ name: 'Angle Merkl', symbol: 'anglaMerkl' }]
const isTestToken = (token: TokenSuccess) =>
  TEST_TOKENS.every((testToken) => testToken.name === token.token.name || testToken.symbol === token.token.symbol)

const isTokenSuccessResponse = (token: TokenSuccess | TokenError): token is TokenSuccess => token.status === 'ok'
const isTokenErrorResponse = (token: TokenSuccess | TokenError): token is TokenError => token.status === 'error'

type MerklResponse = {
  pools: {
    [poolId: string]: {
      chainId: number
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
  token: string,
  isMock: boolean,
  isLive: boolean,
}

type PriceResponse = {
  [token: string]: number
}

type TokenSuccess = {
  status: 'ok'
  chainId: number
  token: Prisma.TokenCreateManyInput
}

type TokenError = {
  status: 'error'
  chainId: number
  token: {
    id: string
  }
}

const MERKL_SUPPORTED_NETWORKS = [
  ChainId.ETHEREUM,
  ChainId.OPTIMISM,
  ChainId.BASE,
  ChainId.BSC,
  ChainId.GNOSIS,
  ChainId.POLYGON,
  ChainId.ARBITRUM,
  ChainId.CELO,
  ChainId.AVALANCHE,
]

export async function execute() {
  try {
    console.log('Preparing to load merkl farms/incentives')
    const startTime = performance.now()

    // EXTRACT
    const merkls = await extract()
    console.log('EXTRACT - Extracted merkl incentives.')
    const prices = (
      await Promise.all(
        MERKL_SUPPORTED_NETWORKS.map((chainId) =>
          fetch(`https://token-price.sushi.com/v1/${chainId}`).then((data) => data.json() as Promise<PriceResponse>)
        )
      )
    ).reduce((acc, prices) => ({ ...acc, ...prices }), {})

    // TRANSFORM
    const { incentivesToCreate, incentivesToUpdate, tokens } = await transform(merkls, prices)

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

async function extract() {
  return await fetch('https://api.angle.money/v1/merkl').then((data) => data.json() as Promise<MerklResponse>)
}

async function transform(
  merkl: MerklResponse,
  prices: PriceResponse
): Promise<{
  incentivesToCreate: Prisma.IncentiveCreateManyInput[]
  incentivesToUpdate: Prisma.IncentiveCreateManyInput[]
  tokens: Prisma.TokenCreateManyInput[]
}> {
  let incentives: Prisma.IncentiveCreateManyInput[] = []
  const tokensToCreate: Prisma.TokenCreateManyInput[] = []
  const rewardTokens: Map<string, { chainId: ChainId; address: string }> = new Map()
  if (merkl === undefined || merkl.pools === undefined) {
    return
  }

  for (const [poolAddress, pool] of Object.entries(merkl.pools)) {
    if (pool.distributionData.length > 0) {
      const rewardsByToken: Map<string, MerklDistribution[]> = new Map()
      // Group rewards by token
      for (const distributionData of pool.distributionData) {
        if (!rewardsByToken.has(distributionData.token)) {
          rewardsByToken.set(distributionData.token, [])
        }
        rewardsByToken.get(distributionData.token).push(distributionData)
      }

      for (const [token, rewards] of rewardsByToken) {
        const rewardPerDay = rewards.reduce((acc, distData) => {
          if (!distData.isLive || distData.isMock || !(MERKL_SUPPORTED_NETWORKS as number[]).includes(pool.chainId)) {
            return acc
          }
          const duration = distData.end - distData.start
          const durationInDays = duration / 86400
          const amountPerDay = distData.amount / durationInDays
          return acc + amountPerDay
        }, 0)

        const price = prices[token.toLowerCase()] ?? 0
        const rewardPerYearUSD = 365 * rewardPerDay * price
        const apr = pool.tvl ? rewardPerYearUSD / pool.tvl : 0

        const incentive = Prisma.validator<Prisma.IncentiveCreateManyInput>()({
          id: poolAddress.toLowerCase().concat(':').concat(token.toLowerCase()).concat(':').concat('merkl'),
          chainId: pool.chainId,
          chefType: ChefType.Merkl,
          apr: isNaN(apr) || apr === Infinity ? 0 : apr,
          rewardTokenId: pool.chainId.toString().concat(':').concat(token.toLowerCase()),
          rewardPerDay: rewardPerDay,
          poolId: pool.chainId.toString().concat(':').concat(poolAddress.toLowerCase()),
          pid: 0, // Does not exist for merkl
          rewarderAddress: '0x0000000000000000000000000000000000000000',
          rewarderType: RewarderType.Primary,
        })
        incentives.push(incentive)
        rewardTokens.set(`${pool.chainId}:${token.toLowerCase()}`, { chainId: pool.chainId as ChainId, address: token.toLowerCase() })
      }
    }
  }

  const missingTokens = await getMissingTokens(Array.from(rewardTokens.values()))
  if (missingTokens.length > 0) {
    const tokens = await Promise.all(missingTokens.map((token) => fetchTokenFromContract(token)))
    const validTokens = tokens.filter(isTokenSuccessResponse).map((token) => token.token)
    tokensToCreate.push(...validTokens)
    const invalidTokens = tokens.filter(isTokenErrorResponse)
    incentives = incentives.filter((incentive) =>
      invalidTokens.every((token) => token.token.id !== incentive.rewardTokenId)
    )
  } else {
    console.log('TRANSFORM - All reward tokens already exist in db.')
  }

  const { incentivesToCreate, incentivesToUpdate } = await filterIncentives(incentives)
  return { incentivesToCreate, incentivesToUpdate, tokens: tokensToCreate }
}

async function fetchTokenFromContract(token: { chainId: number; address: string }): Promise<TokenSuccess | TokenError> {
  const tokenFromContract = await fetchToken({
    chainId: token.chainId,
    address: token.address as Address,
  })
  const errorResponse: TokenError = {
    status: 'error',
    chainId: token.chainId,
    token: {
      id: token.chainId.toString().concat(':').concat(token.address.toLowerCase()),
    },
  }

  if (tokenFromContract) {
    const response: TokenSuccess = {
      status: 'ok',
      chainId: token.chainId,
      token: {
        id: token.chainId.toString().concat(':').concat(tokenFromContract.address.toLowerCase()),
        chainId: token.chainId,
        address: tokenFromContract.address.toString(),
        name: tokenFromContract.name,
        symbol: tokenFromContract.symbol,
        decimals: tokenFromContract.decimals,
      },
    }
    if (!isTestToken(response)) {
      return response
    } else {
      return errorResponse
    }
  }
  return errorResponse
}
