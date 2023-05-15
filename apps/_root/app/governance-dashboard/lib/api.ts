import { ChainId } from '@sushiswap/chain'
import { SUSHI_ADDRESS } from '@sushiswap/currency'
import { gql, request } from 'graphql-request'

import { DATE_FILTERS, GOV_STATUS } from './constants'

import type { Address } from 'wagmi'
import { endOfPreviousQuarter } from './helpers'

async function fetchUrl<T>(urlPath: string, options?: RequestInit) {
  const url = new URL(urlPath)

  return fetch(url, options).then((res) => {
    if (!res.ok) {
      console.error('Error while fetching ' + url.hostname)
      return
    }
    return res.json() as T
  })
}

export async function getSushiPriceUSD() {
  const prices = await fetchUrl<{ [key: string]: number }>('https://token-price.sushi.com/v0/1')

  return prices?.[SUSHI_ADDRESS[ChainId.ETHEREUM].toLowerCase()] ?? 0
}

async function getBlockNumberFromTimestamp(timestamp: number) {
  const ETH_BLOCKS_GRAPH_URL = 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks'
  const query = gql`
    query Blocks($timestamp: BigInt) {
      blocks(where: { timestamp_gte: $timestamp }, first: 1, orderBy: timestamp, orderDirection: asc) {
        number
      }
    }
  `

  const res = await request<{ blocks: { number: string }[] }>(ETH_BLOCKS_GRAPH_URL, query, { timestamp })
  return +res.blocks[0].number
}

/* ===== Discourse (forum) & Snapshot ===== */
export interface GovernanceItem {
  type: {
    id: string
    title: string
    color: string
  }
  title: string
  isActive: boolean
  url: string
  category: string
}
export type GovernanceStatus = keyof typeof GOV_STATUS

const DISCOURSE_API_KEY = '86fb0ca272612c10eabca94eec66f2d350bd11a10da2eff0744809a0e3cb6eb9' // TODO: env var
const DISCOURSE_BASE_URL = 'https://forum.sushi.com/'
const DISCOURSE_PROPOSAL_ID = 8
const SNAPSHOT_URL = 'https://hub.snapshot.org/graphql'

async function fetchDiscourse<T>(path: string) {
  const data = await fetchUrl<T>(DISCOURSE_BASE_URL + path, {
    headers: {
      'Api-Key': DISCOURSE_API_KEY,
      'Api-Username': 'sushi',
    },
  })

  return data
}

export async function getLatestGovernanceItems(filters?: {
  dateFilter: 'month' | 'quarter' | 'year' | 'all'
  sortForumPosts?: 'created' | 'activity' | 'default'
}) {
  const filterSeconds = filters
    ? DATE_FILTERS.options.find((option) => option.key === filters.dateFilter)?.seconds
    : null

  const forumParams = filters?.sortForumPosts ? new URLSearchParams({ order: filters.sortForumPosts }) : ''
  const forumUrl = `latest.json?${forumParams.toString()}`

  const query = gql`
    query Proposals($after: Int) {
      proposals(where: { space: "sushigov.eth", created_gte: $after }, orderBy: "created", orderDirection: desc) {
        id
        title
        body
        state
        author
      }
    }
  `

  const [forumTopicsRes, forumCategoriesRes, snapshotRes] = await Promise.all([
    fetchDiscourse<{
      topic_list: {
        topics: {
          title: string
          created_at: string
          category_id: number
          slug: string
        }[]
      }
    }>(forumUrl),
    fetchDiscourse<{
      category_list: {
        categories: {
          id: number
          name: string
        }[]
      }
    }>('categories.json'),
    request<{
      proposals: {
        id: string
        title: string
        body: string
        state: 'open' | 'closed'
        author: string
      }[]
    }>(SNAPSHOT_URL, query, { after: filterSeconds ? Math.floor(new Date().getTime() / 1000) - filterSeconds : null }),
  ])

  const snapshotProposals = snapshotRes.proposals.map((proposal) => ({
    type: GOV_STATUS.IMPLEMENTATION,
    title: proposal.title,
    isActive: proposal.state === 'open',
    url: 'https://snapshot.org/#/sushigov.eth/proposal/' + proposal.id,
    category: GOV_STATUS.IMPLEMENTATION.title,
  }))

  const forumTopics =
    forumTopicsRes?.topic_list.topics
      .filter((t) => {
        if (filterSeconds) {
          const topicCreationDateSeconds = Math.floor(new Date(t.created_at).getTime() / 1000)
          const nowSeconds = Math.floor(new Date().getTime() / 1000)
          const filterFrom = nowSeconds - filterSeconds

          if (topicCreationDateSeconds < filterFrom) return false
        }
        return true
      })
      .map((topic) => {
        const topicType = topic.category_id === DISCOURSE_PROPOSAL_ID ? GOV_STATUS.PROPOSAL : GOV_STATUS.DISCUSSION

        return {
          type: topicType,
          title: topic.title,
          isActive: false,
          url: 'https://forum.sushi.com/t/' + topic.slug,
          category:
            forumCategoriesRes?.category_list.categories.find((category) => category.id === topic.category_id)?.name ??
            topicType.title,
        }
      }) ?? []

  const res = [...snapshotProposals, ...forumTopics].reduce(
    (acc: Record<GovernanceStatus, GovernanceItem[]>, curr) => {
      acc[curr.type.id].push(curr)
      return acc
    },
    {
      IMPLEMENTATION: [],
      PROPOSAL: [],
      DISCUSSION: [],
    }
  )

  return res
}

export async function getForumStats() {
  const query = gql`
    query Space {
      space(id: "sushigov.eth") {
        proposalsCount
      }
    }
  `
  const [forumStats, proposalCountRes] = await Promise.all([
    fetchDiscourse<{
      about: {
        stats: { user_count: number; active_users_7_days: number; active_users_30_days: number }
      }
    }>('about.json'),
    request<{ space: { proposalsCount: number } }>(SNAPSHOT_URL, query),
  ])

  const data = { ...forumStats?.about.stats, proposalsCount: proposalCountRes.space.proposalsCount }

  return data
}

/* ===== $SUSHI subgraph ===== */

const GRAPH_URL = 'https://api.thegraph.com/subgraphs/name/olastenberg/sushi'

function getTokenConcentration(topTenUsers: { balance: string }[], totalSupply: string) {
  const topTenBalances: bigint = topTenUsers.reduce(
    (acc: bigint, curr: { balance: string }) => acc + BigInt(curr.balance),
    0n
  )
  const tokenConcentration = Number((topTenBalances * 100n) / BigInt(totalSupply)) / 100

  return tokenConcentration
}

export async function getTokenHolders(filters?: { balanceFilter: number; orderDirection: 'asc' | 'desc' }) {
  const query = gql`
    query TokenHolders(
      $usersFilter: User_filter
      $usersOrderDirection: OrderDirection
      $previousQuarterBlockNumber: Int
    ) {
      sushi(id: "Sushi") {
        userCount
        totalSupply
      }
      users(first: 10, orderBy: balance, where: $usersFilter, orderDirection: $usersOrderDirection) {
        balance
        id
      }
      topTenUsers: users(first: 10, orderBy: balance, orderDirection: desc) {
        balance
      }
      previousQuarterTopTenUsers: users(
        first: 10
        orderBy: balance
        orderDirection: desc
        block: { number: $previousQuarterBlockNumber }
      ) {
        balance
      }
      previousQuarterSushiStats: sushi(id: "Sushi", block: { number: $previousQuarterBlockNumber }) {
        userCount
        totalSupply
      }
    }
  `

  const previousQuarterTimestamp = Math.floor(endOfPreviousQuarter(Date.now()) / 1000)
  const previousQuarterBlockNumber = await getBlockNumberFromTimestamp(previousQuarterTimestamp)

  const tokenHoldersRes = await request(GRAPH_URL, query, {
    usersOrderDirection: filters?.orderDirection ?? 'desc',
    usersFilter: {
      balance_gt: filters?.balanceFilter ? (BigInt(1e18) * BigInt(+filters.balanceFilter)).toString() : 0,
    },
    previousQuarterBlockNumber,
  })

  const tokenConcentration = getTokenConcentration(tokenHoldersRes.topTenUsers, tokenHoldersRes.sushi.totalSupply)
  const previousQuarterTokenConcentration = getTokenConcentration(
    tokenHoldersRes.previousQuarterTopTenUsers,
    tokenHoldersRes.previousQuarterSushiStats.totalSupply
  )

  const res = {
    userCount: tokenHoldersRes.sushi.userCount,
    totalSupply: tokenHoldersRes.sushi.totalSupply,
    users: tokenHoldersRes.users,
    tokenConcentration,
    previousQuarter: {
      userCount: tokenHoldersRes.previousQuarterSushiStats.userCount,
      totalSupply: tokenHoldersRes.previousQuarterSushiStats.totalSupply,
      tokenConcentration: previousQuarterTokenConcentration,
    },
  }

  return res
}

/* ===== Defillama ===== */

export async function getTreasuryHistoricalTvl() {
  const allBalances = await fetchUrl<{
    chainTvls: {
      [group: string]: {
        tvl: {
          date: number
          totalLiquidityUSD: number
        }[]
      }
    }
  }>('https://api.llama.fi/treasury/sushi')

  if (!allBalances) return []

  const combinedData = {}

  for (const group in allBalances.chainTvls) {
    // defillama: skip sum of keys like ethereum-staking, arbitrum-vesting
    if (group.includes('-') || group.toLowerCase() === 'offers') continue

    allBalances.chainTvls[group].tvl.forEach(({ date, totalLiquidityUSD }) => {
      if (!combinedData[date]) {
        combinedData[date] = 0
      }
      combinedData[date] += totalLiquidityUSD
    })
  }

  const result = Object.entries(combinedData).map(([date, totalLiquidityUSD]) => ({
    date,
    value: totalLiquidityUSD as number,
  }))

  return result
}

/* ===== Safe ===== */

interface SafeBalance {
  id: string
  tokenAddress: Address | null
  token: {
    name: string
    symbol: string
    decimals: number
    logoUri: string
  } | null
  balance: string
  fiatBalance: string
  fiatConversion: string
}

export interface TreasuryBalance extends Omit<SafeBalance, 'token' | 'balance'> {
  portfolioShare: number
  balance: number
  token:
    | (SafeBalance['token'] & {
        address: Address
      })
    | null
}

export interface TreasurySnapshot {
  totalValueUsd: number
  balancesValueUsd: number
  vestingValueUsd: number
  balances: TreasuryBalance[]
}

export const TREASURY_ADDRESS = '0xe94B5EEC1fA96CEecbD33EF5Baa8d00E4493F4f3'

export async function getTreasurySnapshot() {
  const SAFE_URL = `https://safe-transaction-mainnet.safe.global/api/v1/safes/${TREASURY_ADDRESS}/balances/usd/?trusted=true&exclude_spam=true`
  const TOKENSETS_URL = 'https://api.tokensets.com/v2/funds/sushihouse'

  const [balancesRes = [], vestingValueUsd] = await Promise.all([
    fetchUrl<SafeBalance[]>(SAFE_URL),
    fetchUrl<{ fund: { market_cap: `$${string}` } }>(TOKENSETS_URL).then(
      (res) => Number(res?.fund.market_cap.replace(/[^0-9.]/g, '')) // remove $ and commas
    ),
  ])

  const balancesValueUsd = balancesRes?.reduce((acc, curr) => acc + Number(curr.fiatBalance), 0) ?? 0
  const totalValueUsd = balancesValueUsd + vestingValueUsd

  const balances: TreasuryBalance[] = balancesRes
    .filter((i) => +i.fiatBalance > 1_000)
    .map((info) => {
      const decimals = info.token?.decimals ?? 18
      const balance = Number((BigInt(info.balance) * 100n) / BigInt(10 ** decimals)) / 100
      const token = info.token && info.tokenAddress ? { ...info.token, address: info.tokenAddress } : null
      const portfolioShare = +info.fiatBalance / balancesValueUsd

      return { ...info, balance, id: info.tokenAddress ?? 'ETH', token, portfolioShare }
    })

  return {
    totalValueUsd,
    balancesValueUsd,
    vestingValueUsd,
    balances,
  }
}
