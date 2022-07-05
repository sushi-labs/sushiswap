import { ChainKey } from '@sushiswap/chain'
import { getBuiltGraphSDK } from '@sushiswap/graph-client'

const sdk = getBuiltGraphSDK()

interface Maker {
  address: string
  type: string
  fetcher: typeof sdk.EthereumUserLPs
}

export const MAKER_CONFIG: Record<string, Maker> = {
  [ChainKey.ETHEREUM]: {
    address: '0x5ad6211cd3fde39a9cecb5df6f380b8263d1e277',
    type: 'SushiMaker',
    fetcher: sdk.EthereumUserLPs,
  },
  [ChainKey.FANTOM]: {
    address: '0xf9e7d4c6d36ca311566f46c81e572102a2dc9f52',
    type: 'Safe',
    fetcher: sdk.FantomUserLPs as typeof sdk.EthereumUserLPs,
  },
  [ChainKey.POLYGON]: {
    address: '0xf1c9881be22ebf108b8927c4d197d126346b5036',
    type: 'WethMaker',
    fetcher: sdk.MaticUserLPs as typeof sdk.EthereumUserLPs,
  },
  [ChainKey.GNOSIS]: {
    address: '0xc375411c6597f692add6a7a3ad5b3c38626b0f26',
    type: 'Safe',
    fetcher: sdk.XdaiUserLPs as typeof sdk.EthereumUserLPs,
  },
  [ChainKey.BSC]: {
    address: '0xc6fd91ad4919fd91e2c84077ba648092cb499638',
    type: 'Safe',
    fetcher: sdk.BscUserLPs as typeof sdk.EthereumUserLPs,
  },
  [ChainKey.ARBITRUM]: {
    address: '0xa19b3b22f29e23e4c04678c94cfc3e8f202137d8',
    type: 'WethMaker',
    fetcher: sdk.ArbitrumUserLPs as typeof sdk.EthereumUserLPs,
  },
  [ChainKey.AVALANCHE]: {
    address: '0x560c759a11cd026405f6f2e19c65da1181995fa2',
    type: 'WethMaker',
    fetcher: sdk.AvalancheUserLPs as typeof sdk.EthereumUserLPs,
  },
  [ChainKey.CELO]: {
    address: '0x8b63fcbb752e425e3c4b12f7802bad1a24c6d7f4',
    type: 'Safe',
    fetcher: sdk.CeloUserLPs as typeof sdk.EthereumUserLPs,
  },
  [ChainKey.MOONRIVER]: {
    address: '0xcc159bcb6a466da442d254ad934125f05dab66b5',
    type: 'Matt',
    fetcher: sdk.MoonriverUserLPs as typeof sdk.EthereumUserLPs,
  },
  [ChainKey.FUSE]: {
    address: '0x33b6beb37837459ee84a1ffed2c6a4ca22e5f316',
    type: 'Safe',
    fetcher: sdk.FuseUserLPs as typeof sdk.EthereumUserLPs,
  },

  // [ChainKey.MOONBEAM]: {address: '0x87aeb22b7bb02ac42204eb312c08a22fc3f077f3', type: "Safe"}, // Disabled, reserveUSD returns 0
  // [ChainKey.HARMONY]: {address: '0xcc159bcb6a466da442d254ad934125f05dab66b5', type: "Matt"}, // inconsistent uptime, not hosted by thegraph
}
