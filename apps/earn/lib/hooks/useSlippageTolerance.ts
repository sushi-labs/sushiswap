import { useLocalStorage } from '@sushiswap/hooks'

export const useSlippageTolerance = (key: string | undefined = 'swapSlippage') => useLocalStorage(key, '0.5')
