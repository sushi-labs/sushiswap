import { expect } from '@playwright/test'
import type { EvmCurrency } from 'sushi/evm'
import {
  http,
  createTestClient,
  erc20Abi,
  publicActions,
  walletActions,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { polygon } from 'viem/chains'
import { transactionTimeout } from './constants'

// Public, funded Anvil account. Each worker uses a separate chain instance.
export const account = privateKeyToAccount(
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
)

export function createForkClient(url: string) {
  return createTestClient({
    chain: polygon,
    account,
    mode: 'anvil',
    pollingInterval: 100,
    transport: http(url, { timeout: transactionTimeout, retryCount: 0 }),
  })
    .extend(publicActions)
    .extend(walletActions)
}

export type ForkClient = ReturnType<typeof createForkClient>

export async function currencyBalance(
  client: ForkClient,
  currency: EvmCurrency,
): Promise<bigint> {
  return currency.type === 'native'
    ? client.getBalance({ address: account.address })
    : client.readContract({
        address: currency.address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [account.address],
      })
}

export async function stopFork(url: string): Promise<void> {
  const response = await fetch(`${url}/stop`, {
    signal: AbortSignal.timeout(10_000),
  })
  const result: unknown = await response.json()
  expect(result, 'Anvil worker shut down').toEqual({ success: true })
}
