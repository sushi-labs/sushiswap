import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { LogsContext } from './context'
import { EventFilter, WithLogsState } from './types'
import { keyToFilter } from './utils'
import { providers } from 'ethers'

export interface UpdaterProps {
  context: LogsContext
  chainId: number | undefined // For now, one updater is required for each chainId to be watched
  blockNumber: number | undefined
  library: providers.JsonRpcProvider
  isDebug?: boolean
}

export default function Updater(props: UpdaterProps): null {
  const { context, chainId, blockNumber, library, isDebug } = props
  const { actions, reducerPath } = context
  const dispatch = useDispatch()
  const state = useSelector((state: WithLogsState) => state[reducerPath])

  const filtersNeedFetch: EventFilter[] = useMemo(() => {
    if (!chainId || typeof blockNumber !== 'number') return []

    const active = state[chainId]
    if (!active) return []

    return Object.keys(active)
      .filter((key) => {
        const { fetchingBlockNumber, results, listeners } = active[key]
        if (listeners === 0) return false
        if (typeof fetchingBlockNumber === 'number' && fetchingBlockNumber >= blockNumber) return false
        if (results && typeof results.blockNumber === 'number' && results.blockNumber >= blockNumber) return false
        return true
      })
      .map((key) => keyToFilter(key))
  }, [blockNumber, chainId, state])

  useEffect(() => {
    if (!library || !chainId || typeof blockNumber !== 'number' || filtersNeedFetch.length === 0) return

    dispatch(actions.fetchingLogs({ chainId, filters: filtersNeedFetch, blockNumber }))
    filtersNeedFetch.forEach((filter) => {
      library
        .getLogs({
          ...filter,
          fromBlock: 0,
          toBlock: blockNumber,
        })
        .then((logs) => {
          dispatch(
            actions.fetchedLogs({
              chainId,
              filter,
              results: { logs, blockNumber },
            }),
          )
        })
        .catch((error) => {
          console.error('Failed to get logs', filter, error)
          dispatch(
            actions.fetchedLogsError({
              chainId,
              filter,
              blockNumber,
            }),
          )
        })
    })
  }, [blockNumber, chainId, dispatch, filtersNeedFetch, library])

  return null
}

export function createUpdater(context: LogsContext) {
  const UpdaterContextBound = (props: Omit<UpdaterProps, 'context'>) => {
    return <Updater context={context} {...props} />
  }
  return UpdaterContextBound
}
