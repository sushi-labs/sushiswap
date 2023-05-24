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
// const AMOUNT = '1'
// const AMOUNT_OF_PERIODS = '5'
// const CLIFF_AMOUNT = '10'

// test.describe('Create single vest', () => {
//   test.beforeEach(async ({ page }) => {
//     const url = (process.env.PLAYWRIGHT_URL as string).concat('/vesting/create/single')
//     await page.goto(url)
//     await selectNetwork(page, CHAIN_ID)

//     // Date
//     await selectDate('vesting-start-date', 1, page)

//     // Recipient
//     await page.locator(`[testdata-id=create-vest-recipient-input]`).fill(RECIPIENT)

//     // Fund source
//     await page.locator(`[testdata-id=fund-source-wallet-button]`).click()

//     // Amount
//     await page.locator('[testdata-id=create-vest-graded-step-amount-input]').fill(AMOUNT)

//     // Amount of periods
//     await page.locator('[testdata-id=furo-graded-vesting-step-amount-input]').fill(AMOUNT_OF_PERIODS)
//     await page.locator('[testdata-id=furo-graded-vesting-step-amount-add-button]').click()
//     await page.locator('[testdata-id=furo-graded-vesting-step-amount-minus-button]').click()

//     // Edit period length
//     await page.locator('[testdata-id=furo-select-period-length-button]').click()
//     await page.locator('text=Bi-weekly').click()
//   })

//   test('Graded', async ({ page }) => {
//     const totalAmount = (Number(AMOUNT) * Number(AMOUNT_OF_PERIODS)).toString()

//     await selectToken(page)

//     await reviewAndConfirm(page, totalAmount)
//   })

//   test('Cliff', async ({ page }) => {
//     const totalAmount = (Number(AMOUNT) * Number(AMOUNT_OF_PERIODS) + Number(CLIFF_AMOUNT)).toString()

//     await selectToken(page)

//     // Add cliff
//     await page.locator('[testdata-id=furo-enable-cliff-button-switch]').click()
//     await selectDate('vesting-cliff-start-date', 1, page)
//     await page.locator('[testdata-id=create-single-vest-input]').fill(CLIFF_AMOUNT)

//     await reviewAndConfirm(page, totalAmount, false, true, true)
//   })

//   test('Graded from bentobox', async ({ page }) => {
//     const totalAmount = (Number(AMOUNT) * Number(AMOUNT_OF_PERIODS)).toString()
//     depositToBento(totalAmount, CHAIN_ID)

//     await selectToken(page, false)

//     // Update funding for bentobox
//     await page.locator(`[testdata-id=fund-source-bentobox-button]`).click()

//     await reviewAndConfirm(page, totalAmount, true, false, false)
//   })

//   test('Graded wrapped native', async ({ page }) => {
//     const totalAmount = (Number(AMOUNT) * Number(AMOUNT_OF_PERIODS)).toString()
//     depositToWrapped(totalAmount, CHAIN_ID)

//     await selectToken(page, false)

//     // Update funding for bentobox
//     await page.locator(`[testdata-id=fund-source-wallet-button]`).click()

//     await reviewAndConfirm(page, totalAmount, false, false, false)
//   })
// })

// async function selectToken(page: Page, isNative = true) {
//   // Token selector
//   await page.locator(`[testdata-id=token-selector-button]`).click()
//   await page.fill(
//     `[testdata-id=create-single-vest-token-selector-dialog-address-input]`,
//     isNative ? NATIVE_TOKEN.symbol : WNATIVE_TOKEN.symbol
//   )
//   await timeout(1000) // wait for the list to load instead of using timeout
//   await page
//     .locator(
//       `[testdata-id=create-single-vest-token-selector-dialog-row-${
//         isNative ? NATIVE_TOKEN.address : WNATIVE_TOKEN.address
//       }]`
//     )
//     .click()
// }

// async function reviewAndConfirm(page: Page, totalAmount: string, fromBento = false, isNative = true, isCliff = false) {
//   // Review
//   await page.locator('[testdata-id=furo-review-vesting-button]').click()

//   // Check review
//   await expect(page.locator('[testdata-id=furo-review-modal-funds-source]')).toContainText(
//     fromBento ? 'bentobox' : 'wallet'
//   )
//   await expect(page.locator('[testdata-id=furo-review-modal-payment-per-period]')).toContainText(
//     `${AMOUNT} ${isNative ? NATIVE_TOKEN.symbol : WNATIVE_TOKEN.symbol}`
//   )
//   await expect(page.locator('[testdata-id=furo-review-modal-total-amount]')).toContainText(totalAmount)
//   await expect(page.locator('[testdata-id=furo-review-modal-period-length]')).toContainText('Bi-weekly')
//   await expect(page.locator('[testdata-id=furo-review-modal-amount-of-periods]')).toContainText(AMOUNT_OF_PERIODS)
//   // Check cliff amount if Cliff
//   if (isCliff) {
//     await expect(page.locator('[testdata-id=furo-review-modal-cliff-amount]')).toContainText(CLIFF_AMOUNT)
//   }

//   // Approve BentoBox
//   await page
//     .locator('[testdata-id=furo-create-single-vest-approve-bentobox-button]')
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

//   // Confirm creation
//   await timeout(1000) //confirm button can take some time to appear
//   const confirmCreateVestingButton = page.locator('[testdata-id=furo-create-single-vest-confirm-button]')
//   expect(confirmCreateVestingButton).toBeEnabled()
//   await confirmCreateVestingButton.click()

//   const expectedText = new RegExp(`Created .* ${isNative ? NATIVE_TOKEN.symbol : WNATIVE_TOKEN.symbol} vesting`)
//   await expect(page.locator('div', { hasText: expectedText }).last()).toContainText(expectedText)
// }