import { AddressZero } from '@ethersproject/constants'
import { expect, Page, test } from '@playwright/test'
import { ChainId, chainIds, chainName } from '@sushiswap/chain'
import { USDC_ADDRESS, USDT_ADDRESS, WBTC_ADDRESS, WNATIVE, WNATIVE_ADDRESS } from '@sushiswap/currency'


if (!process.env.CHAIN_ID) {
  throw new Error('CHAIN_ID env var not set')
}

const CHAIN_ID = parseInt(process.env.CHAIN_ID)

const nativeToken = {
  address: AddressZero,
  symbol: 'NATIVE', // not being used except for test description
}
const wNativeToken = {
  address: WNATIVE_ADDRESS[CHAIN_ID].toLowerCase(),
  symbol: WNATIVE[CHAIN_ID].symbol ?? 'WETH',
}
const usdc = { address: USDC_ADDRESS[CHAIN_ID].toLowerCase(), symbol: 'USDC' }
const usdt = { address: USDT_ADDRESS[CHAIN_ID].toLowerCase(), symbol: 'USDT' }
const wbtc = { address: WBTC_ADDRESS[CHAIN_ID].toLowerCase(), symbol: 'WBTC' }

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

test.beforeEach(async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL as string)
  await screenshot('start-setup', page)
  await page.locator(`[testdata-id=network-selector-button]`).click()
  await screenshot('network-selector-list', page)
  const networkList = page.locator(`[testdata-id=network-selector-list]`)
  const desiredNetwork = networkList.getByText(chainName[CHAIN_ID])
  expect(desiredNetwork).toBeVisible()
  await desiredNetwork.click()
  await screenshot('network-selected', page)

  if (await desiredNetwork.isVisible()) {
    await page.locator(`[testdata-id=network-selector-button]`).click()
  }
})

test.describe('Swap natives for tokens, then back to native.', () => {
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

test(`Wrap and unwrap`, async ({ page }) => {
  const nativeToWrapped = {
    input: nativeToken,
    output: wNativeToken,
    amount: '10',
  }
  const wrappedToNative = {
    input: wNativeToken,
    output: nativeToken,
    amount: '10',
  }
  await wrap(nativeToWrapped, page)
  await wrap(wrappedToNative, page)
})

async function wrap(trade: Trade, page: Page, useMaxBalances?: boolean) {
  const label = `${trade.input.symbol}-to-${trade.output.symbol}`
  console.log(`wrap: ${label}`)

  await handleToken(trade.input, page, InputType.INPUT, trade.amount, useMaxBalances)
  await handleToken(trade.output, page, InputType.OUTPUT)

  let unwrapButton = page.locator('button', { hasText: /(Wrap|Unwrap)/i })

  await screenshot(`${label}-before-wra`, page)
  await expect(unwrapButton).toBeEnabled()
  await unwrapButton.click()

  await timeout(500) // wait for rpc calls to figure out if approvals are needed

  await screenshot(`${label}-bento-approval`, page)
  await page
    .locator('button', { hasText: /Approve BentoBox/i })
    .click({ timeout: 500 })
    .then(() => console.log('BentoBox approved'))
    .catch(() => console.log('BentoBox already approved'))

  await screenshot(`${label}-confirm`, page)
  const confirmSwap = page.locator('div[role="dialog"] button', { hasText: /Wrap|Unwrap/i })
  await expect(confirmSwap).toBeEnabled()
  await confirmSwap.click()

  await screenshot(`DEBUG-${label}`, page)
  let expectedRegex = /Successfully wrapped|unwrapped /
  await expect(page.locator('div', { hasText: expectedRegex }).last()).toContainText(expectedRegex)

  await screenshot(`${label}-success`, page)
}

async function swap(trade: Trade, page: Page, useMaxBalances?: boolean) {
  const label = `${trade.input.symbol}-to-${trade.output.symbol}`
  console.log(`Swap: ${label}`)
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
  const confirmSwap = page.locator('div[role="dialog"] button', { hasText: /Swap/i })
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
