import type { UseQueryResult } from '@tanstack/react-query'
import type { UseEvmTradeReturn } from 'src/lib/hooks/react-query'
import { getBetterTrade } from './utils'

export function combineEvmTradeQueries(
  aggregator: UseQueryResult<UseEvmTradeReturn, Error>,
  direct: UseQueryResult<UseEvmTradeReturn, Error>,
  directPoolEnabled = true,
): UseQueryResult<UseEvmTradeReturn, Error> {
  if (!directPoolEnabled) return aggregator

  const data = getBetterTrade(aggregator.data, direct.data)
  const source =
    data === direct.data && direct.data !== undefined ? direct : aggregator
  const bothSettled =
    (!aggregator.isFetching || aggregator.isError) &&
    (!direct.isFetching || direct.isError)

  const refetch: typeof aggregator.refetch = async (options) => {
    const [aggregatorResult, directResult] = await Promise.all([
      aggregator.refetch(options),
      direct.refetch(options),
    ])

    return combineEvmTradeQueries(aggregatorResult, directResult)
  }

  return {
    ...source,
    data,
    isFetching: aggregator.isFetching || direct.isFetching,
    isLoading: !data && (aggregator.isLoading || direct.isLoading),
    isSuccess: Boolean(data),
    isError: !data && bothSettled && (aggregator.isError || direct.isError),
    error:
      !data && bothSettled ? (aggregator.error ?? direct.error) : source.error,
    refetch,
  } as UseQueryResult<UseEvmTradeReturn, Error>
}
