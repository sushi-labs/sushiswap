import { getBuiltGraphSDK } from './../.graphclient'
import { ChainId, ChainKey } from '@sushiswap/chain'

interface Maker {
  address: string
  type:
}

const CHAIN_CONFIG: Record<string, Maker> = {
  [ChainKey.ETHEREUM]: {address: '0x5ad6211cd3fde39a9cecb5df6f380b8263d1e277', type: "SushiMaker"},
  [ChainKey.FANTOM]: {address: '0xf9e7d4c6d36ca311566f46c81e572102a2dc9f52', type: "Safe"},
  [ChainKey.MATIC]: {address: '0xf1c9881be22ebf108b8927c4d197d126346b5036', type: "WethMaker"},
  [ChainKey.XDAI]: {address: '0xc375411c6597f692add6a7a3ad5b3c38626b0f26', type: "Safe"},
  [ChainKey.BSC]: {address: '0xc6fd91ad4919fd91e2c84077ba648092cb499638', type: "Safe"},
  [ChainKey.ARBITRUM]: {address: '0xa19b3b22f29e23e4c04678c94cfc3e8f202137d8', type: "WethMaker"},
  [ChainKey.AVALANCHE]: {address: '0x560c759a11cd026405f6f2e19c65da1181995fa2', type: "WethMaker"},
  [ChainKey.HECO]: {address: '0xcc159bcb6a466da442d254ad934125f05dab66b5', type: "Matt"},
  [ChainKey.HARMONY]: {address: '0xCc159BCb6a466DA442D254Ad934125f05DAB66b5', type: "Matt"},
  [ChainKey.OKEX]: {address: '0xcc159bcb6a466da442d254ad934125f05dab66b5', type: "Matt"},
  [ChainKey.CELO]: {address: '0x8b63fcbb752e425e3c4b12f7802bad1a24c6d7f4', type: "Safe"},
  [ChainKey.MOONRIVER]: {address: '0xcc159bcb6a466da442d254ad934125f05dab66b5', type: "Matt"},
  [ChainKey.FUSE]: {address: '0x33b6beb37837459ee84a1ffed2c6a4ca22e5f316', type: "Safe"},
  [ChainKey.MOONBEAM]: {address: '0x87aeb22b7bb02ac42204eb312c08a22fc3f077f3', type: "Safe"},
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
    // return (await sdk.GoerliUserStreams({ id })).GOERLI_STREAM_user ?? {}
  }
}

export const getAllMakers = async () => {
  const sdk = await getBuiltGraphSDK()
  return [
    {
      network: [ChainKey.ETHEREUM],
      address: CHAIN_CONFIG[ChainKey.ETHEREUM].address,
      type: CHAIN_CONFIG[ChainKey.ETHEREUM].type,
      liquidityPositions: (await sdk.EthereumUserLPs({ id: CHAIN_CONFIG[ChainKey.ETHEREUM].address })).ETHEREUM_EXCHANGE_user
        ?.liquidityPositions,
    },
  ]
}
