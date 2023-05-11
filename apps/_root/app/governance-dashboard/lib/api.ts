import { ChainId } from '@sushiswap/chain'
import { SUSHI_ADDRESS } from '@sushiswap/currency'
import { gql, request } from 'graphql-request'

import { DATE_FILTERS, GOV_STATUS } from './constants'

import type { Address } from 'wagmi'
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

async function fetchDiscourse<T>(path: string) {
  const data = await fetchUrl<T>(DISCOURSE_BASE_URL + path, {
    headers: {
      'Api-Key': DISCOURSE_API_KEY,
      'Api-Username': 'sushi',
    },
  })

  return data
}

const SNAPSHOT_URL = 'https://hub.snapshot.org/graphql'

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
  const data = await fetchDiscourse<{
    about: {
      stats: { user_count: number; active_users_7_days: number; active_users_30_days: number; topic_count: number }
    }
  }>('about.json')

  return data?.about.stats
}

export async function getTokenHolders(filters?: { balanceFilter: number; orderDirection: 'asc' | 'desc' }): Promise<{
  sushi: { userCount: string; totalSupply: string }
  users: { balance: string; id: string }[]
  tokenConcentration: number
}> {
  const GRAPH_URL = 'https://api.thegraph.com/subgraphs/name/olastenberg/sushi'
  const balancesQuery = gql`
    query TokenHolders {
      users(first: 10, orderBy: balance, orderDirection: desc) {
        balance
      }
    }
  `
  const filteredQuery = gql`
    query TokenHolders($where: User_filter, $orderDirection: OrderDirection) {
      sushi(id: "Sushi") {
        userCount
        totalSupply
      }
      users(first: 10, orderBy: balance, where: $where, orderDirection: $orderDirection) {
        balance
        id
      }
    }
  `

  const [tokenHoldersRes, usersRes] = await Promise.all([
    request(GRAPH_URL, filteredQuery, {
      orderDirection: filters?.orderDirection ?? 'desc',
      where: {
        balance_gt: filters?.balanceFilter ? (BigInt(1e18) * BigInt(+filters.balanceFilter)).toString() : 0,
      },
    }),
    request(GRAPH_URL, balancesQuery),
  ])

  const topTenBalances: bigint = usersRes.users.reduce(
    (acc: bigint, curr: { balance: string }) => acc + BigInt(curr.balance),
    0n
  )
  const tokenConcentration = Number((topTenBalances * 100n) / BigInt(tokenHoldersRes.sushi.totalSupply)) / 100

  return { ...tokenHoldersRes, tokenConcentration }
}

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

export interface TreasuryBalance extends Omit<SafeBalance, 'token'> {
  portfolioShare: number
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
      const balance = String(BigInt(info.balance) / BigInt(10 ** decimals))
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
