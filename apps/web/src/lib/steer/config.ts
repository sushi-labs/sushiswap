import { EvmChainId } from 'sushi/evm'

// TODO: get from graph-client

export const STEER_SUPPORTED_CHAIN_IDS = [
  EvmChainId.POLYGON,
  EvmChainId.BSC,
  EvmChainId.OPTIMISM,
  EvmChainId.ARBITRUM,
  EvmChainId.THUNDERCORE,
  EvmChainId.METIS,
  EvmChainId.BASE,
  EvmChainId.AVALANCHE,
  EvmChainId.POLYGON_ZKEVM,
  // EvmChainId.CELO, // No V3 Celo deployment yet
  EvmChainId.KAVA,
  EvmChainId.LINEA,
  EvmChainId.SCROLL,
  EvmChainId.FANTOM,
  EvmChainId.BLAST,
  EvmChainId.ROOTSTOCK,
  EvmChainId.FILECOIN,
]

export const SteerChainIds = STEER_SUPPORTED_CHAIN_IDS

export type SteerChainId = (typeof STEER_SUPPORTED_CHAIN_IDS)[number]

export const isSteerChainId = (chainId: number): chainId is SteerChainId =>
  STEER_SUPPORTED_CHAIN_IDS.includes(chainId as SteerChainId)

export const STEER_PERIPHERY_ADDRESS: Record<SteerChainId, `0x${string}`> = {
  [EvmChainId.POLYGON]: '0x29E1888F7DD0757f2873E494463Ec389dab38D27',
  [EvmChainId.BSC]: '0xe240B9a2936f6Fb8860219bC059349e50F03492e',
  [EvmChainId.OPTIMISM]: '0x7c464A0AB1f5ebf3E2dCccfec7EF41D02ED7a2f4',
  [EvmChainId.ARBITRUM]: '0x806c2240793b3738000fcb62C66BF462764B903F',
  [EvmChainId.THUNDERCORE]: '0xab36D30C1A1C683037Bd7AAC67f29B2e3ECC6576',
  [EvmChainId.METIS]: '0x806c2240793b3738000fcb62C66BF462764B903F',
  [EvmChainId.BASE]: '0x16BA7102271dC83Fff2f709691c2B601DAD7668e',
  [EvmChainId.AVALANCHE]: '0x5D8249e3F5f702e1Fd720167b40424fc2daDCd1e',
  [EvmChainId.POLYGON_ZKEVM]: '0xcA19bEc25A41443F35EeAE03411Dce87D8c0Edc4',
  // [EvmChainId.CELO]: '0xdca3251Ebe8f85458E8d95813bCb816460e4bef1',
  [EvmChainId.KAVA]: '0xf90107890B640387ec3b0474F0c61674AEbCb510',
  [EvmChainId.LINEA]: '0x0C5c5BEB833fD382b04e039f151942DC3D9A60ce',
  [EvmChainId.SCROLL]: '0xD90c8970708FfdFC403bdb56636621e3E9CCe921',
  [EvmChainId.FANTOM]: '0xcb77e4C30D92c8b959811E99213625C7b9490b96',
  [EvmChainId.BLAST]: '0xdca3251Ebe8f85458E8d95813bCb816460e4bef1',
  [EvmChainId.ROOTSTOCK]: '0x37cff062d52dd6e9e39df619ccd30c037a36bb83',
  [EvmChainId.FILECOIN]: '0xab36D30C1A1C683037Bd7AAC67f29B2e3ECC6576',
}
