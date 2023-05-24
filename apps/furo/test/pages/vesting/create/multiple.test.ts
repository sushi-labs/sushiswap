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
// const AMOUNT_OF_PERIODS = '5'
// const TOTAL_AMOUNT = (Number(AMOUNT) * Number(AMOUNT_OF_PERIODS)).toString()

// test.describe('Create multiple vesting', () => {
//   test('Create ETH, WETH, With and without cliff, from wallet and from bentobox at once', async ({ page }) => {
//     const url = (process.env.PLAYWRIGHT_URL as string).concat('/vesting/create/multiple')
//     await page.goto(url)
//     await selectNetwork(page, CHAIN_ID)

//     // Add native vesting
//     await addVesting(page, '0')

//     // Add wrapped vesting
//     await depositToWrapped(TOTAL_AMOUNT, CHAIN_ID)
//     await addVesting(page, '1', false)

//     // Add bentobox vesting
//     await depositToBento(TOTAL_AMOUNT, CHAIN_ID)
//     await addVesting(page, '2', false, true)

//     // Add native vesting with cliff
//     await addVesting(page, '3', true, false, true)

//     // Go to review
//     await page.locator(`[testdata-id=furo-create-multiple-vest-review-button]`).click()

//     // Check review
//     await expect(page.locator('[testdata-id=create-multiple-vests-review-token-symbol-0]')).toContainText(
//       NATIVE_TOKEN.symbol
//     )
//     await expect(page.locator('[testdata-id=create-multiple-vests-review-token-symbol-1]')).toContainText(
//       WNATIVE_TOKEN.symbol
//     )
//     await expect(page.locator('[testdata-id=create-multiple-vests-review-total-amount-0]')).toContainText(
//       (Number(TOTAL_AMOUNT) * 2 + Number(AMOUNT)).toString() //2 vests of NATIVE + <AMOUNT> NATIVE in cliff
//     )
//     await expect(page.locator('[testdata-id=create-multiple-vests-review-total-amount-1]')).toContainText(
//       (Number(TOTAL_AMOUNT) * 2).toString() //2 vests WNATIVE
//     )

//     // Approve BentoBox
//     await page
//       .locator('[testdata-id=furo-create-multiple-vests-approve-bentobox-button]')
//       .click({ timeout: 1500 })
//       .then(async () => {
//         console.log(`BentoBox Approved`)
//       })
//       .catch(() => console.log('BentoBox already approved or not needed'))

//     // Approve Token
//     await page
//       .locator('[testdata-id=furo-create-multiple-vests-approve-token1-button]')
//       .click({ timeout: 1500 })
//       .then(async () => {
//         console.log(`${WNATIVE_TOKEN.symbol} Approved`)
//       })
//       .catch(() => console.log(`${WNATIVE_TOKEN.symbol} already approved or not needed`))

//     // Create vestings
//     await timeout(1000) //confirm button can take some time to appear
//     const confirmCreateVestingButton = page.locator('[testdata-id=furo-create-multiple-vests-confirm-button]')
//     await expect(confirmCreateVestingButton).toBeEnabled()
//     await confirmCreateVestingButton.click()

//     await expect(page.locator('div', { hasText: 'Creating 4 vests' }).last()).toContainText('Creating 4 vests')
//     await expect(page.locator('div', { hasText: 'Transaction Completed' }).last()).toContainText(
//       'Transaction Completed'
//     )
//   })
// })

// async function addVesting(page: Page, index: string, isNative = true, fromBentobox = false, isCliff = false) {
//   // Add item
//   await page.locator(`[testdata-id=furo-create-multiple-vest-add-item-button]`).click()

//   // Select token
//   await selectToken(page, index, isNative)

//   // Add recipient
//   await page.locator(`[testdata-id=recipient-${index}-input]`).fill(RECIPIENT)

//   // Select source
//   await page.locator(`[testdata-id=create-multiple-vests-fund-source-button-${index}]`).click()
//   await page
//     .locator(`[testdata-id=create-multiple-vests-fund-source-${fromBentobox ? 'bentobox' : 'wallet'}-${index}]`)
//     .click()

//   // Select start date
//   await selectDate(`create-multiple-vests-start-date-${index}`, 1, page)

//   // Select schedule and amounts
//   await page.locator(`[testdata-id=furo-create-multiple-vests-schedule-${index}]`).click()
//   if (isCliff) {
//     await page.locator(`[testdata-id=furo-create-multiple-vests-schedule-modal-${index}-switch]`).click()
//     await selectDate(`create-multiple-vests-schedule-modal-cliff-date-${index}`, 2, page)
//     await page.locator(`[testdata-id=create-multiple-vests-schedule-modal-${index}-input]`).fill(AMOUNT)
//   }
//   // Fill step details
//   await page.locator(`[testdata-id=create-vest-graded-step-amount-${index}-input]`).fill(AMOUNT)
//   await page
//     .locator(`[testdata-id=create-multiple-vests-schedule-modal-amount-of-periods-${index}-input]`)
//     .fill(AMOUNT_OF_PERIODS)
//   await page
//     .locator(`[testdata-id=create-multiple-vests-schedule-modal-amount-of-periods-${index}-minus-button]`)
//     .click()
//   await page.locator(`[testdata-id=create-multiple-vests-schedule-modal-amount-of-periods-${index}-add-button]`).click()
//   await page.locator(`[testdata-id=create-multiple-vests-schedule-modal-period-length-${index}]`).click()
//   await page.locator('text=Bi-weekly').last().click()

//   // Close modal
//   await page.locator(`[testdata-id=create-multiple-vests-schedule-modal-close-button-${index}]`).click()
// }

// async function selectToken(page: Page, index: string, isNative = true) {
//   // Token selector
//   await page.locator(`[testdata-id=create-multiple-vests-token-selector-button-${index}]`).click()
//   await page.fill(
//     `[testdata-id=create-multiple-vests-${index}-token-selector-dialog-address-input]`,
//     isNative ? NATIVE_TOKEN.symbol : WNATIVE_TOKEN.symbol
//   )
//   await timeout(1000) // wait for the list to load instead of using timeout
//   await page
//     .locator(
//       `[testdata-id=create-multiple-vests-${index}-token-selector-dialog-row-${
//         isNative ? NATIVE_TOKEN.address : WNATIVE_TOKEN.address
//       }]`
//     )
//     .click()
// }