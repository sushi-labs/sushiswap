import { ChainKey } from '@sushiswap/chain'
import { MAKER_CONFIG } from '../config'
import { getBuiltGraphSDK } from './../.graphclient'

export const getMakerLPs = async (chain: ChainKey | undefined) => {
  if (!chain || !Object.keys(MAKER_CONFIG).includes(chain)) {
    throw new Error('Unsupported chain. Supported chains are: '.concat(Object.keys(MAKER_CONFIG).join(', ')))
  }
  const sdk = await getBuiltGraphSDK()
  if (chain === ChainKey.ETHEREUM) {
    return await (
      await sdk.EthereumUserLPs({ id: MAKER_CONFIG[chain].address })
    ).ETHEREUM_EXCHANGE_user?.liquidityPositions
  } else if (chain === ChainKey.FANTOM) {
    return await (
      await sdk.FantomUserLPs({ id: MAKER_CONFIG[chain].address })
    ).FANTOM_EXCHANGE_user?.liquidityPositions
  } else if (chain === ChainKey.MATIC) {
    return await (
      await sdk.MaticUserLPs({ id: MAKER_CONFIG[chain].address })
    ).MATIC_EXCHANGE_user?.liquidityPositions
  } else if (chain === ChainKey.XDAI) {
    return await (
      await sdk.XdaiUserLPs({ id: MAKER_CONFIG[chain].address })
    ).XDAI_EXCHANGE_user?.liquidityPositions
  } else if (chain === ChainKey.BSC) {
    return await (
      await sdk.BscUserLPs({ id: MAKER_CONFIG[chain].address })
    ).BSC_EXCHANGE_user?.liquidityPositions
  } else if (chain === ChainKey.ARBITRUM) {
    return await (
      await sdk.ArbitrumUserLPs({ id: MAKER_CONFIG[chain].address })
    ).ARBITRUM_EXCHANGE_user?.liquidityPositions
  } else if (chain === ChainKey.AVALANCHE) {
    return await (
      await sdk.AvalancheUserLPs({ id: MAKER_CONFIG[chain].address })
    ).AVALANCHE_EXCHANGE_user?.liquidityPositions
  } else if (chain === ChainKey.CELO) {
    return await (
      await sdk.CeloUserLPs({ id: MAKER_CONFIG[chain].address })
    ).CELO_EXCHANGE_user?.liquidityPositions
  } else if (chain === ChainKey.MOONRIVER) {
    return await (
      await sdk.MoonriverUserLPs({ id: MAKER_CONFIG[chain].address })
    ).MOONRIVER_EXCHANGE_user?.liquidityPositions
  } else if (chain === ChainKey.FUSE) {
    return await (
      await sdk.FuseUserLPs({ id: MAKER_CONFIG[chain].address })
    ).FUSE_EXCHANGE_user?.liquidityPositions
  }
}

export const getAllMakers = async () => {
  const sdk = await getBuiltGraphSDK()
  return Promise.all([
    Promise.resolve(sdk.EthereumUserLPs({ id: MAKER_CONFIG[ChainKey.ETHEREUM].address })).then((result) => ({
      network: [ChainKey.ETHEREUM],
      address: MAKER_CONFIG[ChainKey.ETHEREUM].address,
      type: MAKER_CONFIG[ChainKey.ETHEREUM].type,
      liquidityPositions: result,
    })),
    Promise.resolve(sdk.FantomUserLPs({ id: MAKER_CONFIG[ChainKey.FANTOM].address })).then((result) => ({
      network: [ChainKey.FANTOM],
      address: MAKER_CONFIG[ChainKey.FANTOM].address,
      type: MAKER_CONFIG[ChainKey.FANTOM].type,
      liquidityPositions: result,
    })),

    Promise.resolve(sdk.MaticUserLPs({ id: MAKER_CONFIG[ChainKey.MATIC].address })).then((result) => ({
      network: [ChainKey.MATIC],
      address: MAKER_CONFIG[ChainKey.MATIC].address,
      type: MAKER_CONFIG[ChainKey.MATIC].type,
      liquidityPositions: result,
    })),
    Promise.resolve(sdk.XdaiUserLPs({ id: MAKER_CONFIG[ChainKey.XDAI].address })).then((result) => ({
      network: [ChainKey.XDAI],
      address: MAKER_CONFIG[ChainKey.XDAI].address,
      type: MAKER_CONFIG[ChainKey.XDAI].type,
      liquidityPositions: result,
    })),
    Promise.resolve(sdk.BscUserLPs({ id: MAKER_CONFIG[ChainKey.BSC].address })).then((result) => ({
      network: [ChainKey.BSC],
      address: MAKER_CONFIG[ChainKey.BSC].address,
      type: MAKER_CONFIG[ChainKey.BSC].type,
      liquidityPositions: result,
    })),
    Promise.resolve(sdk.ArbitrumUserLPs({ id: MAKER_CONFIG[ChainKey.ARBITRUM].address })).then((result) => ({
      network: [ChainKey.ARBITRUM],
      address: MAKER_CONFIG[ChainKey.ARBITRUM].address,
      type: MAKER_CONFIG[ChainKey.ARBITRUM].type,
      liquidityPositions: result,
    })),
    Promise.resolve(sdk.AvalancheUserLPs({ id: MAKER_CONFIG[ChainKey.AVALANCHE].address })).then((result) => ({
      network: [ChainKey.AVALANCHE],
      address: MAKER_CONFIG[ChainKey.AVALANCHE].address,
      type: MAKER_CONFIG[ChainKey.AVALANCHE].type,
      liquidityPositions: result,
    })),
    Promise.resolve(sdk.CeloUserLPs({ id: MAKER_CONFIG[ChainKey.CELO].address })).then((result) => ({
      network: [ChainKey.CELO],
      address: MAKER_CONFIG[ChainKey.CELO].address,
      type: MAKER_CONFIG[ChainKey.CELO].type,
      liquidityPositions: result,
    })),
    Promise.resolve(sdk.MoonriverUserLPs({ id: MAKER_CONFIG[ChainKey.MOONRIVER].address })).then((result) => ({
      network: [ChainKey.MOONRIVER],
      address: MAKER_CONFIG[ChainKey.MOONRIVER].address,
      type: MAKER_CONFIG[ChainKey.MOONRIVER].type,
      liquidityPositions: result,
    })),
    Promise.resolve(sdk.FuseUserLPs({ id: MAKER_CONFIG[ChainKey.FUSE].address })).then((result) => ({
      network: [ChainKey.FUSE],
      address: MAKER_CONFIG[ChainKey.FUSE].address,
      type: MAKER_CONFIG[ChainKey.FUSE].type,
      liquidityPositions: result,
    })),
  ])
}
