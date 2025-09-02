import { useLocalStorage } from '@sushiswap/hooks'

const RECENT_KEY = 'sushi.recent-recipients'

export function useRecentRecipients(limit = 5) {
  const [recents, setRecents] = useLocalStorage<string[]>(RECENT_KEY, [])

  const addRecent = (address: string) => {
    setRecents((prev) => {
      const filtered = prev.filter(
        (a) => a.toLowerCase() !== address.toLowerCase(),
      )
      return [address, ...filtered].slice(0, limit)
    })
  }

  return { recents, addRecent }
}
