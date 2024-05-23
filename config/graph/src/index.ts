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
  ChainId.SKALE_EUROPA,
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
  ChainId.SKALE_EUROPA,
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
export const HAQQ_HOST = 'haqq.graph.p2p.org/subgraphs/name'
export const PCS_STUDIO_HOST = 'api.studio.thegraph.com/query/45376'
export const SUSHI_GOLDSKY_HOST =
  'api.goldsky.com/api/public/project_cls39ugcfyhbq01xl9tsf6g38/subgraphs'
export const SUSHI_DEDICATED_GOLDSKY_HOST =
  'api.goldsky.com/api/public/project_clslspm3c0knv01wvgfb2fqyq/subgraphs'
export const GOLDSKY_COMMUNITY_HOST =
  'api.goldsky.com/api/public/project_cl8ylkiw00krx0hvza0qw17vn/subgraphs'
export const WAGMI_METIS_HOST = 'metis.graph.wagmi.com/subgraphs/name'
export const METIS_0XGRAPH_HOST = 'metisapi.0xgraph.xyz/subgraphs/name'
export const SKALE_HOST =
  'elated-tan-skat-graph.skalenodes.com:8000/subgraphs/name'

const SUSHI_DOMAIN_RESTRICTED_API_KEY = '5d5d00365d2b8f675e12952d6eb5b9b0'
export const DECENTRALIZED_NETWORK_HOST = `gateway-arbitrum.network.thegraph.com/api/${
  process.env['SUSHI_GRAPH_KEY'] ?? SUSHI_DOMAIN_RESTRICTED_API_KEY
}/subgraphs/id`

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
  [ChainId.SKALE_EUROPA]: 'Skale Europa',
} as const

export const SUBGRAPH_HOST: Record<number, string> = {
  [ChainId.ARBITRUM]: GRAPH_HOST,
  [ChainId.ARBITRUM_NOVA]: SUSHI_DEDICATED_GOLDSKY_HOST,
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
  [ChainId.BOBA_BNB]: SUSHI_DEDICATED_GOLDSKY_HOST,
  [ChainId.BTTC]: SUSHI_DEDICATED_GOLDSKY_HOST,
  [ChainId.OKEX]: '',
  [ChainId.HECO]: '',
  // [ChainId.KOVAN]: '',
  [ChainId.THUNDERCORE]: THUNDERCORE_HOST,
  [ChainId.CORE]: CORE_HOST,
  [ChainId.BASE]: STUDIO_HOST,
  [ChainId.LINEA]: DECENTRALIZED_NETWORK_HOST,
  [ChainId.SCROLL]: STUDIO_HOST,
  [ChainId.FILECOIN]: FILECOIN_HOST,
  [ChainId.HAQQ]: HAQQ_HOST,
  [ChainId.ZETACHAIN]: SUSHI_GOLDSKY_HOST,
  [ChainId.BLAST]: SUSHI_DEDICATED_GOLDSKY_HOST,
  [ChainId.SKALE_EUROPA]: SKALE_HOST,
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

export const BENTOBOX_SUBGRAPH_URL: Record<number, string> = {
  [ChainId.ETHEREUM]: `${DECENTRALIZED_NETWORK_HOST}/8HYeoDopVqqvb5RJEV2TtSzFsouYPz8cownnG3mbhiGy`,
  [ChainId.POLYGON]: `${DECENTRALIZED_NETWORK_HOST}/6kJg5kFoQY8B8Ge2hqswHMqZDcmsR1TLUUz7AKov69fy`,
  [ChainId.AVALANCHE]: `${DECENTRALIZED_NETWORK_HOST}/EhYaJodF1WQjKgxx1ZC63goeCwp5swD4AQRdaKXBm2xk`,
  [ChainId.BSC]: `${DECENTRALIZED_NETWORK_HOST}/BggyE3r5snDsjx19jgZcbiBH7cbtrkpjvyGLFHMdXekd`,
  [ChainId.FANTOM]: `${DECENTRALIZED_NETWORK_HOST}/AWD9Ca7KNZg7grfWosKTRqZTjPrJVgS5P5b37pDpN4CT`,
  [ChainId.GNOSIS]: `${DECENTRALIZED_NETWORK_HOST}/9jn9kA6SKCNxXQSqb93zZPLdLaru4FeZBwLNWAK4nfZ2`,
  [ChainId.ARBITRUM]: `${DECENTRALIZED_NETWORK_HOST}/JZFyMKR4jnsFQ58q7dT6nbXenTzNgE176zTejc6Gf8Z`,
  [ChainId.CELO]: `${DECENTRALIZED_NETWORK_HOST}/5DwkvjxPGVFFaWEMM68g1yztDdhCgJEYAxS6FuhkajzR`,
  [ChainId.MOONRIVER]: `${DECENTRALIZED_NETWORK_HOST}/73XEV6UQKpPSJn68WZBAYTwALcZtFJkFYn58ZoZUb7tn`,
  [ChainId.MOONBEAM]: `${DECENTRALIZED_NETWORK_HOST}/7wA5gqWNP4E1dPWBsTYvz5eQSDbtYDFgyU5BGdHr2UKp`,
  [ChainId.OPTIMISM]: `${DECENTRALIZED_NETWORK_HOST}/8b4Hy4Kn7jCNAf9JFrqHb24LsqmapG4HrAsCrwdJf9Nu`,
  [ChainId.HARMONY]: `${DECENTRALIZED_NETWORK_HOST}/Bioj7N3Rf2n7iBq9PVoaMie3WiuzPze9NMi7aSye7LFc`,
  [ChainId.BTTC]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushiswap/bentobox-bttc/gn`,
}

export const BLOCKS_SUBGRAPH_URL: Record<number, string> = {
  [ChainId.ETHEREUM]: `${DECENTRALIZED_NETWORK_HOST}/236pc6mnPH2EdGJxR5wunibyGsagq1JsSx5e2hx5tdoE`,
  [ChainId.GNOSIS]: `${DECENTRALIZED_NETWORK_HOST}/8ZD25Ff1efVjqHkGmPdgn7oevwe3FkSB7WFygyNEsAco`,
  [ChainId.POLYGON]: `${DECENTRALIZED_NETWORK_HOST}/HHpzhtyGrTNSbhtjgZyYG4aG538fKpV21dsCBshLnKDg`,
  [ChainId.POLYGON_ZKEVM]: `${DECENTRALIZED_NETWORK_HOST}/5o79YFzT5h4v7oq5w2eHUytYj24Z96P1HzZbK25gw2Ug`,
  [ChainId.FANTOM]: `${DECENTRALIZED_NETWORK_HOST}/3drjZDpA9hAuYGA19ttEkhW432mVe2XHy5YarBDVYHbz`, // TODO: MIGHT NEED TO BE REPLACED. 2024-05-23: 52% synced
  [ChainId.BSC]: `${DECENTRALIZED_NETWORK_HOST}/9dSPXfKXaqYpoGAPXx96LyDF1VYR8PiT6HA7HRKEGRdS`,
  [ChainId.HARMONY]: `${DECENTRALIZED_NETWORK_HOST}/8QXwz5CYpYRwgqzU9TyofQKDUXWYDVLZ5es49zr2dLPY`, // TODO: MIGHT NEED TO BE REPLACED. 2024-05-23: 88% synced
  [ChainId.AVALANCHE]: `${DECENTRALIZED_NETWORK_HOST}/97YH6dMhGcXoTvVwDAML6GxYm9hBh7PCz6WPscUkrFhv`,
  [ChainId.CELO]: `${DECENTRALIZED_NETWORK_HOST}/68pKaceT6yxMc2EgBbptM1rVksY5NDKu2AsTQaP4z3ER`,
  [ChainId.ARBITRUM]: `${DECENTRALIZED_NETWORK_HOST}/5jebsN6RBioFWQX7LP2N8r55nL4QPAyeKc6GzDA1Pt5H`, // TODO: MIGHT NEED TO BE REPLACED. 2024-05-23: 36% synced
  // [ChainId.OKEX]: `${GRAPH_HOST}/okexchain-blocks/oec`,
  // [ChainId.HECO]: `${GRAPH_HOST}/hecoblocks/heco`,
  [ChainId.MOONRIVER]: `${DECENTRALIZED_NETWORK_HOST}/2gez4qhcz11TMFMKpFPDQe7ebFWm5gxUB6mvszhvztut`,
  [ChainId.FUSE]: `${DECENTRALIZED_NETWORK_HOST}/9JvasV5RyonCHn4bFR22VtsXGNuHsQCUiMJPQoGxqeVX`,
  // [ChainId.KOVAN]: `${GRAPH_HOST}/blocklytics/kovan-blocks`,
  [ChainId.MOONBEAM]: `${DECENTRALIZED_NETWORK_HOST}/EiNGUdnwqk8yA4xVEu9nyTmfCyK7Cxj9xaFjYCKkHnzf`,
  [ChainId.OPTIMISM]: `${DECENTRALIZED_NETWORK_HOST}/HsWM1oAXHGWdkH8bK98UrW38PvyPx6Q4waRow2LT8mcp`, // TODO: MIGHT NEED TO BE REPLACED. 2024-05-23: 62% synced
  [ChainId.KAVA]: `${KAVA_HOST}/sushiswap/blocks-kava`,
  // [ChainId.METIS]: `${METIS_HOST}/sushiswap/blocks-metis`,
  [ChainId.METIS]: `${WAGMI_METIS_HOST}/blocks`,
  [ChainId.ARBITRUM_NOVA]: `${SUSHI_GOLDSKY_HOST}/blocks/arbitrum-nova/gn`,
  [ChainId.BOBA]: `${DECENTRALIZED_NETWORK_HOST}/5d1ZCJQCEqsfCqLRRU5iQ9ewg79tuNqZLPMkgUcpmLsD`,
  [ChainId.BOBA_BNB]: `${SUSHI_GOLDSKY_HOST}/blocks/boba-bnb/gn`,
  [ChainId.BTTC]: `${SUSHI_GOLDSKY_HOST}/blocks/bttc-mainnet/gn`,
  [ChainId.THUNDERCORE]: `${THUNDERCORE_HOST}/sushiswap/blocks-thundercore`,
  [ChainId.CORE]: `${CORE_HOST}/sushiswap/blocks-core`,
  [ChainId.BASE]: `${DECENTRALIZED_NETWORK_HOST}/GU5jJMiEHpomqddtbsXC3Avj3EweLHk6up1pvy2TCQQZ`,
  [ChainId.LINEA]: `${DECENTRALIZED_NETWORK_HOST}/4rj8wdVvkDGzj9w9UfT48zyXGQtLbULW4ygxDBG9Xza1`,
  [ChainId.SCROLL]: `${DECENTRALIZED_NETWORK_HOST}/F4oYLjz8kVPFcY1iGc8S4rAaHnEZsUt6ixXSvFXACcGh`,
  [ChainId.FILECOIN]: `${FILECOIN_HOST}/sushiswap/blocks`,
  [ChainId.HAQQ]: `${HAQQ_HOST}/sushi/blocks-haqq`,
  [ChainId.ZETACHAIN]: `${SUSHI_GOLDSKY_HOST}/blocks-zetachain/1.0.0/gn`,
  [ChainId.BLAST]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushiswap/blocks-blast/gn`,
  [ChainId.SKALE_EUROPA]: `${SKALE_HOST}/sushi/blocks-skale-europa`,
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

// export const SUSHISWAP_SUBGRAPH_URL: Record<number, string> = {
//   [ChainId.ETHEREUM]: `${GRAPH_HOST}/sushi-v2/sushiswap-ethereum`,
//   [ChainId.AVALANCHE]: `${GRAPH_HOST}/sushi-v2/sushiswap-avalanche`,
//   [ChainId.ARBITRUM]: `${GRAPH_HOST}/sushi-v2/sushiswap-arbitrum`,
//   [ChainId.BSC]: `${GRAPH_HOST}/sushi-v2/sushiswap-bsc`,
//   [ChainId.CELO]: `${GRAPH_HOST}/sushi-v2/sushiswap-celo`,
//   [ChainId.FANTOM]: `${GRAPH_HOST}/sushi-v2/sushiswap-fantom`,
//   [ChainId.FUSE]: `${GRAPH_HOST}/sushi-v2/sushiswap-fuse`,
//   [ChainId.GNOSIS]: `${GRAPH_HOST}/sushi-v2/sushiswap-gnosis`,
//   [ChainId.MOONBEAM]: `${GRAPH_HOST}/sushi-v2/sushiswap-moonbeam`,
//   [ChainId.MOONRIVER]: `${GRAPH_HOST}/sushi-v2/sushiswap-moonriver`,
//   [ChainId.HARMONY]: `${GRAPH_HOST}/olastenberg/sushiswap-harmony-fix`,
//   [ChainId.ARBITRUM_NOVA]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushi-0m/sushiswap-arbitrum-nova/gn`,
//   [ChainId.OPTIMISM]: `${GRAPH_HOST}/sushi-subgraphs/sushiswap-optimism`,
//   [ChainId.BOBA]: `${GRAPH_HOST}/sushi-v2/sushiswap-boba`,
//   [ChainId.POLYGON]: `${GRAPH_HOST}/sushi-v2/sushiswap-polygon`,
//   [ChainId.BOBA_BNB]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushi-0m/sushiswap-boba-bnb/gn`,
//   [ChainId.BASE]: `${STUDIO_HOST}/sushiswap-base/v0.0.1`,
//   [ChainId.SCROLL]: `${STUDIO_HOST}/sushiswap-scroll/v0.0.1`,
//   [ChainId.KAVA]: `${KAVA_HOST}/sushi-v2/sushiswap-kava`,
//   [ChainId.METIS]: `${METIS_0XGRAPH_HOST}/sushiswap/sushiswap-metis`,
//   [ChainId.BTTC]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushi-v2/sushiswap-bttc/gn`,
//   [ChainId.FILECOIN]: `${FILECOIN_HOST}/sushiswap/sushiswap-filecoin`,
//   [ChainId.ZETACHAIN]: `${SUSHI_GOLDSKY_HOST}/sushiswap-zetachain/1.0.0/gn`,
//   [ChainId.THUNDERCORE]: `${THUNDERCORE_HOST}/sushi-v2/sushiswap-thundercore`,
//   [ChainId.CORE]: `${CORE_HOST}/sushi-v2/sushiswap-core`,
//   [ChainId.HAQQ]: `${HAQQ_HOST}/sushi/sushiswap-haqq`,
//   [ChainId.LINEA]: `${DECENTRALIZED_NETWORK_HOST}/9ZQV5c7AG2bxp4TqBav73WADLVhixQahCQk5n4uoCgxm`,
//   [ChainId.POLYGON_ZKEVM]: `${STUDIO_HOST}/v2-polygon-zkevm/v0.0.1`,
//   [ChainId.BLAST]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushiswap/sushiswap-blast/gn`,
//   [ChainId.SKALE_EUROPA]: `${SKALE_HOST}/sushi/sushiswap-skale-europa`,
// } as const

export const SUSHISWAP_V2_SUBGRAPH_URL: Record<number, string> = {
  [ChainId.ETHEREUM]: `${DECENTRALIZED_NETWORK_HOST}/GyZ9MgVQkTWuXGMSd3LXESvpevE8S8aD3uktJh7kbVmc`,
  [ChainId.AVALANCHE]: `${DECENTRALIZED_NETWORK_HOST}/5DpWu6oLUEwKYLcya5fJf3MW5CE6yEMnZ8iwekmTNAbV`,
  [ChainId.ARBITRUM]: `${DECENTRALIZED_NETWORK_HOST}/8yBXBTMfdhsoE5QCf7KnoPmQb7QAWtRzESfYjiCjGEM9`,
  [ChainId.BSC]: `${DECENTRALIZED_NETWORK_HOST}/24xqSifM5xPfGrW8MDwRhgaDsq7uaP2762fmxjyxJzot`,
  [ChainId.CELO]: `${DECENTRALIZED_NETWORK_HOST}/8WcZLSs8QUSJptPbpBScoDafmp8E9whnSqYJc9TMyYFs`,
  [ChainId.FANTOM]: `${DECENTRALIZED_NETWORK_HOST}/J7wEPt9nDHCno143dk6whAUesPyszxPqCDKhqDqWJHuz`,
  [ChainId.FUSE]: `${DECENTRALIZED_NETWORK_HOST}/FrcJbZ3j9GZ3vF8G9uVEFQZeTD8uiCc1A1eujtxYUwYH`,
  [ChainId.GNOSIS]: `${DECENTRALIZED_NETWORK_HOST}/7czeiia7ZXvsW45szX2w8EK1ZNgZWZET83zYCwE6JT9x`,
  [ChainId.MOONBEAM]: `${DECENTRALIZED_NETWORK_HOST}/6MMVBsG9hgS8BzLZfPnU8KJdGiEFbd3CyNXVG6gQKCdQ`,
  [ChainId.MOONRIVER]: `${DECENTRALIZED_NETWORK_HOST}/DuB755c1VYFSLLhq4b783ryPcvYdsvimGuZzBpFqoapX`,
  [ChainId.HARMONY]: `${DECENTRALIZED_NETWORK_HOST}/3k9M7aZqeJXWLUogc2FSFBgXuxej2qstKSUNBXcPCcK5`,
  [ChainId.ARBITRUM_NOVA]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushi-0m/v2-arbitrum-nova/gn`,
  [ChainId.OPTIMISM]: `${DECENTRALIZED_NETWORK_HOST}/4KvWjKY89DefJ6mPMASCTUDAZ6dyHSu7osCNQqaaaY3y`,
  [ChainId.BOBA]: `${DECENTRALIZED_NETWORK_HOST}/9cssJAh4EyzEWqZySBFguiXyygwZZAGBE3ETsGetNUK`,
  [ChainId.POLYGON]: `${DECENTRALIZED_NETWORK_HOST}/8obLTNcEuGMieUt6jmrDaQUhWyj2pys26ULeP3gFiGNv`,
  [ChainId.BOBA_BNB]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushi-0m/v2-boba-bnb/gn`,
  [ChainId.BASE]: `${DECENTRALIZED_NETWORK_HOST}/7pXNLCc12pRM3bBPUAP9ZoEvkgUCjaBe9QC3DV9L2qzE`,
  [ChainId.SCROLL]: `${DECENTRALIZED_NETWORK_HOST}/CiW3nquNZjKDoMfR4TbSpB4ox8Pq66FDxwSsohigSdxw`,
  [ChainId.KAVA]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushi-v2/v2-kava/gn`,
  [ChainId.METIS]: `${METIS_0XGRAPH_HOST}/sushiswap/v2-metis`,
  [ChainId.BTTC]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushi-v2/v2-bttc/gn`,
  [ChainId.FILECOIN]: `${FILECOIN_HOST}/sushiswap/v2-filecoin`,
  [ChainId.ZETACHAIN]: `${SUSHI_GOLDSKY_HOST}/v2-zetachain/1.0.0/gn`,
  [ChainId.THUNDERCORE]: `${THUNDERCORE_HOST}/sushi-v2/v2-thundercore`,
  [ChainId.CORE]: `${CORE_HOST}/sushi-v2/v2-core`,
  [ChainId.HAQQ]: `${HAQQ_HOST}/sushi/v2-haqq`,
  [ChainId.LINEA]: `${DECENTRALIZED_NETWORK_HOST}/G4sRz1YAcEFYFewGLQ9bt76gQuP1oyuzhVSTvs9bj7qn`,
  [ChainId.POLYGON_ZKEVM]: `${DECENTRALIZED_NETWORK_HOST}/6QS4nmWq9Wv6WPQRk1F7RJnnKcAcUBhzaiF9ZHfkUcp4`,
  [ChainId.BLAST]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushiswap/v2-blast/gn`,
  [ChainId.SKALE_EUROPA]: `${SKALE_HOST}/sushi/v2-skale-europa`,
} as const

export const SUSHISWAP_V3_SUBGRAPH_URL: Record<number, string> = {
  [ChainId.ARBITRUM_NOVA]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushi-v3/v3-arbitrum-nova/gn`,
  [ChainId.ARBITRUM]: `${DECENTRALIZED_NETWORK_HOST}/96EYD64NqmnFxMELu2QLWB95gqCmA9N96ssYsZfFiYHg`,
  [ChainId.AVALANCHE]: `${DECENTRALIZED_NETWORK_HOST}/4BxsTB5ADnYdgJgdmzyddmnDGCauctDia28uxB1hgTBE`,
  [ChainId.BSC]: `${DECENTRALIZED_NETWORK_HOST}/FiJDXMFCBv88GP17g2TtPh8BcA8jZozn5WRW7hCN7cUT`,
  [ChainId.BOBA]: `${DECENTRALIZED_NETWORK_HOST}/71VWMKCvsWRqrJouxmEQwSEMqqnqiiVYSxTZvzR8PHRx`,
  [ChainId.ETHEREUM]: `${DECENTRALIZED_NETWORK_HOST}/5nnoU1nUFeWqtXgbpC54L9PWdpgo7Y9HYinR3uTMsfzs`,
  [ChainId.FANTOM]: `${DECENTRALIZED_NETWORK_HOST}/4BzEvR229mwKjneCbJTDM8dsS3rjgoKcXt5C7J1DaUxK`,
  [ChainId.FUSE]: `${DECENTRALIZED_NETWORK_HOST}/8P62wYTJvhd6Aas656hVYhsccsGo2ihrJShaEnCoLJRK`,
  [ChainId.GNOSIS]: `${DECENTRALIZED_NETWORK_HOST}/GFvGfWBX47RNnvgwL6SjAAf2mrqrPxF91eA53F4eNegW`,
  [ChainId.MOONRIVER]: `${DECENTRALIZED_NETWORK_HOST}/F46W9YVQXGism5iN9NZNhKm2DQCvjhr4u847rL1tRebS`,
  [ChainId.OPTIMISM]: `${DECENTRALIZED_NETWORK_HOST}/Dr3FkshPgTMMDwxckz3oZdwLxaPcbzZuAbE92i6arYtJ`,
  [ChainId.POLYGON]: `${DECENTRALIZED_NETWORK_HOST}/CqLnQY1d6DLcBYu7aZvGmt17LoNdTe4fDYnGbE2EgotR`,
  [ChainId.POLYGON_ZKEVM]: `${DECENTRALIZED_NETWORK_HOST}/E2x2gmtYdm2HX3QXorUBY4KegfGu79Za6TEQYjVrx15c`,
  [ChainId.THUNDERCORE]: `${THUNDERCORE_HOST}/sushi-v3/v3-thundercore`,
  [ChainId.CORE]: `${CORE_HOST}/sushi-v3/v3-core-fix`,
  [ChainId.BASE]: `${DECENTRALIZED_NETWORK_HOST}/Cz4Snpih41NNNPZcbj1gd3fYXPwFr5q92iWMoZjCarEb`,
  [ChainId.LINEA]: `${DECENTRALIZED_NETWORK_HOST}/E2vqqvSzDdUiPP1r7PFnPKZQ34pAhNZjc6rEcdj3uE5t`,
  [ChainId.SCROLL]: `${DECENTRALIZED_NETWORK_HOST}/5gyhoHx768oHn3GxsHsEc7oKFMPFg9AH8ud1dY8EirRc`,
  [ChainId.KAVA]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushi-v3/v3-kava/gn`,
  [ChainId.METIS]: `${METIS_0XGRAPH_HOST}/sushiswap/v3-metis`,
  [ChainId.BTTC]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushi-v3/v3-bttc/gn`,
  [ChainId.FILECOIN]: `${FILECOIN_HOST}/sushiswap/v3-filecoin`,
  [ChainId.HAQQ]: `${HAQQ_HOST}/sushi/v3-haqq`,
  [ChainId.ZETACHAIN]: `${SUSHI_GOLDSKY_HOST}/v3-zetachain/1.0.0/gn`,
  [ChainId.BLAST]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushiswap/v3-blast/gn`,
  [ChainId.SKALE_EUROPA]: `${SKALE_HOST}/sushi/v3-skale-europa`,
}

export const MINICHEF_SUBGRAPH_URL = {
  [ChainId.POLYGON]: `${DECENTRALIZED_NETWORK_HOST}/DaSTfQbRTQq63HYGuAWusisUj23PFuisbhxHkjRHknex`,
  [ChainId.GNOSIS]: `${DECENTRALIZED_NETWORK_HOST}/FhtxFSxNCjVGknieajtwEzjruGFhTcAW9tWuADQ3tzNK`,
  // [ChainId.HARMONY]: `${GRAPH_HOST}/sushiswap/harmony-minichef`, // Broken, no fix has been deployed or migrated
  [ChainId.ARBITRUM]: `${DECENTRALIZED_NETWORK_HOST}/9oRuyFt4J6nHFpL5kWfkp3yocjzmZo1D8hKjqyKNuix`,
  [ChainId.CELO]: `${DECENTRALIZED_NETWORK_HOST}/Aodb24RhU4p1p6p4ooq1Rwu5aVXhULAvXEGg8QEaPBvg`,
  [ChainId.MOONRIVER]: `${DECENTRALIZED_NETWORK_HOST}/ExyevfNrFJ7EhTK74MDJ823h6oKkqUpwnVP1h3EuN8oa`,
  [ChainId.FUSE]: `${DECENTRALIZED_NETWORK_HOST}/GdVirDDQ2fg43pjt2cZiH9Uar7bhGfySvm4jiQ9fVD4u`,
  [ChainId.FANTOM]: `${DECENTRALIZED_NETWORK_HOST}/GJXdaT5S7BHvGNxJSLJsMH36tB4w3Z7eES6jSDJuqddg`,
  [ChainId.MOONBEAM]: `${DECENTRALIZED_NETWORK_HOST}/35kjzcBhiTgS3LLrhRFFGVGRfapzQBDC2wEWydvG2jZc`,
  [ChainId.BOBA]: `${DECENTRALIZED_NETWORK_HOST}/8s62qVWURfEebmaYkxDBwHLmWn7qF1dyucX2Tj6n3YPj`,
  [ChainId.OPTIMISM]: `${DECENTRALIZED_NETWORK_HOST}/5DVXnbAu4uqKLbczLeAErLsLyQdxoZ1BjvCn1buWyZf8`,
  [ChainId.AVALANCHE]: `${DECENTRALIZED_NETWORK_HOST}/8M2Tyj1bVFp9paR9rcysn17V9Y1MbMgL9YEZQ5q4aSZH`,
  [ChainId.BSC]: `${DECENTRALIZED_NETWORK_HOST}/CuaMtyA7JyzEf5mqsrWBwhdfLFfz1QU2js17R77wAyYB`,
  [ChainId.KAVA]: `${KAVA_HOST}/sushiswap/kava-minichef`,
  [ChainId.METIS]: `${METIS_0XGRAPH_HOST}/sushiswap/minichef-metis`,
  [ChainId.ARBITRUM_NOVA]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushiswap/minichef-arbitrum-nova/gn`,
  [ChainId.BTTC]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushiswap/minichef-bttc/gn`,
} as const

export const MASTERCHEF_V1_SUBGRAPH_URL =
  `${DECENTRALIZED_NETWORK_HOST}/HoVZ6mXTx3dvoqaUwcJozuowz7xijzDLmfuBWLed6rqi` as const
export const MASTERCHEF_V2_SUBGRAPH_URL =
  `${DECENTRALIZED_NETWORK_HOST}/FAa1YU79pPDUKj8vtkUPZGzCcPVS6Edg1md5LsRHSKWb` as const

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
  ChainId.HAQQ,
  ChainId.CORE,
  ChainId.THUNDERCORE,
  ChainId.BTTC,
] as const

export const FURO_SUBGRAPH_URL: Record<string, string> = {
  [ChainId.ETHEREUM]: `${DECENTRALIZED_NETWORK_HOST}/D8vYJpKN5SEHUkUWKSuorsL6FRt7hAQMnywnC4e93ygf`,
  [ChainId.ARBITRUM]: `${DECENTRALIZED_NETWORK_HOST}/8eHhPeKDr646JH5KUBBcabAJzkWmLfu6pqBtpXQHa37F`,
  [ChainId.AVALANCHE]: `${DECENTRALIZED_NETWORK_HOST}/8LVoX3JPEVAak8T8GoEfdJudMoP2bsGwd9tszJxo3Rnx`,
  [ChainId.BSC]: `${DECENTRALIZED_NETWORK_HOST}/2wBYezghRA3hEJLQB4njUZGDNxCdU3u2gsLP5yVvBqKk`,
  [ChainId.FANTOM]: `${DECENTRALIZED_NETWORK_HOST}/E98zSR5UZBGBgQe2SSLZ5R6yj5GPqKDJcQJNDHTeV3cS`,
  [ChainId.GNOSIS]: `${DECENTRALIZED_NETWORK_HOST}/5ToxB5xubMh9osdEDeX98JBAyzUVwkReGXAT1CzQhZCB`,
  [ChainId.HARMONY]: `${DECENTRALIZED_NETWORK_HOST}/9D9C3ppoDE1zuZk5adznngKomLYS8NnC9zxniSS8vzgH`,
  [ChainId.MOONBEAM]: `${DECENTRALIZED_NETWORK_HOST}/HJxpcsmaPV3L6PsqGFBHLczeMnL7bEgmL1D65edGx8pf`,
  [ChainId.MOONRIVER]: `${DECENTRALIZED_NETWORK_HOST}/9ZqdKjfu7o9dX1RThXHDV9EqMn5CTvgpsPKKbpANg8yC`,
  [ChainId.OPTIMISM]: `${DECENTRALIZED_NETWORK_HOST}/8KnsmppMf9k6Qvyixxwmny7dYugTV7XT4htHTfyq3d69`,
  [ChainId.POLYGON]: `${DECENTRALIZED_NETWORK_HOST}/4KsDNsyJjKX6bjwVNJQmJ7Dm3wovYXSX37UR39rNaMX4`,
  [ChainId.HAQQ]: `${HAQQ_HOST}/sushi/furo-haqq`,
  [ChainId.CORE]: `${CORE_HOST}/sushi-subgraphs/furo-core`,
  [ChainId.THUNDERCORE]: `${THUNDERCORE_HOST}/sushi-subgraphs/furo-thundercore`,
  [ChainId.BTTC]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushi-subgraphs/furo-bttc/gn`,
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

export const isSushiSwapChain = (
  chainId: ChainId,
): chainId is SushiSwapChainId =>
  Object.keys(SUSHISWAP_V2_SUBGRAPH_URL).map(Number).includes(chainId)

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
