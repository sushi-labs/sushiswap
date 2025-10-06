import {
  Address,
  Contract,
  TransactionBuilder,
  xdr,
} from '@stellar/stellar-sdk'
import { NETWORK_PASSPHRASE, RPC_URL } from '../constants'
import { SorobanClient } from './client'
import { SIMULATION_ACCOUNT } from './constants'
import { CONTRACT_ADDRESSES } from './contract-addresses'

/**
 * Get the XLM balance of an address
 * @param address The address to get the balance of
 * @returns The balance of the address
 */
export const getXlmBalance = async (address: string): Promise<bigint> => {
  try {
    const xlmContract = new Contract(CONTRACT_ADDRESSES.TOKENS.XLM)

    // Build transaction to query balance
    const tx = new TransactionBuilder(SIMULATION_ACCOUNT, {
      fee: '100',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        xlmContract.call('balance', Address.fromString(address).toScVal()),
      )
      .setTimeout(30)
      .build()

    // Simulate the transaction
    const simResult = await SorobanClient.simulateTransaction(tx)

    if ('result' in simResult && simResult.result) {
      const result = simResult.result as any
      if (result.results?.[0]) {
        const scVal = xdr.ScVal.fromXDR(result.results[0].xdr, 'base64')

        // Handle different numeric types
        if (scVal.i128) {
          const i128 = scVal.i128()
          return BigInt(i128.lo().toString())
        } else if (scVal.u128) {
          const u128 = scVal.u128()
          return BigInt(u128.lo().toString())
        } else if (scVal.i64) {
          return BigInt(scVal.i64().toString())
        } else if (scVal.u64) {
          return BigInt(scVal.u64().toString())
        }
      }
    }

    return 0n
  } catch (error) {
    console.error('Error getting XLM balance:', error)
    return 0n
  }
}
