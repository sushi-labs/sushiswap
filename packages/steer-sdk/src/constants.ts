import { ChainId } from 'sushi/chain'

export const STEER_SUPPORTED_CHAIN_IDS = [
  ChainId.POLYGON,
  ChainId.BSC,
  ChainId.OPTIMISM,
  ChainId.ARBITRUM,
  ChainId.THUNDERCORE,
  ChainId.METIS,
  ChainId.BASE,
  ChainId.AVALANCHE,
  ChainId.POLYGON_ZKEVM,
  ChainId.CELO,
  ChainId.KAVA,
  ChainId.LINEA,
  ChainId.SCROLL,
  ChainId.FANTOM,
  ChainId.BLAST,
]

export const SteerChainIds = STEER_SUPPORTED_CHAIN_IDS

export type SteerChainId = (typeof STEER_SUPPORTED_CHAIN_IDS)[number]

export const isSteerChainId = (chainId: ChainId): chainId is SteerChainId =>
  STEER_SUPPORTED_CHAIN_IDS.includes(chainId as SteerChainId)

export const STEER_PERIPHERY_ADDRESS: Record<SteerChainId, `0x${string}`> = {
  [ChainId.POLYGON]: '0x29E1888F7DD0757f2873E494463Ec389dab38D27',
  [ChainId.BSC]: '0xe240B9a2936f6Fb8860219bC059349e50F03492e',
  [ChainId.OPTIMISM]: '0x7c464A0AB1f5ebf3E2dCccfec7EF41D02ED7a2f4',
  [ChainId.ARBITRUM]: '0x806c2240793b3738000fcb62C66BF462764B903F',
  [ChainId.THUNDERCORE]: '0xab36D30C1A1C683037Bd7AAC67f29B2e3ECC6576',
  [ChainId.METIS]: '0x806c2240793b3738000fcb62C66BF462764B903F',
  [ChainId.BASE]: '0x16BA7102271dC83Fff2f709691c2B601DAD7668e',
  [ChainId.AVALANCHE]: '0x5D8249e3F5f702e1Fd720167b40424fc2daDCd1e',
  [ChainId.POLYGON_ZKEVM]: '0xcA19bEc25A41443F35EeAE03411Dce87D8c0Edc4',
  [ChainId.CELO]: '0xdca3251Ebe8f85458E8d95813bCb816460e4bef1',
  [ChainId.KAVA]: '0xf90107890B640387ec3b0474F0c61674AEbCb510',
  [ChainId.LINEA]: '0x0C5c5BEB833fD382b04e039f151942DC3D9A60ce',
  [ChainId.SCROLL]: '0xD90c8970708FfdFC403bdb56636621e3E9CCe921',
  [ChainId.FANTOM]: '0xcb77e4C30D92c8b959811E99213625C7b9490b96',
  [ChainId.BLAST]: '0xdca3251Ebe8f85458E8d95813bCb816460e4bef1',
}

export const STEER_SUBGRAPH_URL: Record<SteerChainId, string> = {
  [ChainId.POLYGON]:
    'api.thegraph.com/subgraphs/name/steerprotocol/steer-protocol-polygon',
  [ChainId.BSC]:
    'api.thegraph.com/subgraphs/name/steerprotocol/steer-protocol-bsc',
  [ChainId.OPTIMISM]:
    'api.thegraph.com/subgraphs/name/steerprotocol/steer-protocol-optimism',
  [ChainId.ARBITRUM]:
    'api.thegraph.com/subgraphs/name/steerprotocol/steer-protocol-arbitrum',
  // [ChainId.Evmos]: 'subgraph.satsuma-prod.com/769a117cc018/steer/steer-protocol-evmos/api',
  [ChainId.THUNDERCORE]:
    'subgraph.steer.finance/thundercore/subgraphs/name/steerprotocol/steer-thundercore',
  [ChainId.METIS]:
    'subgraph.satsuma-prod.com/769a117cc018/steer/steer-protocol-metis/api',
  [ChainId.BASE]:
    'subgraph.satsuma-prod.com/769a117cc018/steer/steer-protocol-base/api',
  [ChainId.AVALANCHE]:
    'api.thegraph.com/subgraphs/name/rakeshbhatt10/avalance-test-subgraph',
  [ChainId.POLYGON_ZKEVM]:
    'subgraph.steer.finance/zkevm/subgraphs/name/steerprotocol/steer-zkevm',
  [ChainId.CELO]:
    'api.thegraph.com/subgraphs/name/rakeshbhatt10/steer-test-celo',
  [ChainId.KAVA]:
    'subgraph.steer.finance/kava/subgraphs/name/steerprotocol/steer-kava-evm',
  [ChainId.LINEA]:
    'subgraph.steer.finance/linea/subgraphs/name/steerprotocol/steer-linea',
  [ChainId.SCROLL]:
    'subgraph.steer.finance/scroll/subgraphs/name/steerprotocol/steer-scroll',
  [ChainId.FANTOM]:
    'https://api.thegraph.com/subgraphs/name/rakeshbhatt10/steer-protocol-fantom-test',
  [ChainId.BLAST]:
    'https://api.goldsky.com/api/public/project_clohj3ta78ok12nzs5m8yag0b/subgraphs/steer-protocol-blast/1.1.1/gn',
  // [ChainId.MANTA]: 'subgraph.steer.finance/manta/subgraphs/name/steerprotocol/steer-manta'
}
