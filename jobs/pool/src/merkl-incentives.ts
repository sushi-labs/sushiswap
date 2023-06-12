import 'dotenv/config'
import './lib/wagmi.js'

import { ChainId } from '@sushiswap/chain'
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
    const merklByChain = new Map<ChainId, MerklResponse>()
    for (const chainId of MERKL_SUPPORTED_NETWORKS) {
      merklByChain.set(chainId, await extract(chainId))
    }
    console.log('EXTRACT - Extracted merkl incentives.')

    // TRANSFORM
    const { incentivesToCreate, incentivesToUpdate, tokens } = await transform(merklByChain)

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

async function transform(merklByChain: Map<ChainId, MerklResponse>): Promise<{
  incentivesToCreate: Prisma.IncentiveCreateManyInput[]
  incentivesToUpdate: Prisma.IncentiveCreateManyInput[]
  tokens: Prisma.TokenCreateManyInput[]
}> {
  let incentives: Prisma.IncentiveCreateManyInput[] = []
  const tokensToCreate: Prisma.TokenCreateManyInput[] = []
  const rewardTokens: Map<string, { chainId: ChainId; address: string }> = new Map()
  // Could be optimised to run in parallell..
  for (const [chainId, data] of merklByChain) {
    if (data === undefined || data.pools === undefined) {
      continue
    }

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
          rewardTokens.set(`${chainId}:${token.toLowerCase()}`, { chainId, address: token.toLowerCase() })
        }
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
