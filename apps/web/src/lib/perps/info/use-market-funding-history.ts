import {
  type FundingHistoryResponse,
  fundingHistory,
} from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import { hlHttpTransport } from '../transports'

export type MarketFundingHistoryStartTime = 'D' | 'W' | 'M' | '3M' | 'Y'

const DAY_MS = 24 * 60 * 60 * 1000
const MAX_FUNDING_HISTORY_PAGES = 24

function getStartTime(startTime: MarketFundingHistoryStartTime): number {
  const now = Date.now()

  switch (startTime) {
    case 'D':
      return now - DAY_MS
    case 'W':
      return now - 7 * DAY_MS
    case 'M':
      return now - 30 * DAY_MS
    case '3M':
      return now - 90 * DAY_MS
    case 'Y':
      return now - 365 * DAY_MS
    default:
      throw new Error('Invalid start time')
  }
}

export type MarketFundingHistoryItem = FundingHistoryResponse[number]

async function getMarketFundingHistory({
  assetString,
  endTime,
  signal,
  startTime,
}: {
  assetString: string
  endTime: number
  signal?: AbortSignal
  startTime: number
}): Promise<FundingHistoryResponse> {
  const itemsByTimestamp = new Map<number, MarketFundingHistoryItem>()
  let pageStartTime = startTime

  for (let page = 0; page < MAX_FUNDING_HISTORY_PAGES; page++) {
    const pageItems = await fundingHistory(
      {
        transport: hlHttpTransport,
      },
      {
        coin: assetString,
        endTime,
        startTime: pageStartTime,
      },
      signal,
    )

    for (const item of pageItems) {
      itemsByTimestamp.set(item.time, item)
    }

    const lastItem = pageItems[pageItems.length - 1]

    if (!lastItem || lastItem.time >= endTime) {
      break
    }

    const nextPageStartTime = lastItem.time + 1

    if (nextPageStartTime <= pageStartTime) {
      break
    }

    pageStartTime = nextPageStartTime
  }

  return [...itemsByTimestamp.values()].sort((a, b) => a.time - b.time)
}

export function useMarketFundingHistory({
  assetString,
  enabled = true,
  startTime = 'W',
}: {
  assetString: string
  enabled?: boolean
  startTime?: MarketFundingHistoryStartTime
}) {
  return useQuery({
    queryKey: ['market-funding-history', assetString, startTime],
    queryFn: ({ signal }) => {
      const startTimestamp = getStartTime(startTime)
      const endTimestamp = Date.now()

      return getMarketFundingHistory({
        assetString,
        endTime: endTimestamp,
        signal,
        startTime: startTimestamp,
      })
    },
    enabled: Boolean(assetString && enabled),
    staleTime: 60 * 1000,
  })
}
