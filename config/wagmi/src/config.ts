import { bentoBoxV1Address, bentoBoxV1Abi, BentoBoxV1ChainId } from '@sushiswap/bentobox/exports'

export const getBentoBoxContractConfig = (chainId: BentoBoxV1ChainId) => {
  return {
    address: bentoBoxV1Address[chainId],
    abi: bentoBoxV1Abi[chainId],
  } as const
}
