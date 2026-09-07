import { type Locator, type Page, expect, test } from '@playwright/test'
import { type TransactionReceipt, isHash, stringify } from 'viem'
import { transactionTimeout } from '../constants'
import type { Fork } from '../fixtures'

export class BaseActions {
  readonly page: Page

  constructor(
    page: Page,
    readonly fork: Fork,
  ) {
    this.page = page
  }

  async connect() {
    const connectSelector = this.page
      .locator('[testdata-id=connect-button]:visible')
      .first()
    const connectedWalletSelector = this.page
      .locator(
        '[data-sidebar-trigger]:not([testdata-id=connect-button]):visible',
      )
      .first()

    await expect(
      connectSelector.or(connectedWalletSelector).first(),
    ).toBeVisible({ timeout: 30_000 })

    if (await connectedWalletSelector.isVisible()) return

    await expect(connectSelector).toBeEnabled()
    await connectSelector.click()

    await expect(connectedWalletSelector).toBeVisible()
  }

  async selectNetwork(chainId: number) {
    const networkToSelect = this.page.locator(
      `[testdata-id=network-selector-${chainId}]`,
    )
    await expect(networkToSelect).toBeVisible()
    await expect(networkToSelect).toBeEnabled()
    await networkToSelect.click()
  }

  async switchNetwork(chainId: number) {
    const switchNetworkBtn = this.page
      .locator(`[testdata-id=switch-network-${chainId}-button]`)
      .first()
    await expect(switchNetworkBtn).toBeVisible()
    await expect(switchNetworkBtn).toBeEnabled()
    await switchNetworkBtn.click()
  }

  async approveIfNeeded(approve: Locator, ready: Locator): Promise<void> {
    await expect
      .poll(
        async () => (await approve.isVisible()) || (await ready.isEnabled()),
        {
          message: 'Allowance check resolves',
        },
      )
      .toBe(true)
    if (await approve.isVisible()) {
      await expect(approve).toBeEnabled()
      await this.transact('Approve pool token', () => approve.click())
    }
  }

  async transact(
    name: string,
    action: () => Promise<unknown>,
  ): Promise<TransactionReceipt> {
    return test.step(name, async () => {
      const responsePromise = this.page.waitForResponse(
        (response) => {
          const request = response.request()
          if (!request.url().startsWith(new URL(this.fork.url).origin))
            return false
          const body: unknown = request.postDataJSON()
          return (
            !!body &&
            typeof body === 'object' &&
            'method' in body &&
            (body.method === 'eth_sendTransaction' ||
              body.method === 'eth_sendRawTransaction')
          )
        },
        { timeout: transactionTimeout },
      )
      const [response] = await Promise.all([responsePromise, action()])
      const body: unknown = await response.json()
      if (
        !body ||
        typeof body !== 'object' ||
        !('result' in body) ||
        typeof body.result !== 'string' ||
        !isHash(body.result)
      ) {
        throw new Error(`${name}: wallet RPC did not return a transaction hash`)
      }
      const receipt = await this.fork.client.waitForTransactionReceipt({
        hash: body.result,
        timeout: transactionTimeout,
      })
      if (receipt.status === 'reverted') {
        const diagnostics = await Promise.allSettled([
          this.fork.client.getTransaction({ hash: body.result }),
          fetch(this.fork.url, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 1,
              method: 'debug_traceTransaction',
              params: [body.result, { tracer: 'callTracer' }],
            }),
            signal: AbortSignal.timeout(10_000),
          }).then((response) => response.json()),
        ])
        await test.info().attach('reverted-transaction', {
          body: stringify({ receipt, diagnostics }, null, 2),
          contentType: 'application/json',
        })
      }
      expect(
        receipt.status,
        `${name}: transaction ${receipt.transactionHash}`,
      ).toBe('success')
      return receipt
    })
  }
}
