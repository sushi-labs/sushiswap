import { useLocalStorage } from '@sushiswap/hooks'

export const useCarbonOffset = () => useLocalStorage('carbonOffset', false)
