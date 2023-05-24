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
// const AMOUNT = '10'

// test.describe('Create multiple stream', () => {
//   test('Create ETH, WETH, from wallet and from bentobox at once', async ({ page }) => {
//     const url = (process.env.PLAYWRIGHT_URL as string).concat('/stream/create/multiple')
//     await page.goto(url)
//     await selectNetwork(page, CHAIN_ID)

//     // Add native stream
//     await addStream(page, '0')

//     // Add wrapped stream
//     await depositToWrapped(AMOUNT, CHAIN_ID)
//     await addStream(page, '1', false)

//     // Add bentobox stream
//     await depositToBento(AMOUNT, CHAIN_ID)
//     await addStream(page, '2', false, true)

//     // Go to review
//     await page.locator(`[testdata-id=furo-create-multiple-streams-review-button]`).click()

//     // Check review
//     await expect(page.locator('[testdata-id=create-multiple-streams-review-token-symbol-0]')).toContainText(
//       NATIVE_TOKEN.symbol
//     )
//     await expect(page.locator('[testdata-id=create-multiple-streams-review-token-symbol-1]')).toContainText(
//       WNATIVE_TOKEN.symbol
//     )
//     await expect(page.locator('[testdata-id=create-multiple-streams-review-total-amount-0]')).toContainText(AMOUNT)
//     await expect(page.locator('[testdata-id=create-multiple-streams-review-total-amount-1]')).toContainText(
//       (Number(AMOUNT) * 2).toString()
//     )

//     // Approve BentoBox
//     await page
//       .locator('[testdata-id=furo-create-multiple-streams-approve-bentobox-button]')
//       .click({ timeout: 1500 })
//       .then(async () => {
//         console.log(`BentoBox Approved`)
//       })
//       .catch(() => console.log('BentoBox already approved or not needed'))

//     // Approve Token
//     await page
//       .locator('[testdata-id=furo-create-multiple-streams-approve-token1-button]')
//       .click({ timeout: 1500 })
//       .then(async () => {
//         console.log(`${WNATIVE_TOKEN.symbol} Approved`)
//       })
//       .catch(() => console.log(`${WNATIVE_TOKEN.symbol} already approved or not needed`))

//     // Create streams
//     await timeout(1000) //confirm button can take some time to appear
//     const confirmCreateVestingButton = page.locator('[testdata-id=furo-create-multiple-streams-confirm-button]')
//     await expect(confirmCreateVestingButton).toBeEnabled()
//     await confirmCreateVestingButton.click()

//     await expect(page.locator('div', { hasText: 'Creating 3 streams' }).last()).toContainText('Creating 3 streams')
//     await expect(page.locator('div', { hasText: 'Transaction Completed' }).last()).toContainText(
//       'Transaction Completed'
//     )
//   })
// })

// async function addStream(page: Page, index: string, isNative = true, fromBentobox = false) {
//   // Add item
//   await page.locator(`[testdata-id=furo-create-multiple-streams-add-item-button]`).click()

//   // Select token
//   await selectToken(page, index, isNative)

//   // Add amount
//   await page.locator(`[testdata-id=create-multiple-streams-amount-input-${index}]`).fill(AMOUNT)

//   // Add recipient
//   await page.locator(`[testdata-id=recipient-${index}-input]`).fill(RECIPIENT)

//   // Select source
//   await page.locator(`[testdata-id=create-multiple-streams-fund-source-button-${index}]`).click()
//   await page
//     .locator(`[testdata-id=create-multiple-streams-fund-source-${fromBentobox ? 'bentobox' : 'wallet'}-${index}]`)
//     .click()

//   // Select dates
//   await selectDate(`create-multiple-streams-start-date-${index}`, 1, page)
//   await selectDate(`create-multiple-streams-end-date-${index}`, 2, page)
// }

// async function selectToken(page: Page, index: string, isNative = true) {
//   // Token selector
//   await page.locator(`[testdata-id=create-multiple-streams-token-selector-button-${index}]`).click()
//   await page.fill(
//     `[testdata-id=create-multiple-streams-${index}-token-selector-dialog-address-input]`,
//     isNative ? NATIVE_TOKEN.symbol : WNATIVE_TOKEN.symbol
//   )
//   await timeout(1000) // wait for the list to load instead of using timeout
//   await page
//     .locator(
//       `[testdata-id=create-multiple-streams-${index}-token-selector-dialog-row-${
//         isNative ? NATIVE_TOKEN.address : WNATIVE_TOKEN.address
//       }]`
//     )
//     .click()
// }