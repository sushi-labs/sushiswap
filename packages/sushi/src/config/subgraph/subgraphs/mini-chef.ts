import { ChainId } from '../../../chain/index.js'
import { MiniChefChainId } from '../../mini-chef.js'
import {
  DECENTRALIZED_NETWORK_HOST,
  GRAPH_HOST,
  METIS_0XGRAPH_HOST,
  SUSHI_DEDICATED_GOLDSKY_HOST,
} from '../hosts.js'

export const MINICHEF_SUBGRAPH_URL: Record<MiniChefChainId, string> = {
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
  [ChainId.KAVA]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushiswap/minichef-kava/gn`,
  [ChainId.METIS]: `${METIS_0XGRAPH_HOST}/sushiswap/minichef-metis`,
  [ChainId.ARBITRUM_NOVA]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushiswap/minichef-arbitrum-nova/gn`,
  [ChainId.BTTC]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushiswap/minichef-bttc/gn`,
  [ChainId.OPTIMISM]: `${GRAPH_HOST}/sushiswap/minichef-optimism`,
  [ChainId.AVALANCHE]: `${GRAPH_HOST}/sushiswap/minichef-avalanche`,
  [ChainId.BSC]: `${GRAPH_HOST}/sushiswap/minichef-bsc`,
  [ChainId.KAVA]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushiswap/minichef-kava/gn`,
  [ChainId.METIS]: `${METIS_0XGRAPH_HOST}/sushiswap/minichef-metis`,
  [ChainId.ARBITRUM_NOVA]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushiswap/minichef-arbitrum-nova/gn`,
  [ChainId.BTTC]: `${SUSHI_DEDICATED_GOLDSKY_HOST}/sushiswap/minichef-bttc/gn`,
}
