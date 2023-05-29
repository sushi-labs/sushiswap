import { JsonRpcProvider } from '@ethersproject/providers'
import { parseUnits } from '@ethersproject/units'
import { expect, Page } from '@playwright/test'
// import { BENTOBOX_ADDRESS } from '@sushiswap/address'
import { ChainId, chainName } from '@sushiswap/chain'
import { AddressZero } from '@ethersproject/constants'
import { Type, WNATIVE_ADDRESS } from '@sushiswap/currency'
import { Contract, Wallet } from 'ethers'



// export const BENTOBOX_DEPOSIT_ABI = [
//   {
//     inputs: [
//       { internalType: 'contract IERC20', name: 'token_', type: 'address' },
//       { internalType: 'address', name: 'from', type: 'address' },
//       { internalType: 'address', name: 'to', type: 'address' },
//       { internalType: 'uint256', name: 'amount', type: 'uint256' },
//       { internalType: 'uint256', name: 'share', type: 'uint256' },
//     ],
//     name: 'deposit',
//     outputs: [
//       { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
//       { internalType: 'uint256', name: 'shareOut', type: 'uint256' },
//     ],
//     stateMutability: 'payable',
//     type: 'function',
//   },
// ]

export async function switchNetwork(page: Page, chainId: number) {
    await page.getByRole('button', { name: 'Ethereum' }).click()
    await page.locator(`[testdata-id=network-selector-${chainId}]`).click()
  }
  
export function timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  
export interface Token {
  address: string
  symbol: string
}



export enum GradedVestingFrequency {
  WEEKLY = 'weekly',
  BI_WEEKLY = 'bi-weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

export interface VestingArgs {
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

export async function selectDate(selector: string, months: number, page: Page) {
  await page.locator(selector).click()
  for (let i = 0; i < months; i++) {
    await page.locator(`[aria-label="Next Month"]`).click()
  }

  await page
    .locator(
      'div.react-datepicker__day.react-datepicker__day--001, div.react-datepicker__day.react-datepicker__day--001.react-datepicker__day--weekend'
    )
    .last()
    .click()

  await page.locator('li.react-datepicker__time-list-item').first().click()
}

export async function createSingleStream(chainId: number, token: Type, amount: string, recipient: string, page: Page) {
  const url = (process.env.PLAYWRIGHT_URL as string).concat('/stream/create/single')
  await page.goto(url)
  await switchNetwork(page, chainId)
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

  await timeout(1_500) // FIXME: this should be removed and the button should be disabled, something isn't prepared yet and but missing validation

  const confirmCreateStreamButton = page.locator('[testdata-id=create-single-stream-confirmation-button]')

  await expect(confirmCreateStreamButton).toBeVisible()
  await expect(confirmCreateStreamButton).toBeEnabled()
  await confirmCreateStreamButton.click()

  const expectedText = new RegExp(`Created .* ${token.symbol} stream`)
  await expect(page.locator('div', { hasText: expectedText }).last()).toContainText(expectedText)

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
  
}
