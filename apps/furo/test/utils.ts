import { Page, expect } from '@playwright/test'
import {
  addMonths,
  getUnixTime,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
  startOfDay,
  startOfMonth,
} from 'date-fns'
import { ethers } from 'ethers'
import { Type } from 'sushi/currency'
import { zeroAddress } from 'viem'

const BASE_URL = process.env.PLAYWRIGHT_URL || 'http://localhost:3000/furo'

export async function switchNetwork(page: Page, chainId: number) {
  const networkSelector = page.locator('[testdata-id=network-selector-button]')
  await expect(networkSelector).toBeVisible()
  await expect(networkSelector).toBeEnabled()
  await networkSelector.click()

  const networkToSelect = page.locator(
    `[testdata-id=network-selector-${chainId}]`,
  )
  await networkToSelect.scrollIntoViewIfNeeded()
  await expect(networkToSelect).toBeInViewport({ ratio: 1 })
  await expect(networkToSelect).toBeEnabled()
  await networkToSelect.click()

  await expect(networkToSelect).toBeHidden()
}

export function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export enum GradedVestingFrequency {
  WEEKLY = 'weekly',
  BI_WEEKLY = 'bi-weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

export interface VestingArgs {
  chainId: number
  token: Type
  startInMonths: number
  recipient: string
  graded: {
    stepAmount: string
    steps: number
    frequency: GradedVestingFrequency
  }
  cliff?: {
    amount: string
    cliffEndsInMonths: number
  }
}

export interface StreamArgs {
  chainId: number
  token: Type
  amount: string
  recipient: string
}

export async function selectDate(selector: string, months: number, page: Page) {
  await page.locator(selector).click()
  for (let i = 0; i < months; i++) {
    await page.locator(`[aria-label="Next Month"]`).click()
  }

  await page
    .locator(
      'div.react-datepicker__day.react-datepicker__day--001, div.react-datepicker__day.react-datepicker__day--001.react-datepicker__day--weekend',
    )
    .last()
    .click()

  await page.locator('li.react-datepicker__time-list-item').first().click()
}

export async function createSingleStream(page: Page, args: StreamArgs) {
  const { chainId, token } = args
  const url = BASE_URL.concat('/stream/create/single')
  await page.goto(url)
  await switchNetwork(page, chainId)
  // Date
  await handleStreamInputs(page, args)

  await approve(page, token)

  const reviewStreamButton = page.locator(
    '[testdata-id=review-single-stream-button]',
  )
  await expect(reviewStreamButton).toBeVisible()
  await expect(reviewStreamButton).toBeEnabled()
  await reviewStreamButton.click()

  const confirmCreateStreamButton = page.locator(
    '[testdata-id=confirm-stream-creation-button]',
  )
  await expect(confirmCreateStreamButton).toBeVisible()
  await expect(confirmCreateStreamButton).toBeEnabled()
  await confirmCreateStreamButton.click()

  const regex = new RegExp(`Created .* ${token.symbol} stream`)
  expect(page.getByText(regex))

  async function approve(page: Page, currency: Type) {
    // Approve BentoBox
    await page
      .locator(
        '[testdata-id=furo-create-single-stream-approve-bentobox-button]',
      )
      .click({ timeout: 2000 })
      .then(async () => {
        console.log('BentoBox Approved')
      })
      .catch(() => console.log('BentoBox already approved or not needed'))

    if (!currency.isNative) {
      // Approve Token
      await page
        .locator('[testdata-id=furo-create-single-stream-approve-token-button]')
        .click({ timeout: 2000 })
        .then(async () => {
          console.log(`${currency.symbol} Approved`)
        })
        .catch(() =>
          console.log(`${currency.symbol} already approved or not needed`),
        )
    }
  }
}

export async function createMultipleStreams(
  page: Page,
  chainId: number,
  streamArgs: StreamArgs[],
) {
  const url = BASE_URL.concat('/stream/create/multiple')
  await page.goto(url)
  await switchNetwork(page, chainId)
  let index = 0
  for (const args of streamArgs) {
    if (index > 0) {
      const addVestingLocator = page.locator(
        '[testdata-id=create-multiple-streams-add-item-button]',
      )
      await expect(addVestingLocator).toBeVisible()
      await expect(addVestingLocator).toBeEnabled()
      await addVestingLocator.click()
    }
    await handleStreamInputs(page, args, index)
    index++
  }

  const reviewLocator = page.locator(
    '[testdata-id=create-multiple-streams-review-button]',
  )
  await expect(reviewLocator).toBeVisible()
  await expect(reviewLocator).toBeEnabled()
  await reviewLocator.click()

  // // Approve BentoBox
  const bentoboxLocator = page.locator(
    '[testdata-id=create-multiple-stream-approve-bentobox-button]',
  )
  await expect(bentoboxLocator).toBeVisible()
  await expect(bentoboxLocator).toBeEnabled()
  await bentoboxLocator.click()

  // // Approve Token
  const locator = page.locator(
    '[testdata-id=create-multiple-stream-approve-token-1-button]',
  ) // TODO: refactor, index is hardcoded because we pass in the erc20 after native.
  await expect(locator).toBeVisible()
  await expect(locator).toBeEnabled()
  await locator.click()

  const confirmCreateVestingButton = page.locator(
    '[testdata-id=create-multiple-streams-confirm-button]',
  )
  await expect(confirmCreateVestingButton).toBeVisible()
  await expect(confirmCreateVestingButton).toBeEnabled()
  await confirmCreateVestingButton.click()

  const text = `Created ${streamArgs.length} streams`
  expect(page.getByText(text, { exact: true }))
}

async function handleStreamInputs(page: Page, args: StreamArgs, index = 0) {
  const { token, amount, recipient } = args
  await selectDate(`[testdata-id=stream-start-date${index}]`, 1, page)
  await selectDate(`[testdata-id=stream-end-date${index}]`, 2, page)

  // Recipient
  await page
    .locator(`[testdata-id=create-stream-recipient-input${index}]`)
    .fill(recipient)

  // Token
  const tokenSelector = page.locator(
    `[testdata-id=create-single-stream-token-select${index}]`,
  )
  await expect(tokenSelector).toBeVisible()
  await expect(tokenSelector).toBeEnabled()
  await tokenSelector.click({ force: true }) // it's missing the click area?! force required.
  await page.fill(
    `[testdata-id=create-single-stream-token-selector${index}-address-input]`,
    token.symbol as string,
  )
  const tokenRowSelector = page.locator(
    `[testdata-id=create-single-stream-token-selector${index}-row-${
      token.isNative ? zeroAddress : token.wrapped.address.toLowerCase()
    }]`,
  )

  await expect(tokenRowSelector).toBeVisible()
  await expect(tokenRowSelector).toBeEnabled()
  await tokenRowSelector.click()

  // Amount
  await page
    .locator(`[testdata-id=create-stream-amount-input${index}]`)
    .fill(amount)
}

export async function createSingleVest(page: Page, args: VestingArgs) {
  const url = BASE_URL.concat('/vesting/create/single')
  await page.goto(url)
  await switchNetwork(page, args.chainId)
  await handleGeneralDetails(page, args)
  await handleGradeDetails(page, args)
  if (args.cliff) {
    await handleCliffDetails(page, args)
  }

  // Approve BentoBox
  const bentoboxLocator = page.locator(
    '[testdata-id=create-single-vest-approve-bentobox-button]',
  )
  await expect(bentoboxLocator).toBeVisible()
  await expect(bentoboxLocator).toBeEnabled()
  await bentoboxLocator.click()

  // Approve Token
  if (!args.token.isNative) {
    const locator = page.locator(
      '[testdata-id=create-single-vest-approve-token-button]',
    )
    await expect(locator).toBeVisible()
    await expect(locator).toBeEnabled()
    await locator.click()
  }

  await reviewAndConfirmSingleVest(page, args)
}

export async function createMultipleVests(
  page: Page,
  chainId: number,
  vestingArgs: VestingArgs[],
) {
  const url = BASE_URL.concat('/vesting/create/multiple')
  await page.goto(url)
  await switchNetwork(page, chainId)
  let index = 0
  for (const args of vestingArgs) {
    if (index > 0) {
      const addVestingLocator = page.locator(
        '[testdata-id=create-multiple-vest-add-vest-button]',
      )
      await expect(addVestingLocator).toBeVisible()
      await expect(addVestingLocator).toBeEnabled()
      await addVestingLocator.click()
    }
    await handleGeneralDetails(page, args, index)
    await handleGradeDetails(page, args, index)
    if (args.cliff) {
      await handleCliffDetails(page, args, index)
    }
    index++
  }

  const reviewLocator = page.locator(
    '[testdata-id=create-multiple-vest-review-button]',
  )
  await expect(reviewLocator).toBeVisible()
  await expect(reviewLocator).toBeEnabled()
  await reviewLocator.click()

  // // Approve BentoBox
  const bentoboxLocator = page.locator(
    '[testdata-id=create-multiple-vest-approve-bentobox-button]',
  )
  await expect(bentoboxLocator).toBeVisible()
  await expect(bentoboxLocator).toBeEnabled()
  await bentoboxLocator.click()

  // Approve Token
  const locator = page.locator(
    '[testdata-id=create-multiple-vest-approve-token-1-button]',
  )
  await expect(locator).toBeVisible()
  await expect(locator).toBeEnabled()
  await locator.click()
  const confirmCreateVestingButton = page.locator(
    '[testdata-id=create-multiple-vest-confirm-button]',
  )
  await expect(confirmCreateVestingButton).toBeVisible()
  await expect(confirmCreateVestingButton).toBeEnabled()
  await confirmCreateVestingButton.click()

  const text = `Creating ${vestingArgs.length} vests`
  expect(page.getByText(text, { exact: true }))
}

async function handleGeneralDetails(page: Page, args: VestingArgs, index = 0) {
  const tokenSelector = page.locator(
    `[testdata-id=create-single-vest-select${index}]`,
  )
  await expect(tokenSelector).toBeVisible()
  await expect(tokenSelector).toBeEnabled()
  await tokenSelector.click({ force: true }) // it's missing the click area?! force required.
  await page.fill(
    `[testdata-id=create-single-vest${index}-address-input]`,
    args.token.symbol as string,
  )
  const tokenRowSelector = page.locator(
    `[testdata-id=create-single-vest${index}-row-${
      args.token.isNative
        ? zeroAddress
        : args.token.wrapped.address.toLowerCase()
    }]`,
  )
  await expect(tokenRowSelector).toBeVisible()
  await expect(tokenRowSelector).toBeEnabled()
  await tokenRowSelector.click()

  await selectDate(
    `[testdata-id=create-single-vest-start-date${index}]`,
    args.startInMonths,
    page,
  )
  await page
    .locator(`[testdata-id=create-single-vest-recipient-input${index}]`)
    .fill(args.recipient)
}

async function handleCliffDetails(page: Page, args: VestingArgs, index = 0) {
  if (!args.cliff) {
    throw new Error('Graded vesting args not provided')
  }
  const cliffSwitchSelector = page.locator(
    `[testdata-id=cliff-toggle-switch${index}]`,
  )
  await expect(cliffSwitchSelector).toBeVisible()
  await expect(cliffSwitchSelector).toBeEnabled()
  await cliffSwitchSelector.click()

  const cliffAmountSelector = page.locator(
    `[testdata-id=create-single-vest-cliff-amount-input${index}]`,
  )
  await expect(cliffAmountSelector).toBeVisible()
  await expect(cliffAmountSelector).toBeEnabled()
  await cliffAmountSelector.fill(args.cliff.amount)

  await selectDate(
    `[testdata-id=create-single-vest-cliff-date${index}]`,
    args.cliff.cliffEndsInMonths,
    page,
  )
}

async function handleGradeDetails(page: Page, args: VestingArgs, index = 0) {
  const stepAmountSelector = page.locator(
    `[testdata-id=create-single-vest-graded-amount-input${index}]`,
  )
  await expect(stepAmountSelector).toBeVisible()
  await expect(stepAmountSelector).toBeEnabled()
  await stepAmountSelector.fill(args.graded.stepAmount)

  const stepSelector = page.locator(
    `[testdata-id=create-single-vest-steps-input${index}]`,
  )
  await expect(stepSelector).toBeVisible()
  await expect(stepSelector).toBeEnabled()
  await stepSelector.fill(args.graded.steps.toString())

  const selectFrequencySelector = page.locator(
    `[testdata-id=create-single-vest-graded-frequency-selection-button${index}]`,
  )
  await expect(selectFrequencySelector).toBeVisible()
  await expect(selectFrequencySelector).toBeEnabled()
  await selectFrequencySelector.click()

  const desiredFrequencyoptionSelector = page.locator(
    `[testdata-id=create-single-vest-graded-type-${args.graded.frequency.toLowerCase()}${index}]`,
  )
  await expect(desiredFrequencyoptionSelector).toBeVisible()
  await expect(desiredFrequencyoptionSelector).toBeEnabled()
  await desiredFrequencyoptionSelector.click()
}

async function reviewAndConfirmSingleVest(page: Page, args: VestingArgs) {
  const reviewButtonLocator = page.locator(
    '[testdata-id=review-single-vest-button]',
  )
  await expect(reviewButtonLocator).toBeVisible()
  await expect(reviewButtonLocator).toBeEnabled()
  await reviewButtonLocator.click()

  let totalAmount: string
  if (args.graded && args.cliff) {
    totalAmount = (
      Number(args.cliff.amount) +
      Number(args.graded.stepAmount) * Number(args.graded.steps)
    ).toString()
  } else if (!args.graded && args.cliff) {
    totalAmount = args.cliff.amount
  } else if (args.graded && !args.cliff) {
    totalAmount = (
      Number(args.graded.stepAmount) * Number(args.graded.steps)
    ).toString()
  } else {
    throw new Error('Invalid combination')
  }
  await expect(
    page.locator('[testdata-id=vesting-review-total-amount]'),
  ).toContainText(`${totalAmount} ${args.token.symbol as string}`)

  if (args.graded) {
    await expect(
      page.locator('[testdata-id=vesting-review-payment-per-period]'),
    ).toContainText(args.graded.stepAmount)
    await expect(
      page.locator('[testdata-id=vesting-review-period-length]'),
    ).toContainText(args.graded.frequency, {
      ignoreCase: true,
    })
    await expect(
      page.locator('[testdata-id=vesting-review-amount-of-periods]'),
    ).toContainText(args.graded.steps.toString())
  }

  if (args.cliff) {
    await expect(
      page.locator('[testdata-id=vesting-review-cliff-amount]'),
    ).toContainText(args.cliff.amount)
  }

  // Confirm creation
  const confirmCreateVestingLocator = page.locator(
    '[testdata-id=create-single-vest-confirmation-button]',
  )
  await expect(confirmCreateVestingLocator).toBeVisible()
  await expect(confirmCreateVestingLocator).toBeEnabled()
  await confirmCreateVestingLocator.click()

  const txConfimrationLocator = page.locator(
    '[testdata-id=vest-creation-success-modal-button]',
  )
  await expect(txConfimrationLocator).toBeVisible()
  await expect(txConfimrationLocator).toBeEnabled()
  await txConfimrationLocator.click()
}

export async function increaseEvmTime(unix: number, chainId: number) {
  const provider = new ethers.providers.JsonRpcProvider(
    'http://127.0.0.1:8545',
    chainId,
  )
  await provider.send('evm_mine', [unix])
}

export async function createSnapshot(chainId: number): Promise<string> {
  const provider = new ethers.providers.JsonRpcProvider(
    'http://127.0.0.1:8545',
    chainId,
  )
  return await provider.send('evm_snapshot', [])
}

export async function loadSnapshot(chainId: number, snapshot: string) {
  const provider = new ethers.providers.JsonRpcProvider(
    'http://127.0.0.1:8545',
    chainId,
  )
  await provider.send('evm_revert', [snapshot])
}

export function getStartOfMonthUnix(months: number) {
  const currentDate = new Date()
  const nextMonth = addMonths(currentDate, months)
  const firstDayOfMonth = startOfMonth(nextMonth)
  const startOfNextMonth = setMilliseconds(
    setSeconds(setMinutes(setHours(startOfDay(firstDayOfMonth), 0), 0), 0),
    0,
  )
  return getUnixTime(startOfNextMonth)
}
