import { Networks } from '@stellar/stellar-sdk'

// SET THIS FLAG AS NEEDED - this change cascades to many areas of the codebase
export const IS_FUTURENET = false

export const RPC_URL = 'https://rpc.ankr.com/stellar_soroban'
//IS_FUTURENET ?
// ? 'https://rpc-futurenet.stellar.org'
// : 'https://rpc.ankr.com/stellar_soroban/e6ef92f5420048573bc2887637ca25e41a472789ba54014c6a74c52c7f1af408'

export const NETWORK_PASSPHRASE = IS_FUTURENET
  ? Networks.FUTURENET
  : Networks.PUBLIC

export const HORIZON_URL = IS_FUTURENET
  ? 'https://horizon-futurenet.stellar.org'
  : 'https://horizon.stellar.lobstr.co'
