export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
export const MULTICALL_ADDRESS = '0x1F98415757620B543A52E61c46B32eB19261F984' // Address on Mainnet
export const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
export const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7'

export enum ChainId {
  ETHEREUM = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  POLYGON = 137,
  POLYGON_TESTNET = 80001,
  FANTOM = 250,
  FANTOM_TESTNET = 4002,
  XDAI = 100,
  BINANCE = 56,
  BINANCE_TESTNET = 97,
  ARBITRUM = 42161,
  ARBITRUM_TESTNET = 79377087078960,
  MOONBEAM_TESTNET = 1287,
  AVALANCHE = 43114,
  AVALANCHE_TESTNET = 43113,
  HECO = 128,
  HECO_TESTNET = 256,
  HARMONY = 1666600000,
  HARMONY_TESTNET = 1666700000,
  OKEX = 66,
  OKEX_TESTNET = 65,
  CELO = 42220,
  PALM = 11297108109,
  PALM_TESTNET = 11297108099,
  MOONRIVER = 1285,
  FUSE = 122,
  TELOS = 40,
  HARDHAT = 31337,
  MOONBEAM = 1284,
}

export type Multisig = {
  name: string
  chainId: ChainId
  address: string
}

export const multisigs = [
  { name: 'Ops', chainId: ChainId.ETHEREUM, address: '0x19B3Eb3Af5D93b77a5619b047De0EED7115A19e7' },
  { name: 'Fees', chainId: ChainId.POLYGON, address: '0x850a57630A2012B2494779fBc86bBc24F2a7baeF' },
  { name: 'Ops', chainId: ChainId.POLYGON, address: '0x2B23D9B02FffA1F5441Ef951B4B95c09faa57EBA' },
  { name: 'Ops', chainId: ChainId.XDAI, address: '0xc375411C6597F692Add6a7a3AD5b3C38626B0F26' },
  { name: 'Ops', chainId: ChainId.HARMONY, address: '0x30af69A3f4a6f266961313Ce0943719dF4A8AA10' },
  { name: 'Ops', chainId: ChainId.BINANCE, address: '0xc6fD91aD4919Fd91e2c84077ba648092cB499638' },
  { name: 'Ops', chainId: ChainId.FANTOM, address: '0xF9E7d4c6d36ca311566f46c81E572102A2DC9F52' },
  { name: 'Ops', chainId: ChainId.AVALANCHE, address: '0x09842Ce338647906B686aBB3B648A6457fbB25DA' },
  { name: 'Ops', chainId: ChainId.CELO, address: '0x751b01Fa14fD9640a1DF9014e2D0f3a03A198b81' },
  { name: 'Fees', chainId: ChainId.CELO, address: '0x8b63fcBB752e425e3C4B12F7802BAd1A24c6d7F4' },
  { name: 'Ops', chainId: ChainId.MOONBEAM, address: '0x939f7E76cc515cc296dD3ce362D9a52e148A7D5f' },
  { name: 'Fees', chainId: ChainId.MOONBEAM, address: '0x6669cc35031A84fAc1Efe30bB586B9ADdf223Fbc' },
  { name: 'Ops', chainId: ChainId.FUSE, address: '0x33b6beb37837459Ee84a1Ffed2C6a4ca22e5F316' },
  { name: 'Ops', chainId: ChainId.ARBITRUM, address: '0x978982772b8e4055B921bf9295c0d74eB36Bc54e' },
  { name: 'Ops', chainId: ChainId.MOONBEAM, address: '0x87AEb22b7BB02AC42204eB312C08A22FC3f077F3' },
] as Multisig[]
