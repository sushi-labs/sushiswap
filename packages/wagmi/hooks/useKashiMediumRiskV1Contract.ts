import { ChainId } from '@sushiswap/chain'
import kashiExports from '@sushiswap/kashi/exports.json'
import { KashiPairMediumRiskV1 } from '@sushiswap/kashi/typechain'
import { useContract, useProvider } from 'wagmi'

export const KASHI_ADDRESS = {
  [ChainId.ETHEREUM]: '0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42',
  [ChainId.POLYGON]: '0xB527C5295c4Bc348cBb3a2E96B2494fD292075a7',
  [ChainId.GNOSIS]: '0x7a6DA9903d0a481F40b8336c1463487BC8C0407e',
  [ChainId.BSC]: '0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42',
  [ChainId.ARBITRUM]: '0xa010eE0226cd071BeBd8919A1F675cAE1f1f5D3e',
  [ChainId.AVALANCHE]: '0x513037395FA0C9c35E41f89189ceDfE3bD42fAdb',
  // [ChainId.HECO]: '0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42',
} as const

export const getKashiMediumRiskV1ContractConfig = (chainId: number | undefined) => ({
  addressOrName:
    kashiExports[chainId as unknown as keyof Omit<typeof kashiExports, '31337'>]?.[0]?.contracts?.KashiPairMediumRiskV1
      ?.address ?? '',
  contractInterface:
    kashiExports[chainId as unknown as keyof Omit<typeof kashiExports, '31337'>]?.[0]?.contracts?.KashiPairMediumRiskV1
      ?.abi ?? [],
})

export function useKashiMediumRiskV1Contract(chainId: number | undefined) {
  return useContract<KashiPairMediumRiskV1>({
    ...getKashiMediumRiskV1ContractConfig(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
