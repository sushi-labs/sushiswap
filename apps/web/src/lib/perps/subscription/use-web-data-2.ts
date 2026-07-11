'use client'
import { type WebData2Response, webData2 } from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { hlHttpTransport } from '../transports'
import { type TokenBalance, isTokenBalance } from '../utils'

type WebData2EventWithTokenBalances = Omit<WebData2Response, 'spotState'> & {
  spotState?: Omit<NonNullable<WebData2Response['spotState']>, 'balances'> & {
    balances: TokenBalance[]
  }
}

function filterTokenBalances(
  event: WebData2Response,
): WebData2EventWithTokenBalances {
  const { spotState, ...rest } = event

  return {
    ...rest,
    ...(spotState
      ? {
          spotState: {
            ...spotState,
            balances: spotState.balances.filter(isTokenBalance),
          },
        }
      : {}),
  }
}

export const useWebData2 = ({ address }: { address?: EvmAddress }) => {
  const query = useQuery<WebData2EventWithTokenBalances>({
    queryKey: ['useWebData2', address],
    queryFn: async () => {
      if (!address) throw new Error('Address is required')

      const event = await webData2(
        { transport: hlHttpTransport },
        { user: address },
      )

      return filterTokenBalances(event)
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchInterval: 5_000,
    refetchIntervalInBackground: true,
    enabled: Boolean(address),
  })

  const isReady = Boolean(query.data)

  return { ...query, isLoading: query.isLoading || !isReady }
}
