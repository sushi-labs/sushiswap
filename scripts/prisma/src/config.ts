import { ChainId } from '@sushiswap/chain'

export const SUSHISWAP_CHAINS = [
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
]

const GRAPH_HOST_ENDPOINT = 'api.thegraph.com'

export const GRAPH_HOST: Record<number | string, string> = {
  [ChainId.OPTIMISM]: GRAPH_HOST_ENDPOINT,
  [ChainId.ETHEREUM]: GRAPH_HOST_ENDPOINT,
  [ChainId.AVALANCHE]: GRAPH_HOST_ENDPOINT,
  [ChainId.ARBITRUM]: GRAPH_HOST_ENDPOINT,
  [ChainId.BSC]: GRAPH_HOST_ENDPOINT,
  [ChainId.CELO]: GRAPH_HOST_ENDPOINT,
  [ChainId.FANTOM]: GRAPH_HOST_ENDPOINT,
  [ChainId.FUSE]: GRAPH_HOST_ENDPOINT,
  [ChainId.GNOSIS]: GRAPH_HOST_ENDPOINT,
  [ChainId.MOONBEAM]: GRAPH_HOST_ENDPOINT,
  [ChainId.MOONRIVER]: GRAPH_HOST_ENDPOINT,
  [ChainId.POLYGON]: GRAPH_HOST_ENDPOINT,
  [ChainId.KAVA]: 'pvt.graph.kava.io',
  [ChainId.METIS]: 'andromeda.thegraph.metis.io',
  [ChainId.ARBITRUM_NOVA]: 'arbitrum-nova-subgraph.sushi.com',
  [ChainId.BOBA]: GRAPH_HOST_ENDPOINT,
}

export const EXCHANGE_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.ETHEREUM]: 'subgraph-qa/sushiswap-ethereum',
  [ChainId.AVALANCHE]: 'sushi-0m/sushiswap-avalanche',
  [ChainId.ARBITRUM]: 'sushi-0m/sushiswap-arbitrum',
  [ChainId.BSC]: 'subgraph-qa/sushiswap-bsc',
  [ChainId.CELO]: 'sushi-0m/sushiswap-celo',
  [ChainId.FANTOM]: 'sushi-0m/sushiswap-fantom',
  [ChainId.FUSE]: 'sushi-0m/sushiswap-fuse',
  [ChainId.GNOSIS]: 'sushi-0m/sushiswap-gnosis',
  [ChainId.MOONBEAM]: 'sushi-0m/sushiswap-moonbeam',
  [ChainId.MOONRIVER]: 'sushi-0m/sushiswap-moonriver',
  [ChainId.HARMONY]: 'subgraph-qa/sushiswap-harmony',
  [ChainId.ARBITRUM_NOVA]: 'sushi-0m/sushiswap-arbitrum-nova',
  [ChainId.POLYGON]: 'subgraph-qa/sushiswap-polygon',
  [ChainId.BOBA]: 'sushi-0m/sushiswap-boba',
}


export const MASTERCHEF_V1_SUBGRAPH_NAME = 'jiro-ono/masterchef-staging'
export const MASTERCHEF_V2_SUBGRAPH_NAME = 'sushiswap/master-chefv2'

export const MINICHEF_ADDRESS: Record<number | string, string> = {
  [ChainId.POLYGON]: '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
  [ChainId.GNOSIS]: '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3',
  [ChainId.HARMONY]: '0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287',
  [ChainId.ARBITRUM]: '0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3',
  [ChainId.CELO]: '0x8084936982D089130e001b470eDf58faCA445008',
  [ChainId.MOONRIVER]: '0x3dB01570D97631f69bbb0ba39796865456Cf89A5',
  [ChainId.FUSE]: '0x182CD0C6F1FaEc0aED2eA83cd0e160c8Bd4cb063',
  [ChainId.FANTOM]: '0xf731202A3cf7EfA9368C2d7bD613926f7A144dB5',
  [ChainId.MOONBEAM]: '0x011E52E4E40CF9498c79273329E8827b21E2e581',
  [ChainId.KAVA]: '0xf731202A3cf7EfA9368C2d7bD613926f7A144dB5',
  [ChainId.METIS]: '0x1334c8e873E1cae8467156e2A81d1C8b566B2da1',
  [ChainId.BOBA]: '0x75f52766A6a23F736edEfCD69dfBE6153a48c3F3',
}

export const MASTERCHEF_ADDRESS: Record<number | string, string> = {
  [ChainId.ETHEREUM]: '0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd',
  [ChainId.ROPSTEN]: '0x80C7DD17B01855a6D2347444a0FCC36136a314de',
  [ChainId.RINKEBY]: '0x80C7DD17B01855a6D2347444a0FCC36136a314de',
  [ChainId.GÖRLI]: '0x80C7DD17B01855a6D2347444a0FCC36136a314de',
  [ChainId.KOVAN]: '0x80C7DD17B01855a6D2347444a0FCC36136a314de',
}

export const MASTERCHEF_V2_ADDRESS: Record<number | string, string> = {
  [ChainId.ETHEREUM]: '0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d',
}
