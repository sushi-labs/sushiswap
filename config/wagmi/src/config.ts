import { bentoBoxV1Abi } from '@sushiswap/abi'
import bentoBoxExports from '@sushiswap/bentobox/exports'

export const getBentoBoxContractConfig = (chainId: keyof Omit<typeof bentoBoxExports, '31337'> | number | undefined) => {
  return {
    address:
      bentoBoxExports?.[chainId as keyof Omit<typeof bentoBoxExports, '31337'>]?.[0]?.contracts?.BentoBoxV1?.address ||
      '',
    abi: bentoBoxV1Abi,
  } as const
}
