import { bentoBoxV1Abi } from '@sushiswap/abi'
import { BentoBoxChainId } from '@sushiswap/address'
import bentoBoxExports from '@sushiswap/bentobox/exports.json'

export const getBentoBoxContractConfig = (chainId: BentoBoxChainId | number | undefined) => {
  return {
    address:
      bentoBoxExports?.[chainId as keyof Omit<typeof bentoBoxExports, '31337'>]?.[0]?.contracts?.BentoBoxV1?.address ||
      '',
    abi: bentoBoxV1Abi,
  } as const
}
