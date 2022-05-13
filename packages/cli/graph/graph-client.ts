import { getBuiltGraphSDK } from './../.graphclient'
import { ChainKey } from '@sushiswap/chain'

interface Maker {
  address: string
  type: string
}

const CHAIN_CONFIG: Record<string, Maker> = {
  [ChainKey.ETHEREUM]: { address: '0x5ad6211cd3fde39a9cecb5df6f380b8263d1e277', type: 'SushiMaker' },
  [ChainKey.FANTOM]: { address: '0xf9e7d4c6d36ca311566f46c81e572102a2dc9f52', type: 'Safe' },
  [ChainKey.MATIC]: { address: '0xf1c9881be22ebf108b8927c4d197d126346b5036', type: 'WethMaker' },
  [ChainKey.XDAI]: { address: '0xc375411c6597f692add6a7a3ad5b3c38626b0f26', type: 'Safe' },
  [ChainKey.BSC]: { address: '0xc6fd91ad4919fd91e2c84077ba648092cb499638', type: 'Safe' },
  [ChainKey.ARBITRUM]: { address: '0xa19b3b22f29e23e4c04678c94cfc3e8f202137d8', type: 'WethMaker' },
  [ChainKey.AVALANCHE]: { address: '0x560c759a11cd026405f6f2e19c65da1181995fa2', type: 'WethMaker' },
  [ChainKey.CELO]: { address: '0x8b63fcbb752e425e3c4b12f7802bad1a24c6d7f4', type: 'Safe' },
  [ChainKey.MOONRIVER]: { address: '0xcc159bcb6a466da442d254ad934125f05dab66b5', type: 'Matt' },
  [ChainKey.FUSE]: { address: '0x33b6beb37837459ee84a1ffed2c6a4ca22e5f316', type: 'Safe' },
  // [ChainKey.MOONBEAM]: {address: '0x87aeb22b7bb02ac42204eb312c08a22fc3f077f3', type: "Safe"}, // Disabled, reserveUSD returns 0
  // [ChainKey.HECO]: {address: '0xcc159bcb6a466da442d254ad934125f05dab66b5', type: "Matt"}, // Subgraph not working, not much traffic
  // [ChainKey.HARMONY]: {address: '0xcc159bcb6a466da442d254ad934125f05dab66b5', type: "Matt"}, // inconsistent uptime, not hosted by thegraph
  // [ChainKey.OKEX]: {address: '0xcc159bcb6a466da442d254ad934125f05dab66b5', type: "Matt"}, // Subgraph not working, not much traffic
}

export const getMakerLPs = async (chain: ChainKey | undefined) => {
  if (!chain || !Object.keys(CHAIN_CONFIG).includes(chain)) {
    throw new Error('Unsupported chain. Supported chains are: '.concat(Object.keys(CHAIN_CONFIG).join(', ')))
  }
  const sdk = await getBuiltGraphSDK()
  if (chain === ChainKey.ETHEREUM) {
    return await (
      await sdk.EthereumUserLPs({ id: CHAIN_CONFIG[chain].address })
    ).ETHEREUM_EXCHANGE_user?.liquidityPositions
  } else if (chain === ChainKey.FANTOM) {
    return await (
      await sdk.FantomUserLPs({ id: CHAIN_CONFIG[chain].address })
    ).FANTOM_EXCHANGE_user?.liquidityPositions
  } else if (chain === ChainKey.MATIC) {
    return await (
      await sdk.MaticUserLPs({ id: CHAIN_CONFIG[chain].address })
    ).MATIC_EXCHANGE_user?.liquidityPositions
  } else if (chain === ChainKey.XDAI) {
    return await (
      await sdk.XdaiUserLPs({ id: CHAIN_CONFIG[chain].address })
    ).XDAI_EXCHANGE_user?.liquidityPositions
  } else if (chain === ChainKey.BSC) {
    return await (
      await sdk.BscUserLPs({ id: CHAIN_CONFIG[chain].address })
    ).BSC_EXCHANGE_user?.liquidityPositions
  } else if (chain === ChainKey.ARBITRUM) {
    return await (
      await sdk.ArbitrumUserLPs({ id: CHAIN_CONFIG[chain].address })
    ).ARBITRUM_EXCHANGE_user?.liquidityPositions
  } else if (chain === ChainKey.AVALANCHE) {
    return await (
      await sdk.AvalancheUserLPs({ id: CHAIN_CONFIG[chain].address })
    ).AVALANCHE_EXCHANGE_user?.liquidityPositions
  } else if (chain === ChainKey.CELO) {
    return await (
      await sdk.CeloUserLPs({ id: CHAIN_CONFIG[chain].address })
    ).CELO_EXCHANGE_user?.liquidityPositions
  } else if (chain === ChainKey.MOONRIVER) {
    return await (
      await sdk.MoonriverUserLPs({ id: CHAIN_CONFIG[chain].address })
    ).MOONRIVER_EXCHANGE_user?.liquidityPositions
  } else if (chain === ChainKey.FUSE) {
    return await (
      await sdk.FuseUserLPs({ id: CHAIN_CONFIG[chain].address })
    ).FUSE_EXCHANGE_user?.liquidityPositions
  }
  // else if (chain === ChainKey.MOONBEAM) {
  //   return await (
  //     await sdk.MoonbeamUserLPs({ id: CHAIN_CONFIG[chain].address })
  //   ).MOONBEAM_EXCHANGE_user?.liquidityPositions
  // }
}

export const getAllMakers = async () => {
  const sdk = await getBuiltGraphSDK()
  return [
    {
      network: [ChainKey.ETHEREUM],
      address: CHAIN_CONFIG[ChainKey.ETHEREUM].address,
      type: CHAIN_CONFIG[ChainKey.ETHEREUM].type,
      liquidityPositions: (await sdk.EthereumUserLPs({ id: CHAIN_CONFIG[ChainKey.ETHEREUM].address }))
        .ETHEREUM_EXCHANGE_user?.liquidityPositions,
    },
    {
      network: [ChainKey.FANTOM],
      address: CHAIN_CONFIG[ChainKey.FANTOM].address,
      type: CHAIN_CONFIG[ChainKey.FANTOM].type,
      liquidityPositions: (await sdk.FantomUserLPs({ id: CHAIN_CONFIG[ChainKey.FANTOM].address })).FANTOM_EXCHANGE_user
        ?.liquidityPositions,
    },
    {
      network: [ChainKey.MATIC],
      address: CHAIN_CONFIG[ChainKey.MATIC].address,
      type: CHAIN_CONFIG[ChainKey.MATIC].type,
      liquidityPositions: (await sdk.MaticUserLPs({ id: CHAIN_CONFIG[ChainKey.MATIC].address })).MATIC_EXCHANGE_user
        ?.liquidityPositions,
    },
    {
      network: [ChainKey.XDAI],
      address: CHAIN_CONFIG[ChainKey.XDAI].address,
      type: CHAIN_CONFIG[ChainKey.XDAI].type,
      liquidityPositions: (await sdk.XdaiUserLPs({ id: CHAIN_CONFIG[ChainKey.XDAI].address })).XDAI_EXCHANGE_user
        ?.liquidityPositions,
    },
    {
      network: [ChainKey.BSC],
      address: CHAIN_CONFIG[ChainKey.BSC].address,
      type: CHAIN_CONFIG[ChainKey.BSC].type,
      liquidityPositions: (await sdk.BscUserLPs({ id: CHAIN_CONFIG[ChainKey.BSC].address })).BSC_EXCHANGE_user
        ?.liquidityPositions,
    },
    {
      network: [ChainKey.ARBITRUM],
      address: CHAIN_CONFIG[ChainKey.ARBITRUM].address,
      type: CHAIN_CONFIG[ChainKey.ARBITRUM].type,
      liquidityPositions: (await sdk.ArbitrumUserLPs({ id: CHAIN_CONFIG[ChainKey.ARBITRUM].address }))
        .ARBITRUM_EXCHANGE_user?.liquidityPositions,
    },
    {
      network: [ChainKey.AVALANCHE],
      address: CHAIN_CONFIG[ChainKey.AVALANCHE].address,
      type: CHAIN_CONFIG[ChainKey.AVALANCHE].type,
      liquidityPositions: (await sdk.AvalancheUserLPs({ id: CHAIN_CONFIG[ChainKey.AVALANCHE].address }))
        .AVALANCHE_EXCHANGE_user?.liquidityPositions,
    },
    {
      network: [ChainKey.CELO],
      address: CHAIN_CONFIG[ChainKey.CELO].address,
      type: CHAIN_CONFIG[ChainKey.CELO].type,
      liquidityPositions: (await sdk.CeloUserLPs({ id: CHAIN_CONFIG[ChainKey.CELO].address })).CELO_EXCHANGE_user
        ?.liquidityPositions,
    },
    {
      network: [ChainKey.MOONRIVER],
      address: CHAIN_CONFIG[ChainKey.MOONRIVER].address,
      type: CHAIN_CONFIG[ChainKey.MOONRIVER].type,
      liquidityPositions: (await sdk.MoonriverUserLPs({ id: CHAIN_CONFIG[ChainKey.MOONRIVER].address }))
        .MOONRIVER_EXCHANGE_user?.liquidityPositions,
    },
    {
      network: [ChainKey.FUSE],
      address: CHAIN_CONFIG[ChainKey.FUSE].address,
      type: CHAIN_CONFIG[ChainKey.FUSE].type,
      liquidityPositions: (await sdk.FuseUserLPs({ id: CHAIN_CONFIG[ChainKey.FUSE].address })).FUSE_EXCHANGE_user
        ?.liquidityPositions,
    },
    // {
    //   network: [ChainKey.MOONBEAM],
    //   address: CHAIN_CONFIG[ChainKey.MOONBEAM].address,
    //   type: CHAIN_CONFIG[ChainKey.MOONBEAM].type,
    //   liquidityPositions: (await sdk.MoonbeamUserLPs({ id: CHAIN_CONFIG[ChainKey.MOONBEAM].address })).MOONBEAM_EXCHANGE_user
    //     ?.liquidityPositions,
    // },
  ]
}
