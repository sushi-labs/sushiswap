import { createHash } from 'node:crypto';

import { kadenaConfig } from './config';
import { getKadenaNodeUrl } from './index';

interface SimulateTransactionParams {
  code: string
  data?: Record<string, any>
  sender?: string
  gasLimit?: number
  gasPrice?: number
  chainId?: string
  nonce?: string
  from?: string
  to?: string
  signers?: Array<{
    pubKey: string
    sig?: string
  }>
}

interface PactEvent {
  params: any[]
  name: string
  module: {
    namespace: string | null
    name: string
  }
  moduleHash: string
}

interface PublicMeta {
  creationTime: number
  ttl: number
  gasLimit: number
  chainId: string
  gasPrice: number
  sender: string
}

interface MetaData {
  blockTime: number
  prevBlockHash: string
  blockHash: string
  blockHeight: number
  publicMeta: PublicMeta
}

interface PactContinuation {
  pactId: string
  step: number
  stepCount: number
  executed?: boolean
  stepHasRollback?: boolean
  continuation?: object
  yield?: object
}

interface SimulationResult {
  reqKey: string
  result: {
    status: 'success' | 'failure'
    data: any
  }
  txId: number
  logs: string
  metaData: MetaData
  events?: PactEvent[]
  continuation?: PactContinuation | null
  gas: number
}

/**
 * Interface for a Pact capability
 */
interface PactCapability {
  name: string
  args: any[]
}

/**
 * Interface for a Pact signer
 */
interface PactSigner {
  pubKey: string
  address?: string
  scheme?: 'ED25519' | 'ETH'
  clist?: PactCapability[]
}

/**
 * Interface for the Pact API payload
 */
interface PactPayload {
  networkId: 'mainnet01' | 'testnet04' | null
  payload: {
    exec: {
      code: string
      data: any
    }
  }
  meta: {
    chainId: string
    sender: string
    gasLimit: number
    gasPrice: number
    ttl: number
    creationTime: number
  }
  signers: PactSigner[]
  nonce: string
}

/**
 * Interface for the Pact API request body
 */
interface PactRequestBody {
  cmd: string
  hash: string
  sigs: Array<{
    sig: string
  }>
}

/**
 * Simulates a Pact transaction locally without sending it to the blockchain
 * @param params Transaction parameters
 * @returns Promise with simulation results
 */
export async function simulateTransaction({
  code,
  data = {},
  sender = 'kadena',
  gasLimit = Number(kadenaConfig.gasLimit),
  gasPrice = Number(kadenaConfig.gasPrice),
  chainId = kadenaConfig.chainId,
  nonce = JSON.stringify(new Date().toISOString()),
  signers = [],
}: SimulateTransactionParams): Promise<SimulationResult> {
  const nodeUrl = getKadenaNodeUrl()

  try {
    // Create the command payload according to the Kadena Pact API format
    const payload: PactPayload = {
      networkId: null,
      payload: {
        exec: {
          code,
          data,
        },
      },
      meta: {
        chainId,
        sender,
        gasLimit,
        gasPrice,
        ttl: 600,
        creationTime: Math.floor(Date.now() / 1000),
      },
      signers: signers.map((signer) => ({
        pubKey: signer.pubKey,
        ...(signer.sig && { sig: signer.sig }),
      })),
      nonce,
    }

    // Stringify the payload
    const cmd = JSON.stringify(payload)

    // Create the hash using SHA-256 (as a fallback since Blake2s-256 isn't available in Node.js crypto)
    const hash = createHash('sha256')
      .update(cmd)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')

    // Create the request body according to the API schema
    const requestBody: PactRequestBody = {
      cmd,
      hash,
      sigs: signers.map((signer) => ({ sig: signer.sig || '' })),
    }

    const response = await fetch(
      `${nodeUrl}/chainweb/0.0/${kadenaConfig.network}/chain/${chainId}/pact/api/v1/local`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Failed to simulate transaction: ${response.statusText}. ${errorText}`,
      )
    }

    const result = await response.json()

    // Check if the simulation was successful
    if (result.result.status === 'failure') {
      throw new Error(
        `Simulation failed: ${result.result.error?.message || 'Unknown error'}`,
      )
    }

    // Return the complete response format
    return {
      reqKey: result.reqKey,
      result: result.result,
      txId: result.txId,
      logs: result.logs,
      metaData: result.metaData,
      events: result.events,
      continuation: result.continuation,
      gas: result.gas,
    }
  } catch (error) {
    console.error('Error simulating transaction:', error)
    throw error
  }
}
