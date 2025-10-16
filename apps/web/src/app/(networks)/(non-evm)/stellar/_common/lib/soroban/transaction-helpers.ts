import type { Transaction, xdr } from '@stellar/stellar-sdk'
import { Account, TransactionBuilder } from '@stellar/stellar-sdk'
import { NETWORK_PASSPHRASE } from '../constants'
import { SorobanClient } from './client'
import { DEFAULT_TIMEOUT } from './constants'

/**
 * Submit a signed Stellar transaction to the network
 * @param signedTxXdr - The signed transaction in XDR format
 * @returns The transaction result
 */
export async function submitTransaction(signedTxXdr: string): Promise<{
  hash: string
  result: any
}> {
  try {
    // Parse the signed transaction
    const transaction = TransactionBuilder.fromXDR(
      signedTxXdr,
      NETWORK_PASSPHRASE,
    )

    // Submit the transaction to the network
    const result = await SorobanClient.sendTransaction(transaction)

    console.log('sent txn', result)

    return {
      hash: result.hash,
      result,
    }
  } catch (error) {
    console.error('Error submitting transaction:', error)
    throw error
  }
}

/**
 * Build a transaction with proper account and fee handling
 * @param sourceAccount - The source account for the transaction
 * @param operation - The operation to include
 * @returns Built transaction ready for signing
 */
export async function buildTransaction<T extends xdr.Operation>(
  sourceAccount: string,
  operation: T,
): Promise<Transaction> {
  // Get the current account info to get the correct sequence number
  const accountInfo = await getAccountInfo(sourceAccount)

  const sender = new Account(sourceAccount, accountInfo.sequenceNumber())
  const tx = new TransactionBuilder(sender, {
    fee: '100000', // 0.1 XLM fee (100,000 stroops)
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(operation)
    .setTimeout(DEFAULT_TIMEOUT)
    .build()
  return tx
}

/**
 * Wait for transaction confirmation
 * @param hash - Transaction hash
 * @param timeout - Timeout in milliseconds (default: 30 seconds)
 * @returns Transaction result
 */
export async function waitForTransaction(
  hash: string,
  timeout = 30000,
): Promise<any> {
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    try {
      const result = await SorobanClient.getTransaction(hash)
      console.log('result', result)
      if (result.status === 'SUCCESS') {
        return result
      }
      if (result.status === 'FAILED') {
        throw new Error(`Transaction failed: ${JSON.stringify(result)}`)
      }
    } catch (error) {
      // Transaction might not be available yet, continue waiting
      if (error instanceof Error && error.message?.includes('not found')) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        continue
      }
      throw error
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  throw new Error('Transaction confirmation timeout')
}

/**
 * Get account information for transaction building
 * @param address - Account address
 * @returns Account information
 */
export async function getAccountInfo(address: string) {
  try {
    return await SorobanClient.getAccount(address)
  } catch (error) {
    console.error('Error fetching account info:', error)
    throw error
  }
}
