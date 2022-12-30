import { TokenListsContext } from '../context'
import { useActiveListUrls } from './useActiveListUrls'

export function useIsListActive(context: TokenListsContext, url: string): boolean {
  const activeListUrls = useActiveListUrls(context)
  return Boolean(activeListUrls?.includes(url))
}
