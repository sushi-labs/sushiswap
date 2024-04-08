import { useLocalStorage } from '@sushiswap/hooks'

export const useSwapApi = () => useLocalStorage('swap-api', true)
