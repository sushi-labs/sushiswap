import { useContract, useProvider } from 'wagmi'

import { bentoBoxV1Abi } from '@sushiswap/abi'
import bentoBoxExports from '@sushiswap/bentobox/exports'

export const getBentoBoxContractConfig = (
  chainId: keyof Omit<typeof bentoBoxExports, '31337'> | number | undefined
) => {
  return {
    address:
      bentoBoxExports?.[chainId as keyof Omit<typeof bentoBoxExports, '31337'>]?.[0]?.contracts?.BentoBoxV1?.address ||
      '',
    abi: bentoBoxV1Abi,
  } as const
}

export function useBentoBoxContract(chainId: number | undefined) {
  return useContract({
    ...getBentoBoxContractConfig(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
export type BentoBox = NonNullable<ReturnType<typeof useBentoBoxContract>>
