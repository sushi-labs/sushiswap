import { ChainId } from 'chain'

type SubdomainName = string

/* Stored like so (instead of the reverse) to type-enforce us to make sure this stays updated */
const chainIdToSubdomainName: Record<ChainId, SubdomainName> = {
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.ROPSTEN]: 'ropsten',
  [ChainId.RINKEBY]: 'rinkeby',
  [ChainId.GÖRLI]: 'goerli',
  [ChainId.KOVAN]: 'kovan',
  [ChainId.MATIC]: 'matic',
  [ChainId.MATIC_TESTNET]: 'matic-testnet',
  [ChainId.FANTOM]: 'fantom',
  [ChainId.FANTOM_TESTNET]: 'fantom-testnet',
  [ChainId.XDAI]: 'xdai',
  [ChainId.BSC]: 'bsc',
  [ChainId.BSC_TESTNET]: 'bsc-testnet',
  [ChainId.ARBITRUM]: 'arbitrum',
  [ChainId.ARBITRUM_TESTNET]: 'arbitrum-testnet',
  [ChainId.MOONBEAM_TESTNET]: 'moonbeam-testnet',
  [ChainId.AVALANCHE]: 'avalanche',
  [ChainId.AVALANCHE_TESTNET]: 'avalanche-testnet',
  [ChainId.HECO]: 'heco',
  [ChainId.HECO_TESTNET]: 'heco-testnet',
  [ChainId.HARMONY]: 'harmony',
  [ChainId.HARMONY_TESTNET]: 'harmony-testnet',
  [ChainId.OKEX]: 'okex',
  [ChainId.OKEX_TESTNET]: 'okex-testnet',
  [ChainId.CELO]: 'celo',
  [ChainId.PALM]: 'palm',
  [ChainId.PALM_TESTNET]: 'palm-testnet',
  [ChainId.MOONRIVER]: 'moonriver',
  [ChainId.FUSE]: 'fuse',
  [ChainId.TELOS]: 'telos',
}

export const subdomainToChainIdMap: Record<SubdomainName, ChainId> = Object.fromEntries(
  Object.entries(chainIdToSubdomainName).map((entry) => entry.reverse()),
)
