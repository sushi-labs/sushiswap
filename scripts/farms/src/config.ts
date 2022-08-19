import { ChainId } from '@sushiswap/chain'

export const MINICHEF_SUBGRAPH_NAME: Record<number | string, string> = {
  // [ChainId.POLYGON]: 'jiro-ono/minichef-staging-updates', // new trident subgraph not synced yet
  [ChainId.GNOSIS]: 'jiro-ono/gnosis-minichef-staging',
  // [ChainId.HARMONY]: 'sushiswap/harmony-minichef', // subgraph broken
  [ChainId.ARBITRUM]: 'jiro-ono/arbitrum-minichef-staging',
  [ChainId.CELO]: 'sushiswap/celo-minichef-v2',
  [ChainId.MOONRIVER]: 'sushiswap/moonriver-minichef',
  [ChainId.FUSE]: 'sushiswap/fuse-minichef',
  [ChainId.FANTOM]: 'sushiswap/fantom-minichef',
  [ChainId.MOONBEAM]: 'sushiswap/moonbeam-minichef',
  // [ChainId.KAVA]: 'sushiswap/kava-minichef', //block subgraph not synced yet
  [ChainId.METIS]: 'sushiswap/metis-minichef',
}
