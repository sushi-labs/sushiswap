import { AddressZero } from '@ethersproject/constants'
import { expect, Page, test } from '@playwright/test'
import { Native, Token, Type, USDC_ADDRESS } from '@sushiswap/currency'
import { selectDate, switchNetwork, timeout } from '../../../utils'

if (!process.env.CHAIN_ID) {
  throw new Error('CHAIN_ID env var not set')
}

enum GradedVestingFrequency {
  WEEKLY = 'weekly',
  BI_WEEKLY = 'bi-weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
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

interface VestingArgs {
  token: Type
  startInMonths: number
  recipient: string
  graded?: {
    stepAmount: string
    steps: number
    frequency: GradedVestingFrequency
  }
  cliff?: {
    amount: string
    cliffEndsInMonths: number
  }
}

test.describe('Create single vest', () => {
  test.beforeEach(async ({ page }) => {
    const url = (process.env.PLAYWRIGHT_URL as string).concat('/vesting/create/single')
    await page.goto(url)
    page.setViewportSize({ width: 1920, height: 1080 })
    await switchNetwork(page, CHAIN_ID)
  })

  test('Graded native', async ({ page }) => {
    const args: VestingArgs = {
      token: NATIVE_TOKEN,
      startInMonths: 1,
      recipient: RECIPIENT,
      graded: {
        stepAmount: '1',
        steps: 12,
        frequency: GradedVestingFrequency.MONTHLY,
      },
    }
    await handleGeneralDetails(page, args)
    await handleGradeDetails(page, args)
    await reviewAndConfirm(page, args)
  })

  test('Cliff native', async ({ page }) => {
    const args: VestingArgs = {
      token: NATIVE_TOKEN,
      startInMonths: 1,
      recipient: RECIPIENT,
      graded: {
        stepAmount: '1',
        steps: 12,
        frequency: GradedVestingFrequency.MONTHLY,
      },
      cliff: {
        amount: '10',
        cliffEndsInMonths: 3,
      },
    }

    await handleGeneralDetails(page, args)
    await handleGradeDetails(page, args)
    await handleCliffDetails(page, args)
    await reviewAndConfirm(page, args)
  })

  test('Graded USDC', async ({ page }) => {
    const args: VestingArgs = {
      token: USDC,
      startInMonths: 1,
      recipient: RECIPIENT,
      graded: {
        stepAmount: '0.0001',
        steps: 10,
        frequency: GradedVestingFrequency.BI_WEEKLY,
      },
    }
    await handleGeneralDetails(page, args)
    await handleGradeDetails(page, args)
    await reviewAndConfirm(page, args)
  })

  test('Cliff USDC', async ({ page }) => {
    const args: VestingArgs = {
      token: USDC,
      startInMonths: 1,
      recipient: RECIPIENT,
      graded: {
        stepAmount: '0.0001',
        steps: 10,
        frequency: GradedVestingFrequency.BI_WEEKLY,
      },
      cliff: {
        amount: '0.00001',
        cliffEndsInMonths: 3,
      },
    }

    await handleGeneralDetails(page, args)
    await handleGradeDetails(page, args)
    await handleCliffDetails(page, args)
    await reviewAndConfirm(page, args)
  })
})

async function handleGeneralDetails(page: Page, args: VestingArgs) {
  await selectToken(page, args.token)
  await selectDate('[testdata-id=create-single-vest-start-date]', args.startInMonths, page)
  await page.locator('[testdata-id=create-single-vest-recipient-input]').fill(args.recipient)
}

async function handleCliffDetails(page: Page, args: VestingArgs) {
  if (!args.cliff) {
    throw new Error('Graded vesting args not provided')
  }
  const cliffSwitchSelector = page.locator('[testdata-id=cliff-toggle-switch]')
  await expect(cliffSwitchSelector).toBeVisible()
  await expect(cliffSwitchSelector).toBeEnabled()
  await cliffSwitchSelector.click()

  const cliffAmountSelector = page.locator('[testdata-id=create-single-vest-cliff-amount-input]')
  await expect(cliffAmountSelector).toBeVisible()
  await expect(cliffAmountSelector).toBeEnabled()
  await cliffAmountSelector.fill(args.cliff.amount)

  await selectDate('[testdata-id=create-single-vest-cliff-date]', args.cliff.cliffEndsInMonths, page)
}

async function handleGradeDetails(page: Page, args: VestingArgs) {
  if (!args.graded) {
    throw new Error('Graded vesting args not provided')
  }
  const stepAmountSelector = page.locator('[testdata-id=create-single-vest-graded-amount-input]')
  await expect(stepAmountSelector).toBeVisible()
  await expect(stepAmountSelector).toBeEnabled()
  await stepAmountSelector.fill(args.graded.stepAmount)

  const stepSelector = page.locator('[testdata-id=create-single-vest-steps-input]')
  await expect(stepSelector).toBeVisible()
  await expect(stepSelector).toBeEnabled()
  await stepSelector.fill(args.graded.steps.toString())

  const selectFrequencySelector = page.locator('[testdata-id=create-single-vest-graded-unit-type-button]')
  await expect(selectFrequencySelector).toBeVisible()
  await expect(selectFrequencySelector).toBeEnabled()
  await selectFrequencySelector.click()

  const desiredFrequencyoptionSelector = page.locator(
    `[testdata-id=create-single-vest-graded-type-${args.graded.frequency.toLowerCase()}]`
  )
  await expect(desiredFrequencyoptionSelector).toBeVisible()
  await expect(desiredFrequencyoptionSelector).toBeEnabled()
  await desiredFrequencyoptionSelector.click()
}

async function selectToken(page: Page, currency: Type) {
  const tokenSelector = page.locator('[testdata-id=create-single-vest-select]')
  await expect(tokenSelector).toBeVisible()
  await expect(tokenSelector).toBeEnabled()
  await tokenSelector.click({ force: true }) // it's missing the click area?! force required.
  await page.fill('[testdata-id=create-single-vest-address-input]', currency.symbol as string)
  const tokenRowSelector = page.locator(
    `[testdata-id=create-single-vest-row-${currency.isNative ? AddressZero : currency.address.toLowerCase()}]`
  )
  await expect(tokenRowSelector).toBeVisible()
  await expect(tokenRowSelector).toBeEnabled()
  await tokenRowSelector.click()
}

async function reviewAndConfirm(page: Page, args: VestingArgs) {
  const reviewButtonLocator = page.locator('[testdata-id=create-single-vesting-review-button]')
  await expect(reviewButtonLocator).toBeVisible()
  await expect(reviewButtonLocator).toBeEnabled()
  await reviewButtonLocator.click()

  await expect(page.locator('[testdata-id=vesting-review-funds-source]')).toContainText('wallet')
  let totalAmount: string
  if (args.graded && args.cliff) {
    totalAmount = (Number(args.cliff.amount) + Number(args.graded.stepAmount) * Number(args.graded.steps)).toString()
  } else if (!args.graded && args.cliff) {
    totalAmount = args.cliff.amount
  } else if (args.graded && !args.cliff) {
    totalAmount = (Number(args.graded.stepAmount) * Number(args.graded.steps)).toString()
  } else {
    throw new Error('Invalid combination')
  }
  await expect(page.locator('[testdata-id=vesting-review-total-amount]')).toContainText(
    `${totalAmount} ${args.token.symbol as string}`
  )

  if (args.graded) {
    await expect(page.locator('[testdata-id=vesting-review-payment-per-period]')).toContainText(args.graded.stepAmount)
    await expect(page.locator('[testdata-id=vesting-review-period-length]')).toContainText(args.graded.frequency, {
      ignoreCase: true,
    })
    await expect(page.locator('[testdata-id=vesting-review-amount-of-periods]')).toContainText(args.graded.steps.toString())
  }

  if (args.cliff) {
    await expect(page.locator('[testdata-id=vesting-review-cliff-amount]')).toContainText(args.cliff.amount)
  }

  // Approve BentoBox
  await page
    .locator('[testdata-id=create-single-vest-approve-bentobox]')
    .click({ timeout: 1500 })
    .then(async () => {
      console.log('BentoBox Approved')
    })
    .catch(() => console.log('BentoBox already approved or not needed'))

  if (!args.token.isNative) {
    // Approve Token
    await page
      .locator('[testdata-id=create-single-vest-approve-token]')
      .click({ timeout: 1500 })
      .then(async () => {
        console.log(`${args.token.symbol} Approved`)
      })
      .catch(() => console.log(`${args.token.symbol} already approved or not needed`))
  }

  // Confirm creation
  await timeout(1_500) // FIXME: should be removed, but something isn't updated yet
  const confirmCreateVestingButton = page.locator('[testdata-id=create-single-vest-confirmation-button]')
  await expect(confirmCreateVestingButton).toBeVisible()
  await expect(confirmCreateVestingButton).toBeEnabled()
  await confirmCreateVestingButton.click()

  const expectedText = new RegExp(`Created .* ${args.token.symbol} vesting`)
  await expect(page.locator('div', { hasText: expectedText }).last()).toContainText(expectedText)
}
