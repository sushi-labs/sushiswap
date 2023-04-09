import { useLocalStorage } from '@sushiswap/hooks'

export const useSlippageTolerance = () => useLocalStorage('swapSlippage', '0.5')
