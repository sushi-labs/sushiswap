import { AddressZero } from '@ethersproject/constants'
import { expect, Page, test } from '@playwright/test'
import { chainName } from '@sushiswap/chain'
import { Native, SUSHI, Type, USDC } from '@sushiswap/currency'

if (!process.env.CHAIN_ID) throw new Error('CHAIN_ID env var not set')
if (!process.env.PLAYWRIGHT_URL) throw new Error('PLAYWRIGHT_URL env var not set')

const CHAIN_ID = Number(process.env.CHAIN_ID)
const PLAYWRIGHT_URL = String(process.env.PLAYWRIGHT_URL)

const native = Native.onChain(CHAIN_ID)
const wnative = native.wrapped

const usdc = USDC[CHAIN_ID as keyof typeof USDC]
const sushi = SUSHI[CHAIN_ID as keyof typeof SUSHI]

async function switchNetwork(page: Page, chainId: number) {
  await page.getByRole('button', { name: 'Ethereum' }).click()
  await page.locator(`[testdata-id=network-selector-${chainId}]`).click()
}

test.slow()

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (err) => {
    console.log(err)
  })

  await page.goto(PLAYWRIGHT_URL)
  await switchNetwork(page, CHAIN_ID)
})

test('Wrap and unwrap', async ({ page }) => {
  const wrapFromBalance = page.getByTestId('swap-from-balance-button')
  await expect(wrapFromBalance).toContainText('1000')
  await wrap(page, native, wnative, '10')
  const wrapToBalance = page.getByTestId('swap-to-balance-button')
  await expect(wrapFromBalance).toContainText('9989.98')
  await expect(wrapToBalance).toContainText('10')
  await wrap(page, wnative, native, '10')
  await expect(wrapFromBalance).toContainText('0')
  await expect(wrapToBalance).toContainText('9999.96')
})

test('Swap Native to USDC, then USDC to NATIVE', async ({ page }) => {
  await swap(page, native, usdc, '1')
  // TODO: await balance update
  await swap(page, usdc, native, '1', true)
  // TODO: await balance update
})

test('Swap Native to SUSHI, then SUSHI to NATIVE', async ({ page }) => {
  await swap(page, native, sushi, '1')
  // TODO: await balance update
  await swap(page, sushi, native, '1', true)
  // TODO: await balance update
})

async function wrap(page: Page, inputCurrency: Type, outputCurrency: Type, amount?: string, useBalance?: boolean) {
  await handleToken(page, inputCurrency, InputType.INPUT)
  await handleInput(page, amount, useBalance)
  await handleToken(page, outputCurrency, InputType.OUTPUT)

  if (!inputCurrency.isNative) {
    const approveButton = page.locator('[testdata-id=approve-erc20]', { hasText: `Approve ${inputCurrency.symbol}` })
    await expect(approveButton).toBeEnabled()

    await page
      .locator('[testdata-id=approve-erc20]', { hasText: `Approve ${inputCurrency.symbol}` })
      .click()
      .then(() => console.log(`Approved ${inputCurrency.symbol}`))
      .catch(() => console.log(`${inputCurrency.symbol} already approved or not needed`))

    const expectedApprovingText = `Approving ${inputCurrency.symbol}`
    await expect(page.getByText(expectedApprovingText)).toContainText(expectedApprovingText)

    const expectedApproveText = `Successfully approved ${inputCurrency.symbol}`
    await expect(page.getByText(expectedApproveText)).toContainText(expectedApproveText)
  }

  const unwrapButton = page.locator('[testdata-id=swap-button]')

  await expect(unwrapButton).toBeEnabled()
  await unwrapButton.click()

  const confirmUnwrap = page.locator('[testdata-id=confirm-swap-button]')
  await expect(confirmUnwrap).toBeEnabled()
  await confirmUnwrap.click()

  const expectedText = new RegExp(`(Wrap|Unwrap .* ${inputCurrency.symbol} to .* ${outputCurrency.symbol})`)
  await expect(page.locator('span', { hasText: expectedText }).last()).toContainText(expectedText)

  await page.locator('[testdata-id=make-another-swap-button]').click()
}

async function swap(page: Page, inputCurrency: Type, outputCurrency: Type, amount?: string, useBalance?: boolean) {
  // await expect(page.locator('[id=amount-checker]')).not.toBeEnabled()

  await handleToken(page, inputCurrency, InputType.INPUT)
  await handleInput(page, amount, useBalance)
  await handleToken(page, outputCurrency, InputType.OUTPUT)

  if (!inputCurrency.isNative) {
    const approveButton = page.locator('[testdata-id=approve-erc20]', { hasText: `Approve ${inputCurrency.symbol}` })
    await expect(approveButton).toBeEnabled()
    await page
      .locator('[testdata-id=approve-erc20]')
      .click()
      .then(() => console.log(`Approved ${inputCurrency.symbol}`))
      .catch(() => console.log(`${inputCurrency.symbol} already approved or not needed`))
  }

  const swapButton = page.locator('[testdata-id=swap-button]')
  await expect(swapButton).toBeEnabled()
  await swapButton.click()

  const confirmSwap = page.locator('[testdata-id=confirm-swap-button]')
  await expect(confirmSwap).toBeEnabled()
  await confirmSwap.click()
  const expectedText = new RegExp(`(Swap .* ${inputCurrency.symbol} for .* ${outputCurrency.symbol})`)
  await expect(page.locator('span', { hasText: expectedText }).last()).toContainText(expectedText)

  await page.locator('[testdata-id=make-another-swap-button]').click()
}

async function handleToken(page: Page, currency: Type, type: InputType) {
  const selectorInfix = `${type === InputType.INPUT ? 'from' : 'to'}`

  // Open token list
  const tokenSelector = page.locator(`[testdata-id=swap-${selectorInfix}-button]`)
  expect(tokenSelector).toBeVisible()
  await tokenSelector.click()

  await page.fill(`[testdata-id=swap-${selectorInfix}-token-selector-address-input]`, currency.symbol as string)
  await timeout(1000)
  await page
    .locator(
      `[testdata-id=swap-${selectorInfix}-token-selector-row-${
        currency.isNative ? AddressZero : currency.address.toLowerCase()
      }]`
    )
    .click()
}

async function handleInput(page: Page, amount?: string, useMax?: boolean) {
  if (useMax) {
    await page.getByTestId('swap-from-balance-button').click()
  } else if (amount) {
    const input0 = page.locator('[testdata-id="swap-from-input"]')
    await expect(input0).toBeVisible()
    await input0.fill(amount)
  }
}

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

enum InputType {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}
