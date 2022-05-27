import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LogsContext } from './context'
import { EventFilter, Log, WithLogsState } from './types'
import { filterToKey } from './utils'

export enum LogsState {
  // The filter is invalid
  INVALID,
  // The logs are being loaded
  LOADING,
  // Logs are from a previous block number
  SYNCING,
  // Tried to fetch logs but received an error
  ERROR,
  // Logs have been fetched as of the latest block number
  SYNCED,
}

export interface UseLogsResult {
  logs: Log[] | undefined
  state: LogsState
}

/**
 * Returns the logs for the given filter as of the latest block, re-fetching from the library every block.
 * @param filter The logs filter, without `blockHash`, `fromBlock` or `toBlock` defined.
 * The filter parameter should _always_ be memoized, or else will trigger constant refetching
 */
export function useLogs(
  context: LogsContext,
  chainId: number | undefined,
  blockNumber: number | undefined,
  filter: EventFilter | undefined
): UseLogsResult {
  const { reducerPath, actions } = context

  const logs = useSelector((state: WithLogsState) => state[reducerPath])
  const dispatch = useDispatch()

  useEffect(() => {
    if (!filter || !chainId) return

    dispatch(actions.addListener({ chainId, filter }))
    return () => {
      dispatch(actions.removeListener({ chainId, filter }))
    }
  }, [chainId, dispatch, filter])

  const filterKey = useMemo(() => (filter ? filterToKey(filter) : undefined), [filter])

  return useMemo(() => {
    if (!chainId || !filterKey || !blockNumber)
      return {
        logs: undefined,
        state: LogsState.INVALID,
      }

    const state = logs[chainId]?.[filterKey]
    const result = state?.results
    if (!result) {
      return {
        state: LogsState.LOADING,
        logs: undefined,
      }
    }

    if (result.error) {
      return {
        state: LogsState.ERROR,
        logs: undefined,
      }
    }

    return {
      state: result.blockNumber >= blockNumber ? LogsState.SYNCED : LogsState.SYNCING,
      logs: result.logs,
    }
  }, [blockNumber, chainId, filterKey, logs])
}
