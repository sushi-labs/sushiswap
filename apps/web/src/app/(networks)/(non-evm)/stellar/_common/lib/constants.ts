import type { Networks } from '@stellar/stellar-sdk'
import { getRpcHeaders, getRpcUrl } from 'src/lib/rpc'

//'https://rpc.ankr.com/stellar_soroban' <-- public rpc
// export const RPC_URL =
//   'https://rpc.ankr.com/stellar_soroban/88af76d9ea549790da421fb7e9a57e9da8fa96093e4df2eb55178024423b6f02'

export const RPC_URL = getRpcUrl('stellar')
export const RPC_HEADERS = getRpcHeaders()

// Keep SDK validation type-only so this constant does not pull Stellar into EVM bundles.
export const NETWORK_PASSPHRASE =
  'Public Global Stellar Network ; September 2015' satisfies `${Networks.PUBLIC}`

export const HORIZON_URL = 'https://horizon.stellar.lobstr.co'
