import { useLocalStorage } from './useLocalStorage'

export enum TTLStorageKey {
  AddLiquidity = 'ttl-add-liquidity',
  RemoveLiquidity = 'ttl-remove-liquidity',
}

export const useTTL = (key: TTLStorageKey) => {
  return useLocalStorage<number>(key, 0)
}
