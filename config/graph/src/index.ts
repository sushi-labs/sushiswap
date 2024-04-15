import { ChainId } from 'sushi/chain'

const MAX_FIRST_PARTIAL: Partial<Record<ChainId, number>> = {
  [ChainId.METIS]: 100,
}

export const MAX_FIRST = new Proxy(MAX_FIRST_PARTIAL, {
  get: (target, name: any) => {
    return name in target ? target[name as ChainId] : 1000
  },
}) as Record<ChainId, number>

export const TRIDENT_ENABLED_NETWORKS = [
  ChainId.OPTIMISM,
  ChainId.POLYGON,
  ChainId.KAVA,
  ChainId.METIS,
  ChainId.BTTC,
  ChainId.ARBITRUM,
  ChainId.AVALANCHE,
  ChainId.BSC,
] as const

export type TridentChainId = (typeof TRIDENT_ENABLED_NETWORKS)[number]

export const SUSHISWAP_ENABLED_NETWORKS = [
  ChainId.ARBITRUM,
  ChainId.AVALANCHE,
  ChainId.BSC,
  ChainId.CELO,
  ChainId.ETHEREUM,
  ChainId.FANTOM,
  ChainId.FUSE,
  ChainId.GNOSIS,
  ChainId.MOONBEAM,
  ChainId.MOONRIVER,
  ChainId.POLYGON,
  ChainId.HARMONY,
  ChainId.ARBITRUM_NOVA,
  ChainId.BOBA,
  // ChainId.BOBA_AVAX,
  ChainId.BOBA_BNB,
  ChainId.BASE,
  ChainId.SCROLL,
  ChainId.KAVA,
  ChainId.METIS,
  ChainId.BTTC,
  ChainId.FILECOIN,
  ChainId.ZETACHAIN,
  ChainId.THUNDERCORE,
  ChainId.CORE,
  ChainId.HAQQ,
  ChainId.OPTIMISM,
  ChainId.LINEA,
  ChainId.POLYGON_ZKEVM,
  ChainId.BLAST,
  // ChainId.PALM,
  // ChainId.HECO,
  // ChainId.OKEX
] as const

export type SushiSwapChainId = (typeof SUSHISWAP_ENABLED_NETWORKS)[number]

export const SUSHISWAP_V3_ENABLED_NETWORKS = [
  ChainId.ETHEREUM,
  ChainId.ARBITRUM_NOVA,
  ChainId.ARBITRUM,
  ChainId.AVALANCHE,
  ChainId.BSC,
  ChainId.BOBA,
  ChainId.FANTOM,
  ChainId.FUSE,
  ChainId.GNOSIS,
  ChainId.MOONRIVER,
  ChainId.OPTIMISM,
  ChainId.POLYGON,
  ChainId.POLYGON_ZKEVM,
  ChainId.THUNDERCORE,
  ChainId.CORE,
  ChainId.BASE,
  ChainId.LINEA,
  ChainId.SCROLL,
  ChainId.KAVA,
  ChainId.METIS,
  ChainId.BTTC,
  ChainId.FILECOIN,
  ChainId.HAQQ,
  ChainId.ZETACHAIN,
  ChainId.BLAST,
]
export type SushiSwapV3ChainId = (typeof SUSHISWAP_V3_ENABLED_NETWORKS)[number]

export const SWAP_ENABLED_NETWORKS = Array.from(
  new Set([
    ...SUSHISWAP_ENABLED_NETWORKS,
    ...SUSHISWAP_V3_ENABLED_NETWORKS,
    ...TRIDENT_ENABLED_NETWORKS,
  ]),
)

export type SwapSupportedChainIds = typeof SWAP_ENABLED_NETWORKS
export type SwapSupportedChainId = SwapSupportedChainIds[number]

export const GRAPH_HOST = 'api.thegraph.com/subgraphs/name'
export const PENDING_GRAPH_HOST = 'api.thegraph.com/subgraphs/id'

export const KAVA_HOST = 'pvt.graph.kava.io/subgraphs/name'
export const PENDING_KAVA_HOST = 'pvt.graph.kava.io/subgraphs/id'

export const METIS_HOST = 'andromeda.thegraph.metis.io/subgraphs/name'
export const PENDING_METIS_HOST = 'andromeda.thegraph.metis.io/subgraphs/id'

export const FILECOIN_HOST = 'sushi.laconic.com/subgraphs/name'
export const STUDIO_HOST = 'api.studio.thegraph.com/query/32073'
export const THUNDERCORE_HOST = 'graph-node.thundercore.com/subgraphs/name'
export const CORE_HOST = 'thegraph.coredao.org/subgraphs/name'
export const LINEA_HOST = 'graph-query.linea.build/subgraphs/name'
export const HAQQ_HOST = 'haqq.graph.p2p.org/subgraphs/name'
export const ZETACHAIN_HOST =
  'api.goldsky.com/api/public/project_cls39ugcfyhbq01xl9tsf6g38/subgraphs'
export const SUSHI_GOLDSKY_HOST =
  'api.goldsky.com/api/public/project_clslspm3c0knv01wvgfb2fqyq/subgraphs'
export const GOLDSKY_COMMUNITY_HOST =
  'api.goldsky.com/api/public/project_cl8ylkiw00krx0hvza0qw17vn/subgraphs'

export const CHAIN_NAME: Record<number, string> = {
  [ChainId.ARBITRUM]: 'Arbitrum',
  [ChainId.AVALANCHE]: 'Avalanche',
  [ChainId.BSC]: 'Bsc',
  [ChainId.ETHEREUM]: 'Ethereum',
  [ChainId.FANTOM]: 'Fantom',
  [ChainId.GNOSIS]: 'Gnosis',
  // [ChainId.GÖRLI]: 'Görli',
  [ChainId.HARMONY]: 'Harmony',
  [ChainId.MOONBEAM]: 'Moonbeam',
  [ChainId.MOONRIVER]: 'Moonriver',
  [ChainId.OPTIMISM]: 'Optimism',
  [ChainId.POLYGON]: 'Polygon',
  [ChainId.TELOS]: 'Telos',
  [ChainId.CELO]: 'Celo',
  [ChainId.FUSE]: 'Fuse',
  [ChainId.OKEX]: 'OKEx',
  [ChainId.HECO]: 'HECO',
  [ChainId.PALM]: 'Palm',
  [ChainId.KAVA]: 'Kava',
  [ChainId.METIS]: 'Metis',
  [ChainId.BOBA]: 'Boba',
  [ChainId.ARBITRUM_NOVA]: 'Arbitrum Nova',
  [ChainId.BOBA_AVAX]: 'Boba Avax',
  [ChainId.BOBA_BNB]: 'Boba BNB',
  [ChainId.BTTC]: 'BitTorrent',
  [ChainId.THUNDERCORE]: 'ThunderCore',
  [ChainId.POLYGON_ZKEVM]: 'Polygon zkEVM',
  [ChainId.CORE]: 'Core',
  [ChainId.BASE]: 'Base',
  [ChainId.LINEA]: 'Linea',
  [ChainId.SCROLL]: 'Scroll',
  [ChainId.FILECOIN]: 'Filecoin',
  [ChainId.HAQQ]: 'HAQQ',
  [ChainId.ZETACHAIN]: 'ZetaChain',
  [ChainId.BLAST]: 'Blast',
} as const

export const SUBGRAPH_HOST: Record<number, string> = {
  [ChainId.ARBITRUM]: GRAPH_HOST,
  [ChainId.ARBITRUM_NOVA]: SUSHI_GOLDSKY_HOST,
  [ChainId.AVALANCHE]: GRAPH_HOST,
  [ChainId.BSC]: GRAPH_HOST,
  [ChainId.CELO]: GRAPH_HOST,
  [ChainId.ETHEREUM]: GRAPH_HOST,
  [ChainId.FANTOM]: GRAPH_HOST,
  [ChainId.FUSE]: GRAPH_HOST,
  [ChainId.GNOSIS]: GRAPH_HOST,
  // [ChainId.GÖRLI]: GRAPH_HOST,
  [ChainId.HARMONY]: GRAPH_HOST,
  [ChainId.KAVA]: KAVA_HOST,
  [ChainId.METIS]: METIS_HOST,
  [ChainId.MOONBEAM]: GRAPH_HOST,
  [ChainId.MOONRIVER]: GRAPH_HOST,
  [ChainId.OPTIMISM]: GRAPH_HOST,
  [ChainId.POLYGON]: GRAPH_HOST,
  [ChainId.POLYGON_ZKEVM]: STUDIO_HOST,
  [ChainId.BOBA]: GRAPH_HOST,
  // [ChainId.BOBA_AVAX]: SUSHI_HOST,
  [ChainId.BOBA_BNB]: SUSHI_GOLDSKY_HOST,
  [ChainId.BTTC]: SUSHI_GOLDSKY_HOST,
  [ChainId.OKEX]: '',
  [ChainId.HECO]: '',
  // [ChainId.KOVAN]: '',
  [ChainId.THUNDERCORE]: THUNDERCORE_HOST,
  [ChainId.CORE]: CORE_HOST,
  [ChainId.BASE]: STUDIO_HOST,
  [ChainId.LINEA]: LINEA_HOST,
  [ChainId.SCROLL]: STUDIO_HOST,
  [ChainId.FILECOIN]: FILECOIN_HOST,
  [ChainId.HAQQ]: HAQQ_HOST,
  [ChainId.ZETACHAIN]: ZETACHAIN_HOST,
  [ChainId.BLAST]: SUSHI_GOLDSKY_HOST,
} as const

export const BENTOBOX_ENABLED_NETWORKS = [
  ChainId.ETHEREUM,
  ChainId.POLYGON,
  ChainId.AVALANCHE,
  ChainId.BSC,
  ChainId.FANTOM,
  ChainId.GNOSIS,
  ChainId.ARBITRUM,
  ChainId.CELO,
  ChainId.MOONRIVER,
  ChainId.MOONBEAM,
  ChainId.OPTIMISM,
  ChainId.HARMONY,
  ChainId.KAVA,
  ChainId.BTTC,
] as const

export const bentoBoxChainIds = BENTOBOX_ENABLED_NETWORKS

export type BentoBoxChainId = (typeof BENTOBOX_ENABLED_NETWORKS)[number]

export const isBentoBoxChainId = (
  chainId: ChainId,
): chainId is BentoBoxChainId =>
  BENTOBOX_ENABLED_NETWORKS.includes(chainId as BentoBoxChainId)

export const BENTOBOX_SUBGRAPH_URL: Record<BentoBoxChainId, string> = {
  [ChainId.ETHEREUM]: `${GRAPH_HOST}/sushiswap/bentobox-ethereum`,
  [ChainId.POLYGON]: `${GRAPH_HOST}/sushiswap/bentobox-polygon`,
  [ChainId.AVALANCHE]: `${GRAPH_HOST}/sushiswap/bentobox-avalanche`,
  [ChainId.BSC]: `${GRAPH_HOST}/sushiswap/bentobox-bsc`,
  [ChainId.FANTOM]: `${GRAPH_HOST}/sushiswap/bentobox-fantom`,
  [ChainId.GNOSIS]: `${GRAPH_HOST}/sushiswap/bentobox-gnosis`,
  [ChainId.ARBITRUM]: `${GRAPH_HOST}/sushiswap/bentobox-arbitrum`,
  [ChainId.CELO]: `${GRAPH_HOST}/sushiswap/bentobox-celo`,
  [ChainId.MOONRIVER]: `${GRAPH_HOST}/sushiswap/bentobox-moonriver`,
  [ChainId.MOONBEAM]: `${GRAPH_HOST}/sushiswap/bentobox-moonbeam`,
  [ChainId.OPTIMISM]: `${GRAPH_HOST}/sushiswap/bentobox-optimism`,
  [ChainId.HARMONY]: `${GRAPH_HOST}/sushiswap/bentobox-harmony`,
  [ChainId.KAVA]: `${KAVA_HOST}/sushiswap/bentobox-kava`,
  [ChainId.BTTC]: `${SUSHI_GOLDSKY_HOST}/sushiswap/bentobox-bttc/gn`,
}

export const BLOCKS_SUBGRAPH_URL: Record<number, string> = {
  [ChainId.ETHEREUM]: `${GRAPH_HOST}/blocklytics/ethereum-blocks`,
  [ChainId.GNOSIS]: `${GRAPH_HOST}/matthewlilley/xdai-blocks`,
  [ChainId.POLYGON]: `${GRAPH_HOST}/matthewlilley/polygon-blocks`,
  [ChainId.POLYGON_ZKEVM]: `${STUDIO_HOST}/blocks-polygon-zkevm/v0.0.2`,
  [ChainId.FANTOM]: `${GRAPH_HOST}/matthewlilley/fantom-blocks`,
  [ChainId.BSC]: `${GRAPH_HOST}/matthewlilley/bsc-blocks`,
  [ChainId.HARMONY]: `${GRAPH_HOST}/sushiswap/harmony-blocks`,
  [ChainId.AVALANCHE]: `${GRAPH_HOST}/matthewlilley/avalanche-blocks`,
  [ChainId.CELO]: `${GRAPH_HOST}/ubeswap/celo-blocks`,
  [ChainId.ARBITRUM]: `${GRAPH_HOST}/sushiswap/arbitrum-blocks`,
  // [ChainId.OKEX]: `${GRAPH_HOST}/okexchain-blocks/oec`,
  // [ChainId.HECO]: `${GRAPH_HOST}/hecoblocks/heco`,
  [ChainId.MOONRIVER]: `${GRAPH_HOST}/sushiswap/moonriver-blocks`,
  [ChainId.FUSE]: `${GRAPH_HOST}/sushiswap/fuse-blocks`,
  // [ChainId.KOVAN]: `${GRAPH_HOST}/blocklytics/kovan-blocks`,
  [ChainId.MOONBEAM]: `${GRAPH_HOST}/sushiswap/moonbeam-blocks`,
  [ChainId.OPTIMISM]: `${GRAPH_HOST}/beethovenxfi/optimism-blocks`,
  [ChainId.KAVA]: `${KAVA_HOST}/sushiswap/blocks-kava`,
  [ChainId.METIS]: `${METIS_HOST}/sushiswap/blocks-metis`,
  [ChainId.ARBITRUM_NOVA]: `${GOLDSKY_COMMUNITY_HOST}/blocks/arbitrum-nova/gn`,
  [ChainId.BOBA]: `${GRAPH_HOST}/sushiswap/blocks-boba`,
  [ChainId.BOBA_BNB]: `${GOLDSKY_COMMUNITY_HOST}/blocks/boba-bnb/gn`,
  [ChainId.BTTC]: `${GOLDSKY_COMMUNITY_HOST}/blocks/bttc-mainnet/gn`,
  [ChainId.THUNDERCORE]: `${THUNDERCORE_HOST}/sushiswap/blocks-thundercore`,
  [ChainId.CORE]: `${CORE_HOST}/sushiswap/blocks-core`,
  [ChainId.BASE]: `${STUDIO_HOST}/blocks-base/v0.0.1`,
  [ChainId.LINEA]: `${LINEA_HOST}/sushiswap/blocks-linea`,
  [ChainId.SCROLL]: `${STUDIO_HOST}/blocks-scroll/v0.0.1`,
  [ChainId.FILECOIN]: `${FILECOIN_HOST}/sushiswap/blocks`,
  [ChainId.HAQQ]: `${HAQQ_HOST}/sushi/blocks-haqq`,
  [ChainId.ZETACHAIN]: `${ZETACHAIN_HOST}/blocks-zetachain/1.0.0/gn`,
  [ChainId.BLAST]: `${SUSHI_GOLDSKY_HOST}/sushiswap/blocks-blast/gn`,
} as const

export const SECONDS_BETWEEN_BLOCKS: Record<number, number> = {
  [ChainId.ETHEREUM]: 12,
  [ChainId.GNOSIS]: 5,
  [ChainId.POLYGON]: 2,
  [ChainId.POLYGON_ZKEVM]: 5,
  [ChainId.FANTOM]: 2,
  [ChainId.BSC]: 3,
  [ChainId.HARMONY]: 2,
  [ChainId.AVALANCHE]: 2,
  [ChainId.CELO]: 5,
  [ChainId.ARBITRUM]: 0.25,
  [ChainId.OKEX]: 3.8,
  [ChainId.HECO]: 3,
  [ChainId.MOONRIVER]: 12.2,
  [ChainId.FUSE]: 5,
  // [ChainId.KOVAN]: 4,
  [ChainId.MOONBEAM]: 12.2,
  [ChainId.OPTIMISM]: 2,
  [ChainId.KAVA]: 6.3,
  [ChainId.METIS]: 4.5,
  [ChainId.ARBITRUM_NOVA]: 1,
  [ChainId.BOBA]: 250,
  [ChainId.BOBA_AVAX]: 612,
  [ChainId.BOBA_BNB]: 0.5,
  [ChainId.BTTC]: 2,
  [ChainId.THUNDERCORE]: 1,
  [ChainId.SCROLL]: 3,
} as const

export const SUSHISWAP_SUBGRAPH_URL: Record<number, string> = {
  [ChainId.ETHEREUM]: `${GRAPH_HOST}/sushi-v2/sushiswap-ethereum`,
  [ChainId.AVALANCHE]: `${GRAPH_HOST}/sushi-v2/sushiswap-avalanche`,
  [ChainId.ARBITRUM]: `${GRAPH_HOST}/sushi-v2/sushiswap-arbitrum`,
  [ChainId.BSC]: `${GRAPH_HOST}/sushi-v2/sushiswap-bsc`,
  [ChainId.CELO]: `${GRAPH_HOST}/sushi-v2/sushiswap-celo`,
  [ChainId.FANTOM]: `${GRAPH_HOST}/sushi-v2/sushiswap-fantom`,
  [ChainId.FUSE]: `${GRAPH_HOST}/sushi-v2/sushiswap-fuse`,
  [ChainId.GNOSIS]: `${GRAPH_HOST}/sushi-v2/sushiswap-gnosis`,
  [ChainId.MOONBEAM]: `${GRAPH_HOST}/sushi-v2/sushiswap-moonbeam`,
  [ChainId.MOONRIVER]: `${GRAPH_HOST}/sushi-v2/sushiswap-moonriver`,
  [ChainId.HARMONY]: `${GRAPH_HOST}/olastenberg/sushiswap-harmony-fix`,
  [ChainId.ARBITRUM_NOVA]: `${SUSHI_GOLDSKY_HOST}/sushi-0m/sushiswap-arbitrum-nova/gn`,
  [ChainId.OPTIMISM]: `${GRAPH_HOST}/sushi-subgraphs/sushiswap-optimism`,
  [ChainId.BOBA]: `${GRAPH_HOST}/sushi-v2/sushiswap-boba`,
  [ChainId.POLYGON]: `${GRAPH_HOST}/sushi-v2/sushiswap-polygon`,
  [ChainId.BOBA_BNB]: `${SUSHI_GOLDSKY_HOST}/sushi-0m/sushiswap-boba-bnb/gn`,
  [ChainId.BASE]: `${STUDIO_HOST}/sushiswap-base/v0.0.1`,
  [ChainId.SCROLL]: `${STUDIO_HOST}/sushiswap-scroll/v0.0.1`,
  [ChainId.KAVA]: `${KAVA_HOST}/sushi-v2/sushiswap-kava`,
  [ChainId.METIS]: `${METIS_HOST}/sushi-v2/sushiswap-metis`,
  [ChainId.BTTC]: `${SUSHI_GOLDSKY_HOST}/sushi-v2/sushiswap-bttc/gn`,
  [ChainId.FILECOIN]: `${FILECOIN_HOST}/sushiswap/sushiswap-filecoin`,
  [ChainId.ZETACHAIN]: `${ZETACHAIN_HOST}/sushiswap-zetachain/1.0.0/gn`,
  [ChainId.THUNDERCORE]: `${GRAPH_HOST}/sushi-v2/sushiswap-thundercore`,
  [ChainId.CORE]: `${CORE_HOST}/sushi-v2/sushiswap-core`,
  [ChainId.HAQQ]: `${HAQQ_HOST}/sushi/sushiswap-haqq`,
  [ChainId.LINEA]: `${LINEA_HOST}/sushiswap/sushiswap-linea`,
  [ChainId.POLYGON_ZKEVM]: `${STUDIO_HOST}/v2-polygon-zkevm/v0.0.1`,
  [ChainId.BLAST]: `${SUSHI_GOLDSKY_HOST}/sushiswap/sushiswap-blast/gn`,
} as const

export const SUSHISWAP_V3_SUBGRAPH_URL: Record<number, string> = {
  [ChainId.ARBITRUM_NOVA]: `${SUSHI_GOLDSKY_HOST}/sushi-v3/v3-arbitrum-nova/gn`,
  [ChainId.ARBITRUM]: `${GRAPH_HOST}/sushi-v3/v3-arbitrum`,
  [ChainId.AVALANCHE]: `${GRAPH_HOST}/sushi-v3/v3-avalanche`,
  [ChainId.BSC]: `${GRAPH_HOST}/sushi-v3/v3-bsc`,
  [ChainId.BOBA]: `${GRAPH_HOST}/sushi-v3/v3-boba`,
  [ChainId.ETHEREUM]: `${GRAPH_HOST}/sushi-v3/v3-ethereum`,
  [ChainId.FANTOM]: `${GRAPH_HOST}/sushi-v3/v3-fantom`,
  [ChainId.FUSE]: `${GRAPH_HOST}/sushi-v3/v3-fuse`,
  [ChainId.GNOSIS]: `${GRAPH_HOST}/sushi-v3/v3-gnosis`,
  [ChainId.MOONRIVER]: `${GRAPH_HOST}/sushi-v3/v3-moonriver`,
  [ChainId.OPTIMISM]: `${GRAPH_HOST}/sushi-v3/v3-optimism`,
  [ChainId.POLYGON]: `${GRAPH_HOST}/sushi-v3/v3-polygon`,
  [ChainId.POLYGON_ZKEVM]: `${STUDIO_HOST}/v3-polygon-zkevm/v0.0.2`,
  [ChainId.THUNDERCORE]: `${THUNDERCORE_HOST}/sushi-v3/v3-thundercore`,
  [ChainId.CORE]: `${CORE_HOST}/sushi-v3/v3-core-fix`,
  [ChainId.BASE]: `${STUDIO_HOST}/v3-base/v0.0.1`,
  [ChainId.LINEA]: `${LINEA_HOST}/sushi-v3/v3-linea`,
  [ChainId.SCROLL]: `${STUDIO_HOST}/v3-scroll/v0.0.1`,
  [ChainId.KAVA]: `${KAVA_HOST}/sushi-v3/v3-kava`,
  [ChainId.METIS]: `${METIS_HOST}/sushi-v3/v3-metis`,
  [ChainId.BTTC]: `${SUSHI_GOLDSKY_HOST}/sushi-v3/v3-bttc/gn`,
  [ChainId.FILECOIN]: `${FILECOIN_HOST}/sushiswap/v3-filecoin`,
  [ChainId.HAQQ]: `${HAQQ_HOST}/sushi/v3-haqq`,
  [ChainId.ZETACHAIN]: `${ZETACHAIN_HOST}/v3-zetachain/1.0.0/gn`,
  [ChainId.BLAST]: `${SUSHI_GOLDSKY_HOST}/sushiswap/v3-blast/gn`,
}

export const TRIDENT_SUBGRAPH_URL: Record<number, string> = {
  [ChainId.POLYGON]: `${GRAPH_HOST}/sushi-v2/trident-polygon`,
  [ChainId.OPTIMISM]: `${GRAPH_HOST}/sushi-v2/trident-optimism`,
  [ChainId.KAVA]: `${KAVA_HOST}/sushi-qa/trident-kava`,
  [ChainId.METIS]: `${METIS_HOST}/sushi-v2/trident-metis`,
  [ChainId.BTTC]: `${SUSHI_GOLDSKY_HOST}/sushi-v2/trident-bttc/gn`,
  [ChainId.ARBITRUM]: `${GRAPH_HOST}/sushi-v2/trident-arbitrum`,
  [ChainId.BSC]: `${GRAPH_HOST}/sushi-v2/trident-bsc`,
  [ChainId.AVALANCHE]: `${GRAPH_HOST}/sushi-v2/trident-avalanche`,
} as const

export const MINICHEF_SUBGRAPH_URL = {
  [ChainId.POLYGON]: `${GRAPH_HOST}/jiro-ono/minichef-staging-updates`, // new trident subgraph not synced yet
  [ChainId.GNOSIS]: `${GRAPH_HOST}/jiro-ono/gnosis-minichef-staging`,
  // [ChainId.HARMONY]: `${GRAPH_HOST}/sushiswap/harmony-minichef`, // subgraph broken
  [ChainId.ARBITRUM]: `${GRAPH_HOST}/jiro-ono/arbitrum-minichef-staging`,
  [ChainId.CELO]: `${GRAPH_HOST}/sushiswap/celo-minichef-v2`,
  [ChainId.MOONRIVER]: `${GRAPH_HOST}/sushiswap/moonriver-minichef`,
  [ChainId.FUSE]: `${GRAPH_HOST}/sushiswap/fuse-minichef`,
  [ChainId.FANTOM]: `${GRAPH_HOST}/sushiswap/fantom-minichef`,
  [ChainId.MOONBEAM]: `${GRAPH_HOST}/sushiswap/moonbeam-minichef`,
  [ChainId.KAVA]: `${KAVA_HOST}/sushiswap/kava-minichef`, //block subgraph not synced yet
  [ChainId.METIS]: `${METIS_HOST}/sushiswap/metis-minichef`,
  [ChainId.BOBA]: `${GRAPH_HOST}/sushiswap/minichef-boba`,
  [ChainId.ARBITRUM_NOVA]: `${SUSHI_GOLDSKY_HOST}/sushiswap/minichef-arbitrum-nova/gn`,
  [ChainId.BTTC]: `${SUSHI_GOLDSKY_HOST}/sushiswap/minichef-bttc/gn`,
  [ChainId.OPTIMISM]: `${GRAPH_HOST}/sushiswap/minichef-optimism`,
  [ChainId.AVALANCHE]: `${GRAPH_HOST}/sushiswap/minichef-avalanche`,
  [ChainId.BSC]: `${GRAPH_HOST}/sushiswap/minichef-bsc`,
} as const

export const MASTERCHEF_V1_SUBGRAPH_NAME =
  'jiro-ono/masterchef-staging' as const
export const MASTERCHEF_V2_SUBGRAPH_NAME = 'sushiswap/master-chefv2' as const

export const MASTERCHEF_V1_SUBGRAPH_URL =
  `${GRAPH_HOST}/jiro-ono/masterchef-staging` as const
export const MASTERCHEF_V2_SUBGRAPH_URL =
  `${GRAPH_HOST}sushiswap/master-chefv2` as const

export const FURO_ENABLED_NETWORKS = [
  ChainId.ETHEREUM,
  ChainId.ARBITRUM,
  ChainId.AVALANCHE,
  ChainId.BSC,
  ChainId.FANTOM,
  ChainId.GNOSIS,
  ChainId.HARMONY,
  ChainId.MOONBEAM,
  ChainId.MOONRIVER,
  ChainId.OPTIMISM,
  ChainId.POLYGON,
] as const

export const FURO_SUBGRAPH_URL: Record<string, string> = {
  [ChainId.ETHEREUM]: `${GRAPH_HOST}/sushi-subgraphs/furo-ethereum`,
  // [ChainId.GÖRLI]: `${GRAPH_HOST}/sushi-subgraphs/furo-goerli`,
  [ChainId.ARBITRUM]: `${GRAPH_HOST}/sushi-subgraphs/furo-arbitrum`,
  [ChainId.AVALANCHE]: `${GRAPH_HOST}/sushi-subgraphs/furo-avalanche`,
  [ChainId.BSC]: `${GRAPH_HOST}/sushi-subgraphs/furo-bsc`,
  [ChainId.FANTOM]: `${GRAPH_HOST}/sushi-subgraphs/furo-fantom`,
  [ChainId.GNOSIS]: `${GRAPH_HOST}/sushi-subgraphs/furo-gnosis`,
  [ChainId.HARMONY]: `${GRAPH_HOST}/sushi-subgraphs/furo-harmony`,
  [ChainId.MOONBEAM]: `${GRAPH_HOST}/sushi-subgraphs/furo-moonbeam`,
  [ChainId.MOONRIVER]: `${GRAPH_HOST}/sushi-subgraphs/furo-moonriver`,
  [ChainId.OPTIMISM]: `${GRAPH_HOST}/sushi-subgraphs/furo-optimism`,
  [ChainId.POLYGON]: `${GRAPH_HOST}/sushi-subgraphs/furo-polygon`,
} as const

export const KASHI_SUBGRAPH_NAME: Record<number, string> = {
  [ChainId.ARBITRUM]: 'sushiswap/kashi-arbitrum',
} as const

export const CONCENTRATED_SUBGRAPH_NAME: Record<number, string> = {
  [ChainId.ETHEREUM]: 'uniswap/uniswap-v3',
  [ChainId.ARBITRUM]: 'ianlapham/arbitrum-minimal',
}

export const DEFAULT_CHAIN_ID = ChainId.ETHEREUM
export const DEFAULT_CHAIN_NAME = CHAIN_NAME[DEFAULT_CHAIN_ID]

export const isTridentChain = (chainId: ChainId): chainId is TridentChainId =>
  Object.keys(TRIDENT_SUBGRAPH_URL).map(Number).includes(chainId)

export const isSushiSwapChain = (
  chainId: ChainId,
): chainId is SushiSwapChainId =>
  Object.keys(SUSHISWAP_SUBGRAPH_URL).map(Number).includes(chainId)

export const isSushiSwapV3Chain = (
  chainId: ChainId,
): chainId is SushiSwapV3ChainId =>
  Object.keys(SUSHISWAP_V3_SUBGRAPH_URL).map(Number).includes(chainId)

export const EXCHANGE_SUBGRAPH_NAME: Record<number, string> = {
  [ChainId.AVALANCHE]: 'sushiswap/exchange-avalanche',
  [ChainId.ARBITRUM]: 'sushiswap/exchange-arbitrum-backup',
  [ChainId.BSC]: 'sushiswap/bsc-exchange',
  [ChainId.CELO]: 'sushiswap/exchange-celo',
  [ChainId.ETHEREUM]: 'sushiswap/exchange-ethereum',
  [ChainId.FANTOM]: 'sushiswap/exchange-fantom',
  [ChainId.FUSE]: 'sushiswap/exchange-fuse',
  [ChainId.GNOSIS]: 'sushiswap/xdai-exchange',
  [ChainId.MOONBEAM]: 'sushiswap/exchange-moonbeam',
  [ChainId.MOONRIVER]: 'sushiswap/exchange-moonriver',
  [ChainId.HARMONY]: 'sushiswap/exchange-harmony',
  [ChainId.ARBITRUM_NOVA]: 'sushi-0m/sushiswap-arbitrum-nova',
  [ChainId.POLYGON]: 'sushiswap/exchange-polygon',
  [ChainId.BOBA]: 'sushi-0m/sushiswap-boba',
  [ChainId.BOBA_AVAX]: 'sushi-0m/sushiswap-boba-avax',
  [ChainId.BOBA_BNB]: 'sushi-0m/sushiswap-boba-bnb',
} as const
