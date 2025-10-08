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
    console.log('🔍 Fetching XLM balance for:', address)
    console.log('📝 XLM Contract Address:', CONTRACT_ADDRESSES.TOKENS.XLM)

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

    console.log('📤 Simulating balance query transaction...')

    // Simulate the transaction
    const simResult = await SorobanClient.simulateTransaction(tx)

    console.log('📥 Simulation result:', JSON.stringify(simResult, null, 2))

    // Check for errors first
    if ('error' in simResult) {
      console.error('❌ Simulation error:', simResult.error)
      return 0n
    }

    if ('result' in simResult && simResult.result) {
      const result = simResult.result as any

      // Try to get the return value directly from retval
      if (result.retval) {
        console.log('📊 Found retval:', result.retval)

        // Check if it's a u128 or i128 ScVal
        if (
          (result.retval._switch?.name === 'scvU128' &&
            result.retval._arm === 'u128') ||
          (result.retval._switch?.name === 'scvI128' &&
            result.retval._arm === 'i128')
        ) {
          const balance = result.retval._value._attributes.lo._value
          console.log('✅ XLM Balance (from retval):', balance)
          return BigInt(balance)
        }
      }

      // Fallback: Try the old method with results array
      if (result.results?.[0]) {
        console.log('📊 Trying results array method...')
        const scVal = xdr.ScVal.fromXDR(result.results[0].xdr, 'base64')

        // Handle different numeric types
        if (scVal.i128) {
          const i128 = scVal.i128()
          const balance = BigInt(i128.lo().toString())
          console.log('✅ XLM Balance (i128):', balance)
          return balance
        } else if (scVal.u128) {
          const u128 = scVal.u128()
          const balance = BigInt(u128.lo().toString())
          console.log('✅ XLM Balance (u128):', balance)
          return balance
        } else if (scVal.i64) {
          const balance = BigInt(scVal.i64().toString())
          console.log('✅ XLM Balance (i64):', balance)
          return balance
        } else if (scVal.u64) {
          const balance = BigInt(scVal.u64().toString())
          console.log('✅ XLM Balance (u64):', balance)
          return balance
        }
      }
    }

    console.warn('⚠️ No balance found in simulation result, returning 0')
    return 0n
  } catch (error) {
    console.error('❌ Error getting XLM balance:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      })
    }
    return 0n
  }
}
