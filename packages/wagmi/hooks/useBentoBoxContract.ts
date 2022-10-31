import bentoBoxExports from '@sushiswap/bentobox/exports.json'
import { BentoBoxV1 } from '@sushiswap/bentobox/typechain'
import { ChainId } from '@sushiswap/chain'
import { useContract, useProvider } from 'wagmi'

// TODO: Move to deployments
export const BENTOBOX_ADDRESS: Record<number, string> = {
  [ChainId.ETHEREUM]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.ROPSTEN]: '0x6BdD85290001C8Aef74f35A7606065FA15aD5ACF',
  [ChainId.RINKEBY]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.GÖRLI]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.KOVAN]: '0xc381a85ed7C7448Da073b7d6C9d4cBf1Cbf576f0',
  [ChainId.FANTOM]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.POLYGON]: '0x0319000133d3AdA02600f0875d2cf03D442C3367',
  [ChainId.POLYGON_TESTNET]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.GNOSIS]: '0xE2d7F5dd869Fc7c126D21b13a9080e75a4bDb324',
  [ChainId.BSC]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.BSC_TESTNET]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.ARBITRUM]: '0x74c764D41B77DBbb4fe771daB1939B00b146894A',
  [ChainId.AVALANCHE]: '0x0711B6026068f736bae6B213031fCE978D48E026',
  [ChainId.HECO]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.CELO]: '0x0711B6026068f736bae6B213031fCE978D48E026',
  [ChainId.HARMONY]: '0xA28cfF72b04f83A7E3f912e6ad34d5537708a2C2',
  [ChainId.MOONBEAM]: '0x80C7DD17B01855a6D2347444a0FCC36136a314de',
  [ChainId.MOONRIVER]: '0x145d82bCa93cCa2AE057D1c6f26245d1b9522E6F',
  [ChainId.OPTIMISM]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
  [ChainId.KAVA]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
  [ChainId.METIS]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
}

export const getBentoBoxContractConfig = (chainId: number | undefined) => ({
  addressOrName:
    bentoBoxExports[chainId?.toString() as keyof Omit<typeof bentoBoxExports, '31337'>]?.[0]?.contracts?.BentoBoxV1
      ?.address ?? '',
  contractInterface:
    bentoBoxExports[chainId?.toString() as keyof Omit<typeof bentoBoxExports, '31337'>]?.[0]?.contracts?.BentoBoxV1
      ?.abi ?? [],
})

export function useBentoBoxContract(chainId: number | undefined) {
  return useContract<BentoBoxV1>({
    ...getBentoBoxContractConfig(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
