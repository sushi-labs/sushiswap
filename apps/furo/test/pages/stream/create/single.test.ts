import { AddressZero } from '@ethersproject/constants'
import { expect, Page, test } from '@playwright/test'
import { Native, Token, Type, USDC_ADDRESS } from '@sushiswap/currency'
import { selectDate, switchNetwork, timeout } from '../../../utils'

if (!process.env.CHAIN_ID) {
  throw new Error('CHAIN_ID env var not set')
}

const CHAIN_ID = parseInt(process.env.CHAIN_ID)
const RECIPIENT = '0x23defc2ca207e7fbd84ae43b00048fb5cb4db5b2'

const NATIVE_TOKEN = Native.onChain(CHAIN_ID)
const USDC = new Token({
  chainId: CHAIN_ID,
  address: USDC_ADDRESS[CHAIN_ID as keyof typeof USDC_ADDRESS],
  decimals: 18,
  symbol: 'USDC',
  name: 'USDC Stablecoin',
})
const AMOUNT = '10.0'

test.describe('Create single stream', () => {
  test('Native', async ({ page }) => {
    await createSingleStream(NATIVE_TOKEN, AMOUNT, RECIPIENT, page)
  })

  test('USDC', async ({ page }) => {
    await createSingleStream(USDC, '0.0001', RECIPIENT, page)
  })

  // TODO: bentobox
})

async function createSingleStream(token: Type, amount: string, recipient: string, page: Page) {
  const url = (process.env.PLAYWRIGHT_URL as string).concat('/stream/create/single')
  await page.goto(url)
  await switchNetwork(page, CHAIN_ID)
  // Date
  await selectDate('input[name="dates\\.startDate"]', 1, page)
  await selectDate('input[name="dates\\.endDate"]', 2, page)

  // Recipient
  await page.locator('[testdata-id=create-stream-recipient-input]').fill(recipient)

  // Token
  await selectToken(page, token)

  // Amount
  await page.locator('[testdata-id=create-stream-amount-input]').fill(amount)

  await approve(page, token)

  const confirmCreateStreamButton = page.locator('[testdata-id=create-single-stream-confirmation-button]')

  await expect(confirmCreateStreamButton).toBeVisible()
  await expect(confirmCreateStreamButton).toBeEnabled()
  await confirmCreateStreamButton.click()

  const expectedText = new RegExp(`Created .* ${token.symbol} stream`)
  await expect(page.locator('div', { hasText: expectedText }).last()).toContainText(expectedText)
}

async function approve(page: Page, currency: Type) {
  // Approve BentoBox
  await page
    .locator('[testdata-id=furo-create-single-stream-approve-bentobox]')
    .click({ timeout: 1500 })
    .then(async () => {
      console.log('BentoBox Approved')
    })
    .catch(() => console.log('BentoBox already approved or not needed'))

  if (!currency.isNative) {
    // Approve Token
    await page
      .locator('[testdata-id=furo-create-single-stream-approve-token]')
      .click({ timeout: 1500 })
      .then(async () => {
        console.log(`${currency.symbol} Approved`)
      })
      .catch(() => console.log(`${currency.symbol} already approved or not needed`))
  }
}

async function selectToken(page: Page, currency: Type) {
  // Token selector
  const tokenSelector = page.locator('[testdata-id=create-single-stream-select]')
  await expect(tokenSelector).toBeVisible()
  await expect(tokenSelector).toBeEnabled()
  await tokenSelector.click({ force: true }) // it's missing the click area?! force required.
  await page.fill('[testdata-id=create-single-stream-address-input]', currency.symbol as string)
  const tokenRowSelector = page.locator(
    `[testdata-id=create-single-stream-row-${currency.isNative ? AddressZero : currency.address.toLowerCase()}]`
  )
  await expect(tokenRowSelector).toBeVisible()
  await expect(tokenRowSelector).toBeEnabled()
  await tokenRowSelector.click()
}
