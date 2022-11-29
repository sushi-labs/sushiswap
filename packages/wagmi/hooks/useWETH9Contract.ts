import { WNATIVE_ADDRESS } from '@sushiswap/currency'
import { Address, useContract, useProvider } from 'wagmi'

import WETH9_ABI from '../abis/weth9.json'

export const getWETH9ContractConfig = (chainId: number | undefined) => ({
  address: (chainId ? (WNATIVE_ADDRESS as Record<number, `0x${string}`>)[chainId] : '') as Address,
  abi: WETH9_ABI,
})

export function useWETH9Contract(chainId: keyof typeof WNATIVE_ADDRESS | undefined) {
  return useContract({
    ...getWETH9ContractConfig(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
