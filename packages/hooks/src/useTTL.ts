import { useLocalStorage } from './useLocalStorage'

export const useTTL = (key?: string) => {
  return useLocalStorage<number>(key ? `${key}-ttl` : 'ttl', 0)
}
