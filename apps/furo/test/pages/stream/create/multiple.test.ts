import { AddressZero } from '@ethersproject/constants'
import { expect, Page, test } from '@playwright/test'
import { Native, Token, Type, USDC_ADDRESS } from '@sushiswap/currency'
import { selectDate, switchNetwork, timeout } from '../../../utils'

const CHAIN_ID = parseInt(process.env.CHAIN_ID as string)
const RECIPIENT = '0x23defc2ca207e7fbd84ae43b00048fb5cb4db5b2'
const NATIVE_TOKEN = Native.onChain(CHAIN_ID)
const USDC = new Token({
  chainId: CHAIN_ID,
  address: USDC_ADDRESS[CHAIN_ID as keyof typeof USDC_ADDRESS],
  decimals: 18,
  symbol: 'USDC',
  name: 'USDC Stablecoin',
})
const AMOUNT = '10'

interface StreamInput {
  amount: string
  token: Type
  recipient: string
}

test.describe('Create multiple stream', () => {
  test('Create ETH, WETH, from wallet and from bentobox at once', async ({ page }) => {
    const url = (process.env.PLAYWRIGHT_URL as string).concat('/stream/create/multiple')
    await page.goto(url)
    await switchNetwork(page, CHAIN_ID)

    // Add native stream
    await addStream(page, '0', { token: NATIVE_TOKEN, amount: AMOUNT, recipient: RECIPIENT })

    // Add wrapped stream
    // await depositToWrapped(AMOUNT, CHAIN_ID)
    await addStream(page, '1', { token: USDC, amount: '0.00001', recipient: RECIPIENT })

    // Add bentobox stream
    // await depositToBento(AMOUNT, CHAIN_ID)
    // await addStream(page, '2', { token: NATIVE_TOKEN, amount: AMOUNT, recipient: RECIPIENT }) // TODO: create stream with source from bento 

    // Go to review
    await page.locator('[testdata-id=furo-create-multiple-streams-review-button]').click()

    // TODO: add review assertions, make sure the input given is the same shown here.
    // // Check review
    // await expect(page.locator('[testdata-id=create-multiple-streams-review-token-symbol-0]')).toContainText(
    //   NATIVE_TOKEN.symbol
    // )
    // await expect(page.locator('[testdata-id=create-multiple-streams-review-token-symbol-1]')).toContainText(
    //   NATIVE_TOKEN.symbol
    // )
    // await expect(page.locator('[testdata-id=create-multiple-streams-review-total-amount-0]')).toContainText(AMOUNT)
    // await expect(page.locator('[testdata-id=create-multiple-streams-review-total-amount-1]')).toContainText(
    //   (Number(AMOUNT) * 2).toString()
    // )

    // Approve BentoBox
    await page
      .locator('[testdata-id=furo-create-multiple-stream-approve-bentobox-button]')
      .click({ timeout: 1500 })
      .then(async () => {
        console.log('BentoBox Approved')
      })
      .catch(() => console.log('BentoBox already approved or not needed'))

    // Approve Token
    await page
      .locator('[testdata-id=furo-create-multiple-stream-approve-token1-button]')
      .click({ timeout: 1500 })
      .then(async () => {
        console.log(`${NATIVE_TOKEN.symbol} Approved`)
      })
      .catch(() => console.log(`${NATIVE_TOKEN.symbol} already approved or not needed`))

    // Create streams
    const confirmCreateVestingButton = page.locator('[testdata-id=furo-create-multiple-streams-confirm-button]')
    await expect(confirmCreateVestingButton).toBeVisible({timeout: 10_000})
    await expect(confirmCreateVestingButton).toBeEnabled({timeout: 10_000})
    await confirmCreateVestingButton.click()

    await expect(page.locator('div', { hasText: 'Creating 2 streams' }).last()).toContainText('Creating 2 streams')
    await expect(page.locator('div', { hasText: 'Transaction Completed' }).last()).toContainText(
      'Transaction Completed'
    )
  })
})

async function addStream(page: Page, index: string, input: StreamInput, fromBentobox = false) {
  // Add item
  await page.locator('[testdata-id=furo-create-multiple-streams-add-item-button]').click()

  // Select token
  await selectToken(page, index, input.token)

  // Add amount
  await page.locator(`[testdata-id=create-multiple-streams-amount-input-${index}]`).fill(input.amount)

  // Add recipient
  await page.locator(`[testdata-id=create-multiple-streams-recipient-input-${index}]`).fill(input.recipient)

  // Select source
  // TODO: Fix this, but need to add funds to bentobox first
  // await page.locator(`[testdata-id=create-multiple-streams-fund-source-button-${index}]`).click()
  // await page
  //   .locator(`[testdata-id=create-multiple-streams-fund-source-${fromBentobox ? 'bentobox' : 'wallet'}-${index}]`)
  //   .click()

  // Select dates
  await selectDate(`create-multiple-streams-start-date-${index}`, 1, page)
  await selectDate(`create-multiple-streams-end-date-${index}`, 2, page)
}

async function selectToken(page: Page, index: string, currency: Type) {
  // Token selector
  await page.locator(`[testdata-id=stream-currency-selector-row-${index}-button]`).click()
  await page.fill(
    `[testdata-id=create-single-stream-${index}-address-input]`,
    currency.symbol as string
  )
  await timeout(1000) // wait for the list to load instead of using timeout
  await page
    .locator(
      `[testdata-id=create-single-stream-${index}-row-${currency.isNative ? AddressZero : currency.address.toLowerCase()}]`
    )
    .click()
}
