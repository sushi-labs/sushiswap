import { EvmChainId, EvmToken } from 'sushi/evm'

const KINESIS_BRIDGE_EVM_KADENA = new EvmToken({
  chainId: EvmChainId.ETHEREUM,
  address: '0x7786f1eb2ec198a04d8f5e3fc36fab14da370076',
  symbol: 'KDA',
  decimals: 12,
  name: 'KDA',
  metadata: {
    imageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5647.png',
    validated: false,
  },
})

export const KINESIS_BRIDGE_EVM_ETH = new EvmToken({
  chainId: EvmChainId.ETHEREUM,
  address: '0xbddb58bf21b12d70eed91b939ae061572010b11d',
  symbol: 'ETH',
  decimals: 18,
  name: 'Ethereum',
  metadata: {
    imageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    validated: false,
  },
})

const KINESIS_BRIDGE_EVM_USDC = new EvmToken({
  chainId: EvmChainId.ETHEREUM,
  address: '0x81c2813aa88f66bca1e55838045aaceb72febfc1',
  symbol: 'USDC',
  decimals: 6,
  name: 'USDC',
  metadata: {
    imageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
    validated: false,
  },
})
export const COMMON_ETHEREUM_TOKENS: EvmToken[] = [
  KINESIS_BRIDGE_EVM_KADENA,
  KINESIS_BRIDGE_EVM_ETH,
  KINESIS_BRIDGE_EVM_USDC,
]
