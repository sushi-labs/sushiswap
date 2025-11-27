import { Networks } from '@stellar/stellar-sdk'

export const DEFAULT_DECIMALS_PRECISION = 2

// SET THIS FLAG AS NEEDED - this change cascades to many areas of the codebase
export const IS_TESTNET = true

export const NETWORK_NAME = IS_TESTNET ? 'testnet' : 'mainnet'

export const RPC_URL = IS_TESTNET
  ? 'https://soroban-testnet.stellar.org'
  : 'https://mainnet.sorobanrpc.com'

export const NETWORK_PASSPHRASE = IS_TESTNET
  ? Networks.TESTNET
  : Networks.PUBLIC

export const HORIZON_URL = IS_TESTNET
  ? 'https://horizon-testnet.stellar.org'
  : 'https://horizon.stellar.lobstr.co'
