import * as StellarSdk from '@stellar/stellar-sdk'
import { RPC_URL } from '../constants'

/**
 * Shared transaction helpers for submitting and polling Stellar transactions via raw RPC.
 * These functions are used across multiple services (SwapService, PositionService, etc.)
 * to avoid code duplication.
 */

/**
 * Submit transaction via raw RPC
 * Handles both XDR strings and transaction objects
 */
export async function submitViaRawRPC(signedTx: any): Promise<string> {
  let xdr: string
  if (typeof signedTx === 'string') {
    xdr = signedTx
  } else if (signedTx && typeof signedTx.toXDR === 'function') {
    xdr = signedTx.toXDR()
  } else {
    throw new Error('Invalid transaction format')
  }

  console.log('📤 Submitting transaction via raw RPC...')
  console.log('XDR length:', xdr.length)

  const rpcRequest = {
    jsonrpc: '2.0',
    id: Date.now(),
    method: 'sendTransaction',
    params: {
      transaction: xdr,
    },
  }

  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rpcRequest),
  })

  const result = await response.json()

  console.log('📥 sendTransaction RPC response:', result)

  if (result.error) {
    console.error('❌ sendTransaction returned error:', result.error)
    throw new Error(result.error.message)
  }

  if (!result.result) {
    console.error('❌ No result in sendTransaction response')
    throw new Error('No result in sendTransaction response')
  }

  console.log('Transaction hash:', result.result.hash)
  console.log('Transaction status:', result.result.status)
  console.log('Latest ledger:', result.result.latestLedger)
  console.log('Full result:', result.result)

  // Check if transaction was rejected immediately
  if (result.result.status === 'ERROR') {
    console.error('❌ Transaction submission returned ERROR status')
    console.error('Error details:', result.result)

    // Try to decode the error if available
    if (result.result.errorResultXdr) {
      console.error('Error result XDR:', result.result.errorResultXdr)

      try {
        // Decode the error XDR to get more details
        const errorResult = StellarSdk.xdr.TransactionResult.fromXDR(
          result.result.errorResultXdr,
          'base64',
        )
        console.error('Decoded error result:', errorResult)

        // Get the transaction result code
        const txResult = errorResult.result()
        const txResultSwitch = txResult.switch()
        console.error('Transaction result switch:', txResultSwitch)
        console.error('Transaction result switch name:', txResultSwitch.name)
        console.error('Transaction result switch value:', txResultSwitch.value)

        // Try to extract the operation result
        if (txResult) {
          console.error('Error result value:', txResult)

          // Try to get the fee charged
          const feeCharged = errorResult.feeCharged()
          if (feeCharged !== undefined) {
            console.error('Fee charged:', feeCharged.toString())
          }

          // Check for operation results
          if (
            txResultSwitch.name === 'txFailed' ||
            txResultSwitch.name === 'txSuccess'
          ) {
            try {
              const opResults = txResult.results()
              console.error('Operation results:', opResults)

              if (Array.isArray(opResults)) {
                opResults.forEach((opResult: any, index: number) => {
                  console.error(`Operation ${index} result:`, opResult)
                  const opResultTr = opResult.tr?.()
                  if (opResultTr) {
                    console.error(`Operation ${index} tr:`, opResultTr)
                    const opSwitch = opResultTr.switch?.()
                    if (opSwitch) {
                      console.error(
                        `Operation ${index} switch:`,
                        opSwitch.name,
                        opSwitch.value,
                      )
                    }
                  }
                })
              }
            } catch (opError) {
              console.error('Could not extract operation results:', opError)
            }
          }
        }
      } catch (decodeError) {
        console.error('Failed to decode error XDR:', decodeError)
      }
    }

    throw new Error(
      `Transaction submission failed with ERROR status. Check contract parameters and authorization. Error: ${JSON.stringify(result.result)}`,
    )
  }

  console.log('✅ Transaction submitted successfully')

  return result.result.hash
}

/**
 * Wait for transaction confirmation
 * Polls the transaction status for up to 60 seconds (30 attempts, 2s interval)
 * @param txHash - Transaction hash to poll for
 * @returns Object with success status and optional data/error
 */
export async function waitForTransaction(
  txHash: string,
): Promise<{ success: boolean; data?: any; error?: any }> {
  const maxAttempts = 30
  const intervalMs = 2000

  console.log(`Polling for transaction ${txHash}...`)

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs))

    console.log(
      `[Attempt ${i + 1}/${maxAttempts}] Checking transaction status...`,
    )

    const statusRequest = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'getTransaction',
      params: { hash: txHash },
    }

    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statusRequest),
    })

    const result = await response.json()
    console.log(`[Attempt ${i + 1}/${maxAttempts}] RPC response:`, result)

    if (result.result) {
      const status = result.result.status
      console.log(
        `[Attempt ${i + 1}/${maxAttempts}] Transaction status: ${status}`,
      )

      if (status === 'SUCCESS') {
        console.log(
          'Transaction succeeded! Return value:',
          result.result.returnValue,
        )
        return { success: true, data: result.result }
      } else if (status === 'FAILED') {
        console.error('Transaction failed! Result:', result.result)
        return { success: false, error: result.result }
      } else if (status === 'NOT_FOUND') {
        console.log('Transaction not found yet, continuing to poll...')
      } else {
        console.log(`Transaction status: ${status}, continuing to poll...`)
      }
    } else if (result.error) {
      console.error('RPC error:', result.error)
    }
  }

  throw new Error('Transaction timeout after 60 seconds')
}
