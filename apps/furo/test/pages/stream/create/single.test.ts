// import { AddressZero } from '@ethersproject/constants'
// import { expect, Page, test } from '@playwright/test'
// import { Native } from '@sushiswap/currency'
// import { depositToBento, depositToWrapped, selectDate, selectNetwork, timeout, Token } from 'test/utils'

// if (!process.env.CHAIN_ID) {
//   throw new Error('CHAIN_ID env var not set')
// }

// const CHAIN_ID = parseInt(process.env.CHAIN_ID)
// const RECIPIENT = '0x23defc2ca207e7fbd84ae43b00048fb5cb4db5b2'
// const NATIVE_TOKEN: Token = {
//   address: AddressZero,
//   symbol: Native.onChain(CHAIN_ID).symbol,
// }
// const WNATIVE_TOKEN = {
//   address: Native.onChain(CHAIN_ID).wrapped.address.toLowerCase(),
//   symbol: Native.onChain(CHAIN_ID).wrapped.symbol ?? 'WETH',
// }
// const AMOUNT = '10.0'

// test.describe('Create single stream', () => {
//   test.beforeEach(async ({ page }) => {
//     const url = (process.env.PLAYWRIGHT_URL as string).concat('/stream/create/single')
//     await page.goto(url)
//     await selectNetwork(page, CHAIN_ID)

//     // Date
//     await selectDate('stream-start-date', 1, page)
//     await selectDate('stream-end-date', 2, page)

//     // Recipient
//     await page.locator(`[testdata-id=create-stream-recipient-input]`).fill(RECIPIENT)

//     // Amount
//     await page.locator('[testdata-id=create-stream-amount-input]').fill(AMOUNT)
//   })

//   test('Create a stream, native token', async ({ page }) => {
//     await selectToken(page)

//     // Fund source
//     await page.locator(`[testdata-id=fund-source-wallet-button]`).click()

//     await approveAndConfirm(page)
//   })

//   test('Create a stream using bentobox balance', async ({ page }) => {
//     //deposit 1 native to bentobox
//     await depositToBento(AMOUNT, CHAIN_ID)

//     await selectToken(page, false)

//     // Fund source
//     await page.locator(`[testdata-id=fund-source-bentobox-button]`).click()

//     await approveAndConfirm(page, false)
//   })

//   test('Create a stream using wrapped balance', async ({ page }) => {
//     //deposit 1 native to bentobox
//     await depositToWrapped(AMOUNT, CHAIN_ID)

//     await selectToken(page, false)

//     // Fund source
//     await page.locator(`[testdata-id=fund-source-wallet-button]`).click()

//     await approveAndConfirm(page, false)
//   })
// })

// async function approveAndConfirm(page: Page, isNative = true) {
//   // Approve BentoBox
//   await page
//     .locator('[testdata-id=furo-create-single-stream-approve-bentobox-button]')
//     .click({ timeout: 1500 })
//     .then(async () => {
//       console.log(`BentoBox Approved`)
//     })
//     .catch(() => console.log('BentoBox already approved or not needed'))

//   if (!isNative) {
//     // Approve Token
//     await page
//       .locator('[testdata-id=furo-create-single-stream-approve-token-button]')
//       .click({ timeout: 1500 })
//       .then(async () => {
//         console.log(`${WNATIVE_TOKEN.symbol} Approved`)
//       })
//       .catch(() => console.log(`${WNATIVE_TOKEN.symbol} already approved or not needed`))
//   }

//   const confirmCreateStreamButton = page.locator(`[testdata-id=furo-create-single-stream-confirm-button]`)

//   await expect(confirmCreateStreamButton).toBeEnabled()
//   await confirmCreateStreamButton.click()

//   const expectedText = new RegExp(`Created .* ${isNative ? NATIVE_TOKEN.symbol : WNATIVE_TOKEN.symbol} stream`)
//   await expect(page.locator('div', { hasText: expectedText }).last()).toContainText(expectedText)
// }

// async function selectToken(page: Page, isNative = true) {
//   // Token selector
//   await page.locator(`[testdata-id=token-selector-button]`).click()
//   await page.fill(
//     `[testdata-id=create-single-stream-token-selector-dialog-address-input]`,
//     isNative ? NATIVE_TOKEN.symbol : WNATIVE_TOKEN.symbol
//   )
//   await timeout(1000) // wait for the list to load instead of using timeout
//   await page
//     .locator(
//       `[testdata-id=create-single-stream-token-selector-dialog-row-${
//         isNative ? NATIVE_TOKEN.address : WNATIVE_TOKEN.address
//       }]`
//     )
//     .click()
// }