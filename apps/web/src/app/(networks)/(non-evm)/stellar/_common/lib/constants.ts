import { Networks } from '@stellar/stellar-sdk'

// SET THIS FLAG AS NEEDED - this change cascades to many areas of the codebase
export const IS_TESTNET = false

export const NETWORK_NAME = IS_TESTNET ? 'testnet' : 'mainnet'

export const RPC_URL = IS_TESTNET
  ? 'https://soroban-testnet.stellar.org'
  : 'https://rpc.ankr.com/stellar_soroban/e6ef92f5420048573bc2887637ca25e41a472789ba54014c6a74c52c7f1af408'

export const NETWORK_PASSPHRASE = IS_TESTNET
  ? Networks.TESTNET
  : Networks.PUBLIC

export const HORIZON_URL = IS_TESTNET
  ? 'https://horizon-testnet.stellar.org'
  : 'https://horizon.stellar.lobstr.co'
