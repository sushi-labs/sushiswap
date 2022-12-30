import { AddressZero } from '@ethersproject/constants'
import { expect, Page, test } from '@playwright/test'
import { chainName } from '@sushiswap/chain'
import { Native, SUSHI_ADDRESS, USDC_ADDRESS } from '@sushiswap/currency'

if (!process.env.CHAIN_ID) throw new Error('CHAIN_ID env var not set')
if (!process.env.PLAYWRIGHT_URL) throw new Error('PLAYWRIGHT_URL env var not set')

const CHAIN_ID = Number(process.env.CHAIN_ID)
const PLAYWRIGHT_URL = String(process.env.PLAYWRIGHT_URL)

const nativeToken = {
  address: AddressZero,
  symbol: Native.onChain(CHAIN_ID).symbol,
}
const wNativeToken = {
  address: Native.onChain(CHAIN_ID).wrapped.address.toLowerCase(),
  symbol: Native.onChain(CHAIN_ID).wrapped.symbol ?? 'WETH',
}
const usdc = {
  address: USDC_ADDRESS[CHAIN_ID as keyof typeof USDC_ADDRESS].toLowerCase(),
  symbol: 'USDC',
}
const sushi = {
  address: SUSHI_ADDRESS[CHAIN_ID as keyof typeof SUSHI_ADDRESS].toLowerCase(),
  symbol: 'SUSHI',
}

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (err) => {
    console.log(err)
  })
  await page.goto(PLAYWRIGHT_URL)
})

test('Swap Native to USDC, then USDC to NATIVE', async ({ page }) => {
  test.slow()
  const trade1: Trade = { input: nativeToken, output: usdc, amount: '10' }
  console.log('Swapping', trade1.input.symbol, 'to', trade1.output.symbol, 'on', chainName[CHAIN_ID], 'chain')
  await swap(trade1, page)
  console.log('Swapped', trade1.input.symbol, 'to', trade1.output.symbol, 'on', chainName[CHAIN_ID], 'chain')

  const trade2: Trade = { input: usdc, output: nativeToken }
  console.log('Swapping', trade2.input.symbol, 'to', trade2.output.symbol, 'on', chainName[CHAIN_ID], 'chain')
  await swap(trade2, page, true)
  console.log('Swapped', trade2.input.symbol, 'to', trade2.output.symbol, 'on', chainName[CHAIN_ID], 'chain')
})

test('Swap Native to SUSHI, then SUSHI to NATIVE', async ({ page }) => {
  test.slow()
  const trade1: Trade = { input: nativeToken, output: sushi, amount: '10' }
  await swap(trade1, page)
  const trade2: Trade = { input: sushi, output: nativeToken }
  await swap(trade2, page, true)
})

test(`Wrap and unwrap`, async ({ page }) => {
  test.slow()
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

async function wrap(trade: Trade, page: Page, useBalance?: boolean) {
  await handleToken(trade.input, page, InputType.INPUT, trade.amount, useBalance)
  await handleToken(trade.output, page, InputType.OUTPUT)

  const unwrapButton = page.locator('[testdata-id=open-wrap-review-modal-button]')
  await expect(unwrapButton).toBeEnabled()
  await unwrapButton.click()

  const confirmUnwrap = page.locator('[testdata-id=swap-wrap-review-modal-confirm-button]')
  await expect(confirmUnwrap).toBeEnabled()
  await confirmUnwrap.click()

  const expectedRegex = /Successfully wrapped|unwrapped /
  await expect(page.locator('div', { hasText: expectedRegex }).last()).toContainText(expectedRegex)
}

async function swap(trade: Trade, page: Page, useMaxBalances?: boolean) {
  await expect(page.locator('[id=amount-checker]')).not.toBeEnabled()

  await handleToken(trade.input, page, InputType.INPUT, trade.amount, useMaxBalances)
  await handleToken(trade.output, page, InputType.OUTPUT)

  const swapButton = page.locator('[testdata-id=swap-button]')
  await expect(swapButton).toBeEnabled()
  await swapButton.click({ timeout: 15000 })

  // await timeout(1500) // wait for rpc calls to figure out if approvals are needed

  await page
    .locator('[testdata-id=swap-review-approve-bentobox-button]')
    .click({ timeout: 15000 })
    .then(async () => {
      console.log(`BentoBox Approved`)
    })
    .catch(() => console.log('BentoBox already approved or not needed'))

  await page
    .locator('[testdata-id=swap-review-approve-token-button]')
    .click({ timeout: 15000 })
    .then(async () => {
      console.log(`Approved ${trade.input.symbol}`)
    })
    .catch(() => console.log(`${trade.input.symbol} already approved or not needed`))

  const confirmSwap = page.locator('[testdata-id=swap-review-confirm-button]')
  await confirmSwap.click()
  const expectedText = new RegExp(`(Successfully swapped .* ${trade.input.symbol} for .* ${trade.output.symbol})`)
  await expect(page.locator('div', { hasText: expectedText }).last()).toContainText(expectedText)
}

async function handleToken(token: Token, page: Page, type: InputType, amount?: string, useMax?: boolean) {
  const selectorInfix = `${type === InputType.INPUT ? 'input' : 'output'}-currency${
    type === InputType.INPUT ? '0' : '1'
  }`

  // Open token list
  const tokenOutputList = page.getByTestId(`swap-${selectorInfix}-button`)
  expect(tokenOutputList).toBeVisible()
  await tokenOutputList.click()

  await page.fill(`[testdata-id=swap-${selectorInfix}-token-selector-dialog-address-input]`, token.symbol)
  // TODO: for a way to "await" the discovery of the list instead of arbitrary timeout
  await timeout(1000)
  await page.locator(`[testdata-id=swap-${selectorInfix}-token-selector-dialog-row-${token.address}]`).click()

  if (useMax && type === InputType.INPUT) {
    // TODO: for a way to "await" the discovery of the balance instead of arbitrary timeout
    await timeout(3000) // wait for the balance to be set before continuing.
    await page.getByTestId('swap-input-currency0-balance-button').click()
  } else if (amount && type === InputType.INPUT) {
    const input0 = page.locator('[testdata-id="swap-input-currency0-input"]')
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
