import type { Hex } from 'viem'
import type { ForkController } from './fork-controller'
import { fromHexQuantity, isRecord } from './json-rpc'

export interface AgenticTransactionReceipt {
  readonly blockNumber: bigint
  readonly gasUsed: bigint
  readonly logs: readonly unknown[]
  readonly status: 'reverted' | 'success'
  readonly transactionHash: Hex
}

export async function waitForSuccessfulReceipt(
  controller: ForkController,
  hash: Hex,
  options: {
    readonly intervalMs?: number
    readonly timeoutMs?: number
  } = {},
): Promise<AgenticTransactionReceipt> {
  const receipt = await waitForReceipt(controller, hash, options)
  if (receipt.status !== 'success') {
    throw new Error(`Transaction ${hash} reverted`)
  }
  return receipt
}

export async function waitForReceipt(
  controller: ForkController,
  hash: Hex,
  options: {
    readonly intervalMs?: number
    readonly timeoutMs?: number
  } = {},
): Promise<AgenticTransactionReceipt> {
  const intervalMs = options.intervalMs ?? 500
  const timeoutMs = options.timeoutMs ?? 60_000
  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline) {
    const rawReceipt = await controller.requestAdmin<unknown>(
      'eth_getTransactionReceipt',
      [hash],
    )
    if (rawReceipt !== null) {
      return parseReceipt(rawReceipt)
    }
    await delay(intervalMs)
  }

  throw new Error(`Timed out waiting for transaction receipt ${hash}`)
}

export function parseReceipt(value: unknown): AgenticTransactionReceipt {
  if (
    !isRecord(value) ||
    typeof value.transactionHash !== 'string' ||
    typeof value.blockNumber !== 'string' ||
    typeof value.gasUsed !== 'string' ||
    typeof value.status !== 'string' ||
    !Array.isArray(value.logs)
  ) {
    throw new Error('Malformed transaction receipt')
  }

  if (value.status !== '0x0' && value.status !== '0x1') {
    throw new Error(`Unknown transaction receipt status: ${value.status}`)
  }

  return {
    blockNumber: fromHexQuantity(value.blockNumber),
    gasUsed: fromHexQuantity(value.gasUsed),
    logs: value.logs,
    status: value.status === '0x1' ? 'success' : 'reverted',
    transactionHash: value.transactionHash as Hex,
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
