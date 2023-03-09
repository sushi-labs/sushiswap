import { useLocalStorage } from '@sushiswap/hooks'

export const useCustomTokens = () => useLocalStorage('sushi.customTokens', '{}')
