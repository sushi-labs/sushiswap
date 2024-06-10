import 'dotenv/config'
import './lib/wagmi.js'

import { ChefType, Prisma, RewarderType } from '@sushiswap/database'
import { fetchToken } from '@wagmi/core'
import { fetch } from '@whatwg-node/fetch'
import { performance } from 'perf_hooks'
import { ChainId } from 'sushi/chain'

import { Address } from 'viem'
import { filterIncentives } from './etl/incentive/index.js'
import { mergeIncentives } from './etl/incentive/load.js'
import { updatePoolsWithIncentivesTotalApr } from './etl/pool/index.js'
import { createTokens, getMissingTokens } from './etl/token/load.js'
import { config } from './lib/wagmi.js'

const TEST_TOKENS = [{ name: 'Angle Merkl', symbol: 'anglaMerkl' }]
const isTestToken = (token: TokenSuccess) =>
  TEST_TOKENS.every(
    (testToken) =>
      testToken.name === token.token.name ||
      testToken.symbol === token.token.symbol,
  )

const isTokenSuccessResponse = (
  token: TokenSuccess | TokenError,
): token is TokenSuccess => token.status === 'ok'
const isTokenErrorResponse = (
  token: TokenSuccess | TokenError,
): token is TokenError => token.status === 'error'

type MerklResponse = {
  [chainId: string]: ChainData
}

type ChainData = {
  pools: {
    [poolId: string]: Pool
  }
}

type Pool = {
  amm: number
  ammAlgo: number
  ammAlgoName: string
  ammName: string
  aprs: Record<string, number> // Changed from array to Record
  chainId: number
  decimalsToken0: number
  decimalsToken1: number
  disputeLive: boolean
  distributionData: MerklDistribution[]
  endOfDisputePeriod: number
  meanAPR: number
  pool: string
  poolBalanceToken0: number
  poolBalanceToken1: number
  poolFee: number
  poolTotalLiquidity: number
  rewardsPerToken: Record<string, unknown> // Update this type based on the actual structure
  symbolToken0: string
  symbolToken1: string
  tick: number
  token0: string
  token1: string
  tvl: number
}

type MerklDistribution = {
  amount: number
  apr: number
  blacklist: string[]
  breakdown: Record<string, unknown> // Adjust the type based on the actual structure
  decimalsRewardToken: number
  endTimestamp: number
  id: string
  isBoosted: boolean
  isLive: boolean
  isMock: boolean
  isOutOfRangeIncentivized: boolean
  propFees: number
  propToken0: number
  propToken1: number
  rewardToken: string
  startTimestamp: number
  symbolRewardToken: string
  unclaimed: number
  whitelist: string[]
}

type PriceResponse = {
  [token: string]: number
}

type PriceMap = {
  [chainId: number]: PriceResponse
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
  ChainId.POLYGON_ZKEVM,
  ChainId.THUNDERCORE,
  ChainId.CORE,
  ChainId.BLAST,
  ChainId.SCROLL,
  ChainId.LINEA,
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
          fetch(`https://api.sushi.com/price/v1/${chainId}`).then(
            (data) => data.json() as Promise<PriceResponse>,
          ),
        ),
      )
    ).reduce((acc: PriceMap, prices: PriceResponse, index: number) => {
      const chainId = MERKL_SUPPORTED_NETWORKS[index]
      acc[chainId] = Object.keys(prices).reduce((result, key) => {
        result[key.toLowerCase()] = prices[key]
        return result
      }, {} as PriceResponse)
      return acc
    }, {})

    // TRANSFORM
    const { incentivesToCreate, incentivesToUpdate, tokens } = await transform(
      merkls,
      prices,
    )

    console.log(
      `TRANSFORM - ${incentivesToCreate.length} incentives to create, ${incentivesToUpdate.length} incentives to update, ${tokens.length} tokens to create.`,
    )

    // LOAD
    await createTokens(tokens)
    await mergeIncentives(incentivesToCreate, incentivesToUpdate)
    await updatePoolsWithIncentivesTotalApr()

    const endTime = performance.now()
    console.log(
      `COMPLETE - Script ran for ${((endTime - startTime) / 1000).toFixed(
        1,
      )} seconds. `,
    )
  } catch (e) {
    console.error(e)
  }
}

async function extract() {
  const response = await fetch('https://api.angle.money/v2/merkl')
  if (response.status !== 200) {
    throw new Error('Failed to fetch merkl incentives.')
  }
  return response.json() as Promise<MerklResponse>
}

async function transform(
  response: MerklResponse,
  prices: PriceMap,
): Promise<{
  incentivesToCreate: Prisma.IncentiveCreateManyInput[]
  incentivesToUpdate: Prisma.IncentiveCreateManyInput[]
  tokens: Prisma.TokenCreateManyInput[]
}> {
  let incentives: Prisma.IncentiveCreateManyInput[] = []
  const tokensToCreate: Prisma.TokenCreateManyInput[] = []
  const rewardTokens: Map<string, { chainId: ChainId; address: Address }> =
    new Map()

  const pools: { address: string; pool: Pool }[] = []

  for (const [chainId, value] of Object.entries(response)) {
    if ((MERKL_SUPPORTED_NETWORKS as number[]).includes(Number(chainId))) {
      const chainPools = Object.entries(value.pools).map(([address, pool]) => ({
        address,
        pool,
      }))
      pools.push(...chainPools)
    }
  }

  const sushiPools = pools.filter((item) => item.pool.ammName === 'SushiSwapV3')

  if (
    response === undefined ||
    sushiPools === undefined ||
    sushiPools.length === 0
  ) {
    return { incentivesToCreate: [], incentivesToUpdate: [], tokens: [] }
  }
  sushiPools.forEach(({ address, pool }) => {
    if (pool.distributionData.length > 0) {
      const rewardsByToken: Map<string, MerklDistribution[]> = new Map()
      // Group rewards by token
      for (const distributionData of pool.distributionData) {
        if (!rewardsByToken.has(distributionData.rewardToken)) {
          rewardsByToken.set(distributionData.rewardToken, [])
        }
        rewardsByToken.get(distributionData.rewardToken)!.push(distributionData)
      }

      for (const [token, rewards] of rewardsByToken) {
        const rewardPerDay = rewards.reduce((acc, distData) => {
          if (
            !distData.isLive ||
            distData.isMock ||
            !(MERKL_SUPPORTED_NETWORKS as number[]).includes(pool.chainId) ||
            distData.whitelist.length > 0
          ) {
            return acc
          }
          const duration = distData.endTimestamp - distData.startTimestamp
          const durationInDays = duration / 86400
          const amountPerDay = distData.amount / durationInDays
          return acc + amountPerDay
        }, 0)

        const price = prices[pool.chainId][token.toLowerCase()] ?? 0
        const rewardPerYearUSD = 365 * rewardPerDay * price
        const apr = pool.tvl ? rewardPerYearUSD / pool.tvl : 0

        const incentive = Prisma.validator<Prisma.IncentiveCreateManyInput>()({
          id: address
            .toLowerCase()
            .concat(':')
            .concat(token.toLowerCase())
            .concat(':')
            .concat('merkl'),
          chainId: pool.chainId,
          chefType: ChefType.Merkl,
          apr: Number.isNaN(apr) || apr === Infinity ? 0 : apr,
          rewardTokenId: pool.chainId
            .toString()
            .concat(':')
            .concat(token.toLowerCase()),
          rewardPerDay: rewardPerDay,
          poolId: pool.chainId
            .toString()
            .concat(':')
            .concat(address.toLowerCase()),
          pid: 0, // Does not exist for merkl
          rewarderAddress: '0x0000000000000000000000000000000000000000',
          rewarderType: RewarderType.Primary,
        })
        incentives.push(incentive)
        rewardTokens.set(`${pool.chainId}:${token.toLowerCase()}`, {
          chainId: pool.chainId as ChainId,
          address: token.toLowerCase() as Address,
        })
      }
    }
  })

  const missingTokens = await getMissingTokens(
    Array.from(rewardTokens.values()),
  )
  if (missingTokens.length > 0) {
    const tokens = await Promise.all(
      missingTokens.map((token) => fetchTokenFromContract(token)),
    )
    const validTokens = tokens
      .filter(isTokenSuccessResponse)
      .map((token) => token.token)
    tokensToCreate.push(...validTokens)
    const invalidTokens = tokens.filter(isTokenErrorResponse)
    incentives = incentives.filter((incentive) =>
      invalidTokens.every(
        (token) => token.token.id !== incentive.rewardTokenId,
      ),
    )
  } else {
    console.log('TRANSFORM - All reward tokens already exist in db.')
  }

  const { incentivesToCreate, incentivesToUpdate } =
    await filterIncentives(incentives)
  return { incentivesToCreate, incentivesToUpdate, tokens: tokensToCreate }
}

async function fetchTokenFromContract(token: {
  chainId: ChainId
  address: Address
}): Promise<TokenSuccess | TokenError> {
  try {
    const tokenFromContract = await fetchToken(config, {
      chainId: token.chainId,
      address: token.address,
    })
    const errorResponse: TokenError = {
      status: 'error',
      chainId: token.chainId,
      token: {
        id: token.chainId
          .toString()
          .concat(':')
          .concat(token.address.toLowerCase()),
      },
    }

    if (tokenFromContract?.decimals) {
      const response: TokenSuccess = {
        status: 'ok',
        chainId: token.chainId,
        token: {
          id: token.chainId
            .toString()
            .concat(':')
            .concat(tokenFromContract.address.toLowerCase()),
          chainId: token.chainId,
          address: tokenFromContract.address.toString(),
          name: tokenFromContract.name!,
          symbol: tokenFromContract.symbol!,
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
  } catch (e: any) {
    const id = token.chainId
      .toString()
      .concat(':')
      .concat(token.address.toLowerCase())
    console.error(`Error fetching token ${id}, error: ${e.message}`)
    return {
      status: 'error',
      chainId: token.chainId,
      token: {
        id,
      },
    } as TokenError
  }
}
