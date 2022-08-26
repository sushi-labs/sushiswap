import { ChainId } from '@sushiswap/chain'
import { useContract, useSigner } from 'wagmi'

import CONSTANT_PRODUCT_POOL_FACTORY_ABI from '../abis/constant-product-pool-factory.json'

export const CONSTANT_PRODUCT_POOL_FACTORY_ADDRESS: Record<number, string> = {
  [ChainId.OPTIMISM]: '0x93395129bd3fcf49d95730D3C2737c17990fF328',
  [ChainId.POLYGON]: '0x05689fCfeE31FCe4a67FbC7Cab13E74F80A4E288',
}

export const getConstantProductPoolFactoryContract = (chainId: number | undefined) => ({
  addressOrName: CONSTANT_PRODUCT_POOL_FACTORY_ADDRESS?.[chainId as unknown as number],
  contractInterface: CONSTANT_PRODUCT_POOL_FACTORY_ABI,
})

export function useConstantProductPoolFactoryContract(chainId: ChainId) {
  const { data: signerOrProvider } = useSigner()
  return useContract({
    ...getConstantProductPoolFactoryContract(chainId),
    signerOrProvider,
  })
}
