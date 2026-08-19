import type { UseQueryResult } from '@tanstack/react-query'
import type { UseEvmTradeReturn } from 'src/lib/hooks/react-query'
import { getBetterTrade } from './utils'

export type CombinedEvmTradeQueryResult = Pick<
  UseQueryResult<UseEvmTradeReturn, Error>,
  | 'data'
  | 'error'
  | 'isError'
  | 'isFetching'
  | 'isInitialLoading'
  | 'isLoading'
  | 'isSuccess'
>

function selectQueryState(
  query: UseQueryResult<UseEvmTradeReturn, Error>,
): CombinedEvmTradeQueryResult {
  return {
    data: query.data,
    error: query.error,
    isError: query.isError,
    isFetching: query.isFetching,
    isInitialLoading: query.isInitialLoading,
    isLoading: query.isLoading,
    isSuccess: query.isSuccess,
  }
}

export function combineEvmTradeQueries(
  aggregator: UseQueryResult<UseEvmTradeReturn, Error>,
  direct: UseQueryResult<UseEvmTradeReturn, Error>,
  directPoolEnabled = true,
): CombinedEvmTradeQueryResult {
  if (!directPoolEnabled) return selectQueryState(aggregator)

  const data = getBetterTrade(aggregator.data, direct.data)
  const bothSettled =
    (!aggregator.isFetching || aggregator.isError) &&
    (!direct.isFetching || direct.isError)
  const isError = !data && bothSettled && (aggregator.isError || direct.isError)
  const isLoading = !data && (aggregator.isLoading || direct.isLoading)

  return {
    data,
    error: isError ? (aggregator.error ?? direct.error) : null,
    isError,
    isFetching: aggregator.isFetching || direct.isFetching,
    isInitialLoading: isLoading,
    isLoading,
    isSuccess: Boolean(data),
  }
}
