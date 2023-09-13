import { useLocalStorage } from '@sushiswap/hooks'

export const useSwapApi = () => useLocalStorage('swapApi', true)
