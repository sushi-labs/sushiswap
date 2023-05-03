import { useLocalStorage } from '@sushiswap/hooks'

export const useSlippageTolerance = (key = 'swapSlippage') => useLocalStorage(key, '0.5')
