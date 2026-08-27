import { type Page, expect, test } from '@playwright/test'
import {
  TEST_PRIVY_ADDRESS,
  TEST_PRIVY_CHAIN_ID_STORAGE_KEY,
  TEST_PRIVY_LAST_REQUEST_CHAIN_ID_STORAGE_KEY,
  TEST_PRIVY_RUNTIME_DELAY_STORAGE_KEY,
} from 'src/lib/wallet/privy/privy-test-constants'

const ETHEREUM_CHAIN_ID = 1
const ROBINHOOD_CHAIN_ID = 4663

async function installRestorablePrivySession(
  page: Page,
  runtimeDelayMs: number,
): Promise<void> {
  await page.addInitScript(
    ({
      address,
      chainIdKey,
      ethereumChainId,
      runtimeDelayKey,
      runtimeDelayMs,
    }) => {
      window.localStorage.setItem('privy:pat', JSON.stringify('test-pat'))
      window.localStorage.setItem(
        'privy:refresh_token',
        JSON.stringify('test-refresh-token'),
      )
      window.localStorage.setItem(chainIdKey, String(ethereumChainId))
      window.localStorage.setItem(runtimeDelayKey, String(runtimeDelayMs))
      window.localStorage.setItem(
        'wagmi.store',
        JSON.stringify({
          state: {
            connections: {
              __type: 'Map',
              value: [
                [
                  'privy',
                  {
                    accounts: [address],
                    connector: { id: 'io.privy' },
                  },
                ],
              ],
            },
          },
        }),
      )
    },
    {
      address: TEST_PRIVY_ADDRESS,
      chainIdKey: TEST_PRIVY_CHAIN_ID_STORAGE_KEY,
      ethereumChainId: ETHEREUM_CHAIN_ID,
      runtimeDelayKey: TEST_PRIVY_RUNTIME_DELAY_STORAGE_KEY,
      runtimeDelayMs,
    },
  )
}

async function waitForPrivyConnection(page: Page): Promise<void> {
  await expect(
    page.getByRole('button', { name: '0xf39F...2266' }),
  ).toBeVisible()
}

test('shows restoration state until the Privy wallet reconnects', async ({
  page,
}) => {
  await installRestorablePrivySession(page, 1_500)

  await page.goto(`/${ETHEREUM_CHAIN_ID}/swap`)

  await expect(page.getByText('Checking Wallet')).toBeVisible()
  await waitForPrivyConnection(page)
  await expect(page.getByText('Checking Wallet')).toBeHidden()
})

test('switches Privy’s backing provider from Ethereum to Robinhood', async ({
  page,
}) => {
  await installRestorablePrivySession(page, 0)
  await page.goto(`/${ETHEREUM_CHAIN_ID}/swap`)
  await waitForPrivyConnection(page)

  await page.locator('[testdata-id=network-selector-button]').click()
  await page
    .locator(`[testdata-id=network-selector-${ROBINHOOD_CHAIN_ID}]`)
    .click()

  await expect(page).toHaveURL(/\/robinhood\/swap(?:[/?#]|$)/)
  await expect
    .poll(() =>
      page.evaluate(
        (key) => window.localStorage.getItem(key),
        TEST_PRIVY_CHAIN_ID_STORAGE_KEY,
      ),
    )
    .toBe(String(ROBINHOOD_CHAIN_ID))
  await expect
    .poll(() =>
      page.evaluate(
        (key) => window.localStorage.getItem(key),
        TEST_PRIVY_LAST_REQUEST_CHAIN_ID_STORAGE_KEY,
      ),
    )
    .toBe(String(ROBINHOOD_CHAIN_ID))
  await expect(
    page.getByRole('button', { name: 'Robinhood Chain' }),
  ).toBeVisible()
})
