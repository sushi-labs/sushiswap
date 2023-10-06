import { ChainId } from '../chain'

export const SUSHIXSWAP_SUPPORTED_CHAIN_IDS = [
  ChainId.ARBITRUM,
  ChainId.AVALANCHE,
  ChainId.BSC,
  ChainId.ETHEREUM,
  ChainId.FANTOM,
  ChainId.OPTIMISM,
  ChainId.POLYGON,
] as const

export type SushiXSwapChainId = typeof SUSHIXSWAP_SUPPORTED_CHAIN_IDS[number]

export const SUSHIXSWAP_ADDRESS: Record<SushiXSwapChainId, `0x${string}`> = {
  [ChainId.ARBITRUM]: '0x53b08DbD70327b7Ba3B7886Fc9987BC985d27262',
  [ChainId.AVALANCHE]: '0x2c8C987C4777AB740d20Cb581f5d381BE95A4A4a',
  [ChainId.BSC]: '0x7A4af156379f512DE147ed3b96393047226d923F',
  [ChainId.ETHEREUM]: '0x011E52E4E40CF9498c79273329E8827b21E2e581',
  [ChainId.FANTOM]: '0xD045d27c1f7e7f770a807B0a85d8e3F852e0F2BE',
  [ChainId.OPTIMISM]: '0x8B396ddF906D552b2F98a8E7d743DD58Cd0d920f',
  [ChainId.POLYGON]: '0xd08b5f3e89F1e2d6b067e0A0cbdb094e6e41E77c',
} as const

export const isSushiXSwapChainId = (
  chainId: ChainId,
): chainId is SushiXSwapChainId =>
  SUSHIXSWAP_SUPPORTED_CHAIN_IDS.includes(chainId as SushiXSwapChainId)

export const SUSHIXSWAP_2_SUPPORTED_CHAIN_IDS = [
  // ChainId.ETHEREUM,
  // ChainId.BSC,
  // ChainId.AVALANCHE,
  ChainId.POLYGON,
  ChainId.ARBITRUM,
  ChainId.OPTIMISM,
  ChainId.BASE,
] as const

export type SushiXSwap2ChainId = typeof SUSHIXSWAP_2_SUPPORTED_CHAIN_IDS[number]

export const SUSHIXSWAP_2_ADDRESS: Record<SushiXSwap2ChainId, `0x${string}`> = {
  // [ChainId.ETHEREUM]: '0x804b526e5bf4349819fe2db65349d0825870f8ee',
  // [ChainId.BSC]: '0x804b526e5bf4349819fe2db65349d0825870f8ee',
  // [ChainId.AVALANCHE]: '0x804b526e5bf4349819fe2db65349d0825870f8ee',
  // [ChainId.POLYGON]: '0x804b526e5bf4349819fe2db65349d0825870f8ee',
  [ChainId.POLYGON]: '0xBf34c7bc377fFaB955f7b761472147dE4a2774fc',
  // [ChainId.ARBITRUM]: '0x804b526e5bf4349819fe2db65349d0825870f8ee',
  [ChainId.ARBITRUM]: '0xFbcACe20688510C3533db7BA0418a352E969AE5A',
  // [ChainId.OPTIMISM]: '0x804b526e5bf4349819fe2db65349d0825870f8ee',
  [ChainId.OPTIMISM]: '0x9A4cad00D73d4c1466180b3AbDEFeCEc77Fc9B12',
  // [ChainId.BASE]: '0x804b526e5bf4349819fe2db65349d0825870f8ee',
  [ChainId.BASE]: '0x3ea093C8C2c70D83BBC60ECC695A1E7e1664e015',
} as const

export const isSushiXSwap2ChainId = (
  chainId: ChainId,
): chainId is SushiXSwap2ChainId =>
  SUSHIXSWAP_2_SUPPORTED_CHAIN_IDS.includes(chainId as SushiXSwap2ChainId)

export const STARGATE_ADAPTER_SUPPORTED_CHAIN_IDS = [
  ChainId.ETHEREUM,
  ChainId.BSC,
  ChainId.AVALANCHE,
  ChainId.POLYGON,
  ChainId.ARBITRUM,
  ChainId.OPTIMISM,
  ChainId.BASE,
] as const

export type StargateAdapterChainId =
  typeof STARGATE_ADAPTER_SUPPORTED_CHAIN_IDS[number]

export const STARGATE_ADAPTER_ADDRESS: Record<
  StargateAdapterChainId,
  `0x${string}`
> = {
  [ChainId.ETHEREUM]: '0xbF3B71decBCEFABB3210B9D8f18eC22e0556f5F0',
  [ChainId.BSC]: '0x454714482cA38fBBcE7fC76D96Ba1CE2028A4fF6',
  [ChainId.AVALANCHE]: '0x454714482cA38fBBcE7fC76D96Ba1CE2028A4fF6',
  [ChainId.POLYGON]: '0xFF51a7C624Eb866917102707F3dA8bFb99Db8692',
  [ChainId.ARBITRUM]: '0x2ABf469074dc0b54d793850807E6eb5Faf2625b1',
  [ChainId.OPTIMISM]: '0x454714482cA38fBBcE7fC76D96Ba1CE2028A4fF6',
  [ChainId.BASE]: '0xbF3B71decBCEFABB3210B9D8f18eC22e0556f5F0',
} as const

export const isStargateAdapterChainId = (
  chainId: ChainId,
): chainId is StargateAdapterChainId =>
  STARGATE_ADAPTER_SUPPORTED_CHAIN_IDS.includes(
    chainId as StargateAdapterChainId,
  )

export const SQUID_ADAPTER_SUPPORTED_CHAIN_IDS = [
  ChainId.ARBITRUM,
  ChainId.OPTIMISM,
  ChainId.BASE,
  ChainId.POLYGON,
] as const

export type SquidAdapterChainId =
  typeof SQUID_ADAPTER_SUPPORTED_CHAIN_IDS[number]

export const SQUID_ADAPTER_ADDRESS: Record<SquidAdapterChainId, `0x${string}`> =
  {
    [ChainId.ARBITRUM]: '0xc58fF59C077235e0944D4652Edf1a267c3EA276e',
    [ChainId.OPTIMISM]: '0x8e91fbE4025453d52C6C429B06C9fD9051186D0C',
    [ChainId.BASE]: '0x636fdcc0DB40307Be5592B73dB3322c8Fd8C2CF7',
    [ChainId.POLYGON]: '0x7FF9B884153d7C9B4bFB2Eb9f1582774c3E6EE17',
  } as const

export const isSquidAdapterChainId = (
  chainId: ChainId,
): chainId is SquidAdapterChainId =>
  SQUID_ADAPTER_SUPPORTED_CHAIN_IDS.includes(chainId as SquidAdapterChainId)
