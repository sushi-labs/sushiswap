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
}> {
  const query = gql`
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

  return request('https://api.thegraph.com/subgraphs/name/olastenberg/sushi', query, {
    orderDirection: filters?.orderDirection ?? 'desc',
    where: {
      balance_gt: filters?.balanceFilter ? (BigInt(1e18) * BigInt(+filters.balanceFilter)).toString() : 0,
    },
  })
}

export async function getTreasurySnapshot() {
  const SAFE_URL =
    'https://safe-transaction-mainnet.safe.global/api/v1/safes/0xe94B5EEC1fA96CEecbD33EF5Baa8d00E4493F4f3/balances/usd/?trusted=true&exclude_spam=true'
  const TOKENSETS_URL = 'https://api.tokensets.com/v2/funds/sushihouse'

  const [balances, vestingValueUsd] = await Promise.all([
    fetchUrl<
      {
        tokenAddress: Address | null
        token: {
          name: string
          symbol: string
          decimals: number
          logoUri: string
        } | null
        balance: string
        ethValue: string
        fiatBalance: string
        fiatConversion: string
        fiatCode: string
        timestamp: string
      }[]
    >(SAFE_URL),
    fetchUrl<{ fund: { market_cap: `$${string}` } }>(TOKENSETS_URL).then(
      (res) => Number(res?.fund.market_cap.replace(/[^0-9.]/g, '')) // remove $ and commas
    ),
  ])

  const balancesValueUsd = balances?.reduce((acc, curr) => acc + Number(curr.fiatBalance), 0) ?? 0
  const totalValueUsd = balancesValueUsd + vestingValueUsd

  return {
    totalValueUsd,
    balancesValueUsd,
    vestingValueUsd,
    balances,
  }
}
