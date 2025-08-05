import { Networks } from '@stellar/stellar-sdk'

export const DEFAULT_DECIMALS_PRECISION = 2

export const IS_TESTNET = true

export const RPC_URL = IS_TESTNET
  ? 'https://soroban-testnet.stellar.org'
  : 'https://soroban.stellar.org'

export const NETWORK_PASSPHRASE = IS_TESTNET
  ? Networks.TESTNET
  : Networks.PUBLIC
