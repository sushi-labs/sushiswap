// import { AddressZero } from '@ethersproject/constants'
// import { expect, Page, test } from '@playwright/test'
// import { Native, Token, Type, USDC_ADDRESS } from '@sushiswap/currency'
// import { GradedVestingFrequency, selectDate, switchNetwork, timeout, VestingArgs } from '../../../utils'

// const CHAIN_ID = parseInt(process.env.CHAIN_ID as string)
// const RECIPIENT = '0x23defc2ca207e7fbd84ae43b00048fb5cb4db5b2'
// const NATIVE_TOKEN = Native.onChain(CHAIN_ID)
// const USDC = new Token({
//   chainId: CHAIN_ID,
//   address: USDC_ADDRESS[CHAIN_ID as keyof typeof USDC_ADDRESS],
//   decimals: 18,
//   symbol: 'USDC',
//   name: 'USDC Stablecoin',
// })

// test.describe('Create multiple vesting', () => {
//   test('Create ETH, WETH, from wallet and from bentobox at once', async ({ page }) => {
//     const url = (process.env.PLAYWRIGHT_URL as string).concat('/vesting/create/multiple')
//     await page.goto(url)
//     await switchNetwork(page, CHAIN_ID)

//     // Add native vesting
//     await addVesting(page, 0, {
//       token: NATIVE_TOKEN,
//       startInMonths: 1,
//       recipient: RECIPIENT,
//       graded: {
//         stepAmount: '1',
//         steps: 12,
//         frequency: GradedVestingFrequency.MONTHLY,
//       },
//     })
//     // Add native vesting with cliff
//     await addVesting(page, 1, {
//       token: NATIVE_TOKEN,
//       startInMonths: 1,
//       recipient: RECIPIENT,
//       graded: {
//         stepAmount: '1',
//         steps: 12,
//         frequency: GradedVestingFrequency.MONTHLY,
//       },
//       cliff: {
//         amount: '10',
//         cliffEndsInMonths: 3,
//       },
//     })
//     // Add graded usdc vesting
//     await addVesting(page, 2, {
//       token: USDC,
//       startInMonths: 1,
//       recipient: RECIPIENT,
//       graded: {
//         stepAmount: '0.0001',
//         steps: 10,
//         frequency: GradedVestingFrequency.BI_WEEKLY,
//       },
//     })
//     // Add usdc vesting with cliff
//     await addVesting(page, 3, {
//       token: USDC,
//       startInMonths: 1,
//       recipient: RECIPIENT,
//       graded: {
//         stepAmount: '0.0001',
//         steps: 10,
//         frequency: GradedVestingFrequency.BI_WEEKLY,
//       },
//       cliff: {
//         amount: '0.00001',
//         cliffEndsInMonths: 3,
//       },
//     })

//     //
//     const reviewButtonLocator = page.locator('[testdata-id=vesting-review-button]')
//     await expect(reviewButtonLocator).toBeVisible({ timeout: 10_000 })
//     await expect(reviewButtonLocator).toBeEnabled({ timeout: 10_000 })
//     await reviewButtonLocator.click()

//     // Approve BentoBox
//     await page
//       .locator('[testdata-id=multiple-vest-approve-bentobox-button]')
//       .click({ timeout: 1500 })
//       .then(async () => {
//         console.log('BentoBox Approved')
//       })
//       .catch(() => console.log('BentoBox already approved or not needed'))

//     // Approve Token
//     await page
//       .locator('[testdata-id=multiple-vest-approve-token1-button]')
//       .click({ timeout: 1500 })
//       .then(async () => {
//         console.log('Approved ERC20')
//       })
//       .catch(() => console.log('ERC20 already approved or not needed'))

//     // Create vestings
//     await timeout(2_500) 
//     const confirmCreateVestingButton = page.locator('[testdata-id=multiple-vest-confirm-button]')
//     await expect(confirmCreateVestingButton).toBeVisible({ timeout: 10_000 })
//     await expect(confirmCreateVestingButton).toBeEnabled({ timeout: 10_000 })
//     await confirmCreateVestingButton.click()

//     await expect(page.locator('div', { hasText: 'Creating 4 vests' }).last()).toContainText('Creating 4 vests')
//     await expect(page.locator('div', { hasText: 'Transaction Completed' }).last()).toContainText(
//       'Transaction Completed'
//     )
//   })
// })

// async function addVesting(page: Page, index: number, args: VestingArgs) {
//   await page.locator('[testdata-id=vesting-add-item-button]').click()
//   await selectToken(page, index, args.token)
//   await page.locator(`[testdata-id=vesting-recipient-input-${index}]`).fill(args.recipient)
//   await selectDate(`[testdata-id=vesting-start-date-${index}]`, args.startInMonths, page)
//   await handleSchedule(page, index, args)

//   const closeDrawerSelector = page.locator(`[testdata-id=vesting-schedule-${index}-close-drawer-button]`)
//   await expect(closeDrawerSelector).toBeVisible()
//   await expect(closeDrawerSelector).toBeEnabled()
//   await closeDrawerSelector.click()
// }

// async function selectToken(page: Page, index: number, currency: Type) {
//   // Token selector
//   await page.locator(`[testdata-id=vesting-currency-selector-row-${index}-button]`).click()
//   await page.fill(`[testdata-id=vesting-token-selector-${index}-address-input]`, currency.symbol as string)
//   await timeout(1000) // wait for the list to load instead of using timeout
//   await page
//     .locator(
//       `[testdata-id=vesting-token-selector-${index}-row-${
//         currency.isNative ? AddressZero : currency.address.toLowerCase()
//       }]`
//     )
//     .click()
// }

// async function handleSchedule(page: Page, index: number, args: VestingArgs) {
//   const openScheduleSelector = page.locator(`[testdata-id=vesting-schedule-${index}-button]`)
//   await expect(openScheduleSelector).toBeVisible()
//   await expect(openScheduleSelector).toBeEnabled()
//   await openScheduleSelector.click()
//   await handleCliffDetails(page, index, args)
//   await handleGradeDetails(page, index, args)
// }

// async function handleCliffDetails(page: Page, index: number, args: VestingArgs) {
//   if (!args.cliff) {
//     return
//   }
//   const cliffSwitchSelector = page.locator(`[testdata-id=vesting-schedule-cliff-${index}-toggle-switch]`)
//   await expect(cliffSwitchSelector).toBeVisible()
//   await expect(cliffSwitchSelector).toBeEnabled()
//   await cliffSwitchSelector.click()

//   const cliffAmountSelector = page.locator(`[testdata-id=vesting-schedule-cliff-${index}-amount-input]`)
//   await expect(cliffAmountSelector).toBeVisible()
//   await expect(cliffAmountSelector).toBeEnabled()
//   await cliffAmountSelector.fill(args.cliff.amount)

//   await selectDate(`[testdata-id=vesting-schedule-cliff-${index}-date]`, args.cliff.cliffEndsInMonths, page)
// }

// async function handleGradeDetails(page: Page, index: number, args: VestingArgs) {
//   const stepAmountSelector = page.locator(`[testdata-id=vesting-schedule-graded-${index}-amount-input]`)
//   await expect(stepAmountSelector).toBeVisible()
//   await expect(stepAmountSelector).toBeEnabled()
//   await stepAmountSelector.fill(args.graded.stepAmount)

//   const stepSelector = page.locator(`[testdata-id=vesting-schedule-graded-${index}-payouts-input]`)
//   await expect(stepSelector).toBeVisible()
//   await expect(stepSelector).toBeEnabled()
//   await stepSelector.fill(args.graded.steps.toString())

//   const selectFrequencySelector = page.locator(
//     `[testdata-id=vesting-schedule-graded-${index}-frequency-selection-button]`
//   )
//   await expect(selectFrequencySelector).toBeVisible()
//   await expect(selectFrequencySelector).toBeEnabled()
//   await selectFrequencySelector.click()

//   const desiredFrequencyoptionSelector = page.locator(
//     `[testdata-id=vesting-schedule-graded-${index}-${args.graded.frequency.toLowerCase()}]`
//   )
//   await expect(desiredFrequencyoptionSelector).toBeVisible()
//   await expect(desiredFrequencyoptionSelector).toBeEnabled()
//   await desiredFrequencyoptionSelector.click()
// }
