import type { Signature } from '@solana/keys'
import { getSvmRpc } from './rpc'

const CONFIRMATION_POLL_MS = 2_000
const CONFIRMATION_TIMEOUT_MS = 90_000

export async function waitForSvmSignature(
  signature: string,
  {
    pollMs = CONFIRMATION_POLL_MS,
    timeoutMs = CONFIRMATION_TIMEOUT_MS,
  }: {
    pollMs?: number
    timeoutMs?: number
  } = {},
) {
  const rpc = getSvmRpc()
  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline) {
    const { value } = await rpc
      .getSignatureStatuses([signature as Signature], {
        searchTransactionHistory: true,
      })
      .send()

    const status = value[0]
    if (status) {
      if (status.err) {
        throw new Error('Solana transaction failed')
      }

      if (
        status.confirmationStatus === 'confirmed' ||
        status.confirmationStatus === 'finalized'
      ) {
        return status
      }
    }

    await new Promise((resolve) => setTimeout(resolve, pollMs))
  }

  throw new Error('Timed out waiting for Solana transaction confirmation')
}
