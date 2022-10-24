import { WNATIVE_ADDRESS } from '@sushiswap/currency'
import { useContract, useProvider } from 'wagmi'

import WETH9_ABI from '../abis/weth9.json'

export const getWETH9ContractConfig = (chainId: keyof typeof WNATIVE_ADDRESS | undefined) => ({
  addressOrName: chainId ? WNATIVE_ADDRESS[chainId] : '',
  contractInterface: WETH9_ABI,
})

export function useWETH9Contract(chainId: keyof typeof WNATIVE_ADDRESS | undefined) {
  return useContract({
    ...getWETH9ContractConfig(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
