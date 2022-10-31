import { BaseProvider } from '@ethersproject/providers'
import { ChainId } from '@sushiswap/chain'
import { useInterval, useIsWindowVisible } from '@sushiswap/hooks'
import { getVersionUpgrade, minVersionBump, VersionUpgrade } from '@uniswap/token-lists'
import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { UNSUPPORTED_TOKEN_LIST_URLS } from './constants'
import { TokenListsContext } from './context'
import { useActiveListUrls, useAllLists, useFetchListCallback } from './hooks'

export interface UpdaterProps {
  context: TokenListsContext
  chainId: ChainId // For now, one updater is required for each chainId to be watched
  provider: BaseProvider
  isDebug?: boolean
}

function Updater(props: UpdaterProps): null {
  const { context, provider } = props
  const { actions } = context
  const dispatch = useDispatch()

  const isWindowVisible = useIsWindowVisible()

  // get all loaded lists, and the active urls
  const lists = useAllLists(context)
  const activeListUrls = useActiveListUrls(context)

  const fetchList = useFetchListCallback(context, provider)

  const fetchAllListsCallback = useCallback(() => {
    if (!isWindowVisible) return
    Object.keys(lists).forEach((url) =>
      fetchList(url).catch((error) => console.debug('interval list fetching error', error))
    )
  }, [fetchList, isWindowVisible, lists])

  // fetch all lists every 10 minutes, but only after we initialize library
  useInterval(fetchAllListsCallback, provider ? 1000 * 60 * 10 : null)

  // whenever a list is not loaded and not loading, try again to load it
  useEffect(() => {
    Object.keys(lists).forEach((listUrl) => {
      const list = lists[listUrl]
      if (!list.current && !list.loadingRequestId && !list.error) {
        fetchList(listUrl).catch((error) => console.debug('list added fetching error', error))
      }
    })
  }, [dispatch, fetchList, provider, lists])

  // if any lists from unsupported lists are loaded, check them too (in case new updates since last visit)
  useEffect(() => {
    UNSUPPORTED_TOKEN_LIST_URLS.forEach((listUrl) => {
      const list = lists[listUrl]
      if (!list || (!list.current && !list.loadingRequestId && !list.error)) {
        fetchList(listUrl).catch((error) => console.debug('list added fetching error', error))
      }
    })
  }, [dispatch, fetchList, provider, lists])

  // automatically update lists if versions are minor/patch
  useEffect(() => {
    Object.keys(lists).forEach((listUrl) => {
      const list = lists[listUrl]
      if (list.current && list.pendingUpdate) {
        const bump = getVersionUpgrade(list.current.version, list.pendingUpdate.version)
        switch (bump) {
          case VersionUpgrade.NONE:
            throw new Error('unexpected no version bump')
          case VersionUpgrade.PATCH:
          case VersionUpgrade.MINOR:
            const min = minVersionBump(list.current.tokens, list.pendingUpdate.tokens)
            // automatically update minor/patch as long as bump matches the min update
            if (bump >= min) {
              dispatch(actions.accept(listUrl))
            } else {
              console.error(
                `List at url ${listUrl} could not automatically update because the version bump was only PATCH/MINOR while the update had breaking changes and should have been MAJOR`
              )
            }
            break

          // update any active or inactive lists
          case VersionUpgrade.MAJOR:
            dispatch(actions.accept(listUrl))
        }
      }
    })
  }, [dispatch, lists, activeListUrls, actions])

  return null
}

export function createUpdater(context: TokenListsContext) {
  const UpdaterContextBound = (props: Omit<UpdaterProps, 'context'>) => {
    return <Updater context={context} {...props} />
  }
  return UpdaterContextBound
}
