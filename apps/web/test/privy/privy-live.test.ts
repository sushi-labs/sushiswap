import { type Page, expect, test } from '@playwright/test'

type PrivyTestCredentials = {
  email: string
  otp: string
}

type PrivyNamespace = 'evm' | 'svm'

const EVM_ROUTE = '/ethereum/swap'
const SVM_ROUTE = '/solana/swap'
const PRIVY_EVM_CONNECTOR_ID = 'io.privy.wallet'
const PRIVY_SVM_RECONNECT_STORAGE_KEY = 'sushi:privy-svm-reconnect'

const EVM_ADDRESS_PATTERN = /^0x[a-fA-F0-9]{4}\.\.\.[a-fA-F0-9]{4}$/
const SVM_ADDRESS_PATTERN =
  /^[1-9A-HJ-NP-Za-km-z]{6}\.\.\.[1-9A-HJ-NP-Za-km-z]{4}$/

function getCredentials(): PrivyTestCredentials {
  const email = process.env.PRIVY_TEST_EMAIL
  const otp = process.env.PRIVY_TEST_OTP

  if (!email || !otp) {
    throw new Error(
      'PRIVY_TEST_EMAIL and PRIVY_TEST_OTP are required for live Privy tests',
    )
  }
  if (!/^\d{6}$/.test(otp)) {
    throw new Error('PRIVY_TEST_OTP must be a six-digit test-account code')
  }
  return { email, otp }
}

function getRoute(namespace: PrivyNamespace): string {
  return namespace === 'evm' ? EVM_ROUTE : SVM_ROUTE
}

function getAddressPattern(namespace: PrivyNamespace): RegExp {
  return namespace === 'evm' ? EVM_ADDRESS_PATTERN : SVM_ADDRESS_PATTERN
}

async function openPrivyLogin(
  page: Page,
  namespace: PrivyNamespace,
): Promise<void> {
  await page.goto(getRoute(namespace))

  const connectButton = page.locator('[testdata-id=connect-button]').first()
  await expect(connectButton).toBeVisible()
  await connectButton.click()

  if (namespace === 'svm') {
    await page.getByRole('tab', { name: 'Solana' }).click()
  }

  await page.getByRole('button', { name: /^Email Email(?: Recent)?$/ }).click()
  await expect(page.locator('#email-input')).toBeVisible()
}

async function authenticatePrivy(
  page: Page,
  namespace: PrivyNamespace,
): Promise<string> {
  const { email, otp } = getCredentials()
  await openPrivyLogin(page, namespace)

  await page.locator('#email-input').fill(email)
  await page.getByRole('button', { name: 'Submit', exact: true }).click()

  const firstCodeInput = page.locator('input[name="code-0"]')
  const privyError = page.getByRole('heading', {
    name: 'Something went wrong',
  })
  await expect(firstCodeInput.or(privyError)).toBeVisible()
  if (await privyError.isVisible()) {
    throw new Error(
      'Privy rejected the login request; check the app ID, test account, and allowed origins',
    )
  }
  await firstCodeInput.fill(otp)

  return waitForWalletAddress(page, namespace)
}

async function waitForWalletAddress(
  page: Page,
  namespace: PrivyNamespace,
): Promise<string> {
  const walletButton = page.getByRole('button', {
    name: getAddressPattern(namespace),
  })
  await expect(walletButton).toBeVisible()
  return (await walletButton.innerText()).trim()
}

async function expectEvmReconnectState(page: Page): Promise<void> {
  await expect
    .poll(() =>
      page.evaluate(() => window.localStorage.getItem('wagmi.store') ?? ''),
    )
    .toContain(PRIVY_EVM_CONNECTOR_ID)
}

async function expectSvmReconnectState(page: Page): Promise<void> {
  await expect
    .poll(() =>
      page.evaluate(
        (key) => window.localStorage.getItem(key),
        PRIVY_SVM_RECONNECT_STORAGE_KEY,
      ),
    )
    .toBe('true')
}

test.describe('live Privy authentication', () => {
  test('logs in and connects the EVM embedded wallet', async ({ page }) => {
    await authenticatePrivy(page, 'evm')
    await expectEvmReconnectState(page)
  })

  test('logs in and connects the SVM embedded wallet', async ({ page }) => {
    await authenticatePrivy(page, 'svm')
    await expectSvmReconnectState(page)
  })

  test('reconnects the EVM embedded wallet after reload', async ({ page }) => {
    const address = await authenticatePrivy(page, 'evm')
    await expectEvmReconnectState(page)

    await page.reload()

    await expect(page.locator('#email-input')).toBeHidden()
    const reconnectedAddress = await waitForWalletAddress(page, 'evm')
    expect(reconnectedAddress).toBe(address)
    await expectEvmReconnectState(page)
  })

  test('reconnects the SVM embedded wallet after reload', async ({ page }) => {
    const address = await authenticatePrivy(page, 'svm')
    await expectSvmReconnectState(page)

    await page.reload()

    await expect(page.locator('#email-input')).toBeHidden()
    const reconnectedAddress = await waitForWalletAddress(page, 'svm')
    expect(reconnectedAddress).toBe(address)
    await expectSvmReconnectState(page)
  })
})
