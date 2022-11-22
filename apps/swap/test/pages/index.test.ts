import { AddressZero } from '@ethersproject/constants'
import { expect, Page, test } from '@playwright/test'
import { ChainId } from '@sushiswap/chain'
import { USDC_ADDRESS, USDT_ADDRESS, WBTC_ADDRESS, WNATIVE, WNATIVE_ADDRESS } from '@sushiswap/currency'

// test.describe.configure({ mode: 'parallel' })
const nativeToken = {
  address: AddressZero,
  symbol: 'NATIVE', // not being used except for logging
}
const wNativeToken = {
  address: WNATIVE_ADDRESS[ChainId.POLYGON].toLowerCase(),
  symbol: WNATIVE[ChainId.POLYGON].symbol ?? 'WETH',
}
const usdc = { address: USDC_ADDRESS[ChainId.POLYGON].toLowerCase(), symbol: 'USDC' }
const usdt = { address: USDT_ADDRESS[ChainId.POLYGON].toLowerCase(), symbol: 'USDT' }
const wbtc = { address: WBTC_ADDRESS[ChainId.POLYGON].toLowerCase(), symbol: 'WBTC' }

const NATIVE_TO_TOKENS: Trade[] = [
  {
    input: nativeToken,
    output: usdc,
    amount: '10',
  },
  {
    input: nativeToken,
    output: wbtc,
    amount: '10',
  },

  {
    input: nativeToken,
    output: usdt,
    amount: '10',
  },
]

const TOKENS_TO_NATIVE: Trade[] = [
  {
    input: usdc,
    output: nativeToken,
  },
  {
    input: wbtc,
    output: nativeToken,
  },
  {
    input: usdt,
    output: nativeToken,
  },
]
// TODO: add one test for wnative

test.beforeEach(async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL as string)
  await screenshot('start-setup', page)
  await page.locator(`[testdata-id=network-selector-button]`).click()
  await screenshot('network-selector-list', page)
  const networkList = page.locator(`[testdata-id=network-selector-list]`)
  const desiredNetwork = networkList.getByText('Polygon Mainnet')
  expect(desiredNetwork).toBeVisible()
  await desiredNetwork.click()
  await screenshot('network-selected', page)

  if (await desiredNetwork.isVisible()) {
    await page.locator(`[testdata-id=network-selector-button]`).click()
  }
})

test.describe.only('Swap natives for tokens, then back to native.', () => {
  test.slow()
  for (const trade of NATIVE_TO_TOKENS) {
    test(`Swap ${trade.input.symbol} to ${trade.output.symbol} `, async ({ page }) => {
      const logs: string[] = []
      page.on('console', (message) => {
        logs.push(message.text())
      })

      await swap(trade, page)
    })
  }

  for (const trade of TOKENS_TO_NATIVE) {
    test(`Swap ${trade.input.symbol} to ${trade.output.symbol} `, async ({ page }) => {
      const logs: string[] = []
      page.on('console', (message) => {
        logs.push(message.text())
      })

      await swap(trade, page, true)
    })
  }
})

/**
 * NOTE: this searches for the token in the list, and selects it by testdata-id. It cannot select it directly
 * because the list is long and the desired token may be further down in the list, by searching for it the result is narrowed down and the correct token should be listed.
 * @param trade
 * @param page
 */
async function swap(trade: Trade, page: Page, useMaxBalances?: boolean) {
  
  const label = `${trade.input.symbol}-to-${trade.output.symbol}`
  let swapButton = page.locator('button', { hasText: /Enter Amount/i })
  await expect(swapButton).not.toBeEnabled()

  await handleToken(trade.input, page, InputType.INPUT, trade.amount, useMaxBalances)
  await handleToken(trade.output, page, InputType.OUTPUT)

  swapButton = page.locator('button', { hasText: /Swap/i })

  await screenshot(`${label}-before-swap`, page)
  await expect(swapButton).toBeEnabled()
  await swapButton.click()

  await timeout(500) // wait for rpc calls to figure out if approvals are needed 

  await screenshot(`${label}-bento-approval`, page)
  await page
    .locator('button', { hasText: /Approve BentoBox/i })
    .click({ timeout: 500 })
    .then(() => console.log('BentoBox approved'))
    .catch(() => console.log('BentoBox already approved'))

  await page
    .locator('button', { hasText: /Approve / })
    .click({ timeout: 500 })
    .then(() => console.log(`Approved ${trade.input.symbol}`))
    .catch(() => console.log(`${trade.input.symbol} already approved or not needed`))

  await screenshot(`${label}-confirm`, page)
  const confirmSwap = page.locator('div[role="dialog"] button:has-text("Swap")')
  await expect(confirmSwap).toBeEnabled()
  await confirmSwap.click()

  await screenshot(`DEBUG-${label}`, page)
  let expectedText = 'Successfully swapped '
  await expect(page.locator('div', { hasText: expectedText }).last()).toContainText(expectedText)

  await screenshot(`${label}-success`, page)
}

async function handleToken(token: Token, page: Page, type: InputType, amount?: string, useMax?: boolean) {
  // Open token list
  const tokenOutputList = page.getByTestId(type === InputType.INPUT ? 'token-input' : 'token-output')
  expect(tokenOutputList).toBeVisible()
  await tokenOutputList.click()

  // Search token, not needed if it's the first token in the list, which is always NATIVE
  if (token.address !== AddressZero) {
    await page.fill('[placeholder="Search token by address"] >> visible=true', token.symbol)
    await timeout(1000) // TODO: wait for the list to load instead of using timeout
    await screenshot(`search-token`, page)
  }
  if (type === InputType.INPUT) {
    await page.locator(`[testdata-id=token-selector-row-${token.address}]`).first().click() // Might be able to use .scrollIntoViewIfNeeded()
  } else {
    await page.locator(`[testdata-id=token-selector-row-${token.address}]`).last().click() // Might be able to use .scrollIntoViewIfNeeded()
  }

  if (useMax && type === InputType.INPUT) {
    await timeout(500) // wait for the balance to be set before continuing
    const balanceButton = page.locator('button', { hasText: /Balance:/ }).first()
    await balanceButton.click()
  } else if (amount && type === InputType.INPUT) {
    const input0 = page.locator('#swap > div > div:nth-child(2) > div.relative.flex.items-center.gap-1 > input') // TODO: add data-testid
    await expect(input0).toBeVisible()
    await input0.fill(amount)
  }

  console.log(`Selected ${token.symbol}`)
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function screenshot(name: string, page: Page) {
  if (process.env.SCREENSHOTS_ENABLED === 'true') {
    await timeout(1000)
    const unix = new Date().getTime()
    await page.screenshot({ path: `screenshots/${unix}-${name}.png` })
  }
}


enum InputType {
  INPUT,
  OUTPUT,
}

interface Token {
  address: string
  symbol: string
}

interface Trade {
  input: Token
  output: Token
  amount?: string
}
