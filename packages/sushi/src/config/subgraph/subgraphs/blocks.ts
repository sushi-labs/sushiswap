import { ChainId } from '../../../chain/index.js'
import {
  CORE_HOST,
  DECENTRALIZED_NETWORK_HOST,
  FILECOIN_HOST,
  HAQQ_HOST,
  METIS_0XGRAPH_HOST,
  SKALE_HOST,
  SUSHI_DEDICATED_GOLDSKY_HOST,
  SUSHI_GOLDSKY_HOST,
  THUNDERCORE_HOST,
  WAGMI_KAVA_HOST,
} from '../hosts.js'

export const BLOCKS_SUBGRAPH_URL: Partial<Record<ChainId, string>> = {
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
  [ChainId.KAVA]: `${WAGMI_KAVA_HOST}/sushiswap/blocks-kava`,
  [ChainId.METIS]: `${METIS_0XGRAPH_HOST}/sushiswap/blocks-metis`,
  // [ChainId.METIS]: `${WAGMI_METIS_HOST}/blocks`,
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
  [ChainId.ROOTSTOCK]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushiswap/blocks-rootstock/gn`,
}
