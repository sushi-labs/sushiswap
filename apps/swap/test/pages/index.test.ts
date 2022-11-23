import { AddressZero } from '@ethersproject/constants'
import { expect, Page, test } from '@playwright/test'
import { chainName } from '@sushiswap/chain'
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

test.beforeEach(async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL as string)
  await page.locator(`[testdata-id=network-selector-button]`).click()
  const networkList = page.locator(`[testdata-id=network-selector-list]`)
  const desiredNetwork = networkList.getByText(chainName[CHAIN_ID])
  expect(desiredNetwork).toBeVisible()
  await desiredNetwork.click()

  if (await desiredNetwork.isVisible()) {
    await page.locator(`[testdata-id=network-selector-button]`).click()
  }
})

test.describe('Swap Native to USDC, then USDC to NATIVE', () => {
  test.slow()
  test(`Swap Native to USDC`, async ({ page }) => {
    const logs: string[] = []
    page.on('console', (message) => {
      logs.push(message.text())
    })
    const trade: Trade = { input: nativeToken, output: usdc, amount: '10' }
    await swap(trade, page)
  })
  test(`Swap USDC to NATIVE`, async ({ page }) => {
    const logs: string[] = []
    page.on('console', (message) => {
      logs.push(message.text())
    })
    const trade: Trade = { input: usdc, output: nativeToken }
    await swap(trade, page, true)
  })
})

test.describe('Swap Native to USDT, then USDT to NATIVE', () => {
  test.slow()
  test(`Swap Native to USDT`, async ({ page }) => {
    const logs: string[] = []
    page.on('console', (message) => {
      logs.push(message.text())
    })
    const trade: Trade = { input: nativeToken, output: usdt, amount: '10' }
    await swap(trade, page)
  })
  test(`Swap USDT to NATIVE`, async ({ page }) => {
    const logs: string[] = []
    page.on('console', (message) => {
      logs.push(message.text())
    })
    const trade: Trade = { input: usdt, output: nativeToken }
    await swap(trade, page, true)
  })
})

test.describe('Swap Native to WBTC, then WBTC to NATIVE', () => {
  test.slow()
  test(`Swap Native to WBTC`, async ({ page }) => {
    const logs: string[] = []
    page.on('console', (message) => {
      logs.push(message.text())
    })
    const trade: Trade = { input: nativeToken, output: wbtc, amount: '10' }
    await swap(trade, page)
  })
  test(`Swap WBTC to NATIVE`, async ({ page }) => {
    const logs: string[] = []
    page.on('console', (message) => {
      logs.push(message.text())
    })
    const trade: Trade = { input: wbtc, output: nativeToken }
    await swap(trade, page, true)
  })
})

test(`Wrap and unwrap`, async ({ page }) => {
  test.slow()
  const logs: string[] = []
  page.on('console', (message) => {
    logs.push(message.text())
  })
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
  await handleToken(trade.input, page, InputType.INPUT, trade.amount, useMaxBalances)
  await handleToken(trade.output, page, InputType.OUTPUT)

  let unwrapButton = page.locator('button', { hasText: /(Wrap|Unwrap)/i })

  await expect(unwrapButton).toBeEnabled()
  await unwrapButton.click()

  await timeout(500) // wait for rpc calls to figure out if approvals are needed

  await page
    .locator('button', { hasText: /Approve BentoBox/i })
    .click({ timeout: 500 })
    .then(async () => {
      await timeout(1500) // wait for rpc calls to update approval status
      console.log(`BentoBox Approved`)
    })
    .catch(() => console.log('BentoBox already approved'))

  await timeout(500) // wait for rpc calls to update approval status

  const confirmUnwrap = page.locator('div[role="dialog"] button', { hasText: /Wrap|Unwrap/i })
  await expect(confirmUnwrap).toBeEnabled()
  await confirmUnwrap.click()

  let expectedRegex = /Successfully wrapped|unwrapped /
  await expect(page.locator('div', { hasText: expectedRegex }).last()).toContainText(expectedRegex)
}

async function swap(trade: Trade, page: Page, useMaxBalances?: boolean) {
  let swapButton = page.locator('button', { hasText: /Enter Amount/i })
  await expect(swapButton).not.toBeEnabled()

  await handleToken(trade.input, page, InputType.INPUT, trade.amount, useMaxBalances)
  await handleToken(trade.output, page, InputType.OUTPUT)

  swapButton = page.locator('button', { hasText: /Swap/i })

  await expect(swapButton).toBeEnabled()
  await swapButton.click()

  await timeout(500) // wait for rpc calls to figure out if approvals are needed

  await page
    .locator('button', { hasText: /Approve BentoBox/i })
    .click({ timeout: 1000 })
    .then(async () => {
      await timeout(1500) // wait for rpc calls to update approval status
      console.log(`BentoBox Approved`)
    })
    .catch(() => console.log('BentoBox already approved'))

  await page
    .locator('button', { hasText: /Approve / })
    .click({ timeout: 1000 })
    .then(async () => {
      await timeout(1500) // wait for rpc calls to update approval status
      console.log(`Approved ${trade.input.symbol}`)
    })
    .catch(() => console.log(`${trade.input.symbol} already approved or not needed`))

  await timeout(2000) // wait for rpc calls to update approval status
  const confirmSwap = page.locator('div[role="dialog"] button', { hasText: /Swap/i })
  await confirmSwap.click()

  let expectedText = 'Successfully swapped '
  await expect(page.locator('div', { hasText: expectedText }).last()).toContainText(expectedText)
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
  }
  if (type === InputType.INPUT) {
    await page.locator(`[testdata-id=token-selector-row-${token.address}]`).first().click() // Might be able to use .scrollIntoViewIfNeeded()
  } else {
    await page.locator(`[testdata-id=token-selector-row-${token.address}]`).last().click() // Might be able to use .scrollIntoViewIfNeeded()
  }

  if (useMax && type === InputType.INPUT) {
    // await timeout(2000) // wait for the balance to be set before continuing
    // const balanceButton = page.locator('button', { hasText: /Balance:/ }).first()
    // await balanceButton.click()
    // TODO: refactor this later, cannot use max balance until we have separate accounts for each worker. for now, divide the balance by 2 to make sure we have enough
    await timeout(3000) // wait for the balance to be set before continuing.
    const amount = (
      await page
        .locator('button', { hasText: /Balance:/ })
        .first()
        .innerText()
    ).split('Balance: ')[1]
    const formattedAmount = String((parseFloat(amount) / 2).toFixed(8))
    if (formattedAmount === '0.00000000') {
      throw new Error(`Balance is 0 for ${token.symbol}, cannot proceed.`)
    }
    const input0 = page.locator('#swap > div > div:nth-child(2) > div.relative.flex.items-center.gap-1 > input') // TODO: add data-testid
    await input0.fill(formattedAmount)
  } else if (amount && type === InputType.INPUT) {
    const input0 = page.locator('#swap > div > div:nth-child(2) > div.relative.flex.items-center.gap-1 > input') // TODO: add data-testid
    await expect(input0).toBeVisible()
    await input0.fill(amount)
  }
}

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
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
