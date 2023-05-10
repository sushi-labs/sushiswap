import { AddressZero } from '@ethersproject/constants'
import { expect, Page, test } from '@playwright/test'
import { chainName } from '@sushiswap/chain'
import { Native, SUSHI, Type, USDC } from '@sushiswap/currency'
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

// import { z } from 'zod'
// let envSchema = z.object({
//   CHAIN_ID: z.string(),
//   PLAYWRIGHT_URL: z.string(),
// });
// const env = envSchema.parse(process.env);

if (!process.env.CHAIN_ID) throw new Error('CHAIN_ID env var not set')
if (!process.env.PLAYWRIGHT_URL) throw new Error('PLAYWRIGHT_URL env var not set')
// if (!process.env.ANVIL_FORK_BLOCK) throw new Error('ANVIL_FORK_BLOCK env var not set')

const CHAIN_ID = Number(process.env.CHAIN_ID)
const PLAYWRIGHT_URL = String(process.env.PLAYWRIGHT_URL)
// const ANVIL_FORK_BLOCK = Number(process.env.ANVIL_FORK_BLOCK)

const native = Native.onChain(CHAIN_ID)
const wnative = native.wrapped

const usdc = USDC[CHAIN_ID as keyof typeof USDC]
const sushi = SUSHI[CHAIN_ID as keyof typeof SUSHI]

test.slow()

const client = createTestClient({ mode: 'anvil', chain: foundry, transport: http() })

test.beforeAll(async () => {
  //
})

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (err) => {
    console.log(err)
  })

  // @ts-ignore
  // await client.reset({ blockNumber: 42259027n })

  await page.goto(PLAYWRIGHT_URL)
  await switchNetwork(page, CHAIN_ID)

  // const fromBalance = page.getByTestId('swap-from-balance-button')
  // await expect(fromBalance).toContainText('1000')
  // const toBalance = page.getByTestId('swap-from-balance-button')
  // await expect(toBalance).toContainText('0')
})

test.afterAll(async () => {
  //
})

test.afterEach(async ({ page }) => {
  // TODO: Not implemented by viem yet
  // await client.request({ method: 'anvil_reset', params: [] })
})

test('Wrap and unwrap', async ({ page }) => {
  const wrapFromBalance = page.getByTestId('swap-from-balance-button')
  await expect(wrapFromBalance).toContainText('1000')
  await wrap({
    page,
    inputCurrency: native,
    outputCurrency: wnative,
    amount: '10',
  })
  const wrapToBalance = page.getByTestId('swap-to-balance-button')
  await expect(wrapFromBalance).toContainText('9989.98')
  await expect(wrapToBalance).toContainText('10')
  await wrap({
    page,
    inputCurrency: wnative,
    outputCurrency: native,
    amount: '10',
  })
  await expect(wrapFromBalance).toContainText('0')
  await expect(wrapToBalance).toContainText('9999.96')
})

test('Swap Native to USDC, then USDC to NATIVE', async ({ page }) => {
  const swapFromBalance = page.getByTestId('swap-from-balance-button')
  // await expect(swapFromBalance).toContainText('1000')
  const swapFromBalanceBefore = await swapFromBalance.textContent()

  const swapToBalance = page.getByTestId('swap-to-balance-button')
  // await expect(swapFromBalance).toContainText('0')
  const swapToBalanceBefore = await swapToBalance.textContent()

  await swap({
    page,
    inputCurrency: native,
    outputCurrency: usdc,
    amount: '1',
  })

  // Ensure balances at least change...
  const swapFromBalanceAfterFirst = await swapFromBalance.textContent()
  expect(swapFromBalanceBefore).not.toEqual(swapFromBalanceAfterFirst)
  const swapToBalanceAfterFirst = await swapToBalance.textContent()
  await expect(swapToBalanceBefore).not.toEqual(swapToBalanceAfterFirst)

  await swap({
    page,
    inputCurrency: usdc,
    outputCurrency: native,
    useBalance: true,
  })

  // Ensure balances at least change...
  const swapFromBalanceAfterSecond = await swapFromBalance.textContent()
  expect(swapFromBalanceAfterFirst).not.toEqual(swapFromBalanceAfterSecond)
  const swapToBalanceAfterSecond = await swapToBalance.textContent()
  await expect(swapToBalanceAfterFirst).not.toEqual(swapToBalanceAfterSecond)
})

test('Swap Native to SUSHI, then SUSHI to NATIVE', async ({ page }) => {
  const swapFromBalance = page.getByTestId('swap-from-balance-button')
  // await expect(swapFromBalance).toContainText('1000')
  const swapFromBalanceBefore = await swapFromBalance.textContent()

  const swapToBalance = page.getByTestId('swap-to-balance-button')
  // await expect(swapFromBalance).toContainText('0')
  const swapToBalanceBefore = await swapToBalance.textContent()

  await swap({
    page,
    inputCurrency: native,
    outputCurrency: sushi,
    amount: '1',
  })

  // Ensure balances at least change...
  const swapFromBalanceAfterFirst = await swapFromBalance.textContent()
  expect(swapFromBalanceBefore).not.toEqual(swapFromBalanceAfterFirst)
  const swapToBalanceAfterFirst = await swapToBalance.textContent()
  await expect(swapToBalanceBefore).not.toEqual(swapToBalanceAfterFirst)

  await swap({
    page,
    inputCurrency: sushi,
    outputCurrency: native,
    useBalance: true,
  })

  // Ensure balances at least change...
  const swapFromBalanceAfterSecond = await swapFromBalance.textContent()
  expect(swapFromBalanceAfterFirst).not.toEqual(swapFromBalanceAfterSecond)
  const swapToBalanceAfterSecond = await swapToBalance.textContent()
  await expect(swapToBalanceAfterFirst).not.toEqual(swapToBalanceAfterSecond)
})

async function wrap({
  page,
  inputCurrency,
  outputCurrency,
  amount,
  useBalance,
}:
  | { page: Page; inputCurrency: Type; outputCurrency: Type; amount?: never; useBalance: true }
  | { page: Page; inputCurrency: Type; outputCurrency: Type; amount: string; useBalance?: never }) {
  await handleToken(page, inputCurrency, 'INPUT')
  await inputAmount(page, amount, useBalance)
  await handleToken(page, outputCurrency, 'OUTPUT')

  if (!inputCurrency.isNative) {
    const approveButton = page.locator('[testdata-id=approve-erc20]', { hasText: `Approve ${inputCurrency.symbol}` })
    await expect(approveButton).toBeVisible()
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
  // const unwrapButton = page.getByRole('button', { name: 'Wrap' })
  await expect(unwrapButton).toBeVisible()
  await expect(unwrapButton).toBeEnabled()
  await unwrapButton.click()

  const confirmUnwrap = page.locator('[testdata-id=confirm-swap-button]')
  await expect(confirmUnwrap).toBeVisible()
  await expect(confirmUnwrap).toBeEnabled()
  await confirmUnwrap.click()

  const expectedText = new RegExp(`(Wrap|Unwrap .* ${inputCurrency.symbol} to .* ${outputCurrency.symbol})`)
  await expect(page.locator('span', { hasText: expectedText }).last()).toContainText(expectedText)

  const makeAnotherSwap = page.locator('[testdata-id=make-another-swap-button]')
  await expect(makeAnotherSwap).toBeVisible()
  await expect(makeAnotherSwap).toBeEnabled()
  await makeAnotherSwap.click()
}

async function swap({
  page,
  inputCurrency,
  outputCurrency,
  amount,
  useBalance,
}:
  | { page: Page; inputCurrency: Type; outputCurrency: Type; amount?: never; useBalance: true }
  | { page: Page; inputCurrency: Type; outputCurrency: Type; amount: string; useBalance?: false }) {
  // await expect(page.locator('[id=amount-checker]')).not.toBeEnabled()

  await handleToken(page, inputCurrency, 'INPUT')
  await inputAmount(page, amount, useBalance)
  await handleToken(page, outputCurrency, 'OUTPUT')

  if (!inputCurrency.isNative) {
    const approveButton = page.locator('[testdata-id=approve-erc20]', { hasText: `Approve ${inputCurrency.symbol}` })
    await expect(approveButton).toBeVisible()
    await expect(approveButton).toBeEnabled()
    await approveButton
      .click()
      .then(() => console.log(`Approved ${inputCurrency.symbol}`))
      .catch(() => console.log(`${inputCurrency.symbol} already approved or not needed`))

    const expectedApprovingText = `Approving ${inputCurrency.symbol}`
    await expect(page.getByText(expectedApprovingText)).toContainText(expectedApprovingText)

    const expectedApproveText = `Successfully approved ${inputCurrency.symbol}`
    await expect(page.getByText(expectedApproveText)).toContainText(expectedApproveText)
  }

  const swapButton = page.locator('[testdata-id=swap-button]')
  await expect(swapButton).toBeVisible()
  await expect(swapButton).toBeEnabled()
  await swapButton.click()

  const confirmSwap = page.locator('[testdata-id=confirm-swap-button]')
  // const confirmSwap = page.getByRole('button', { name: `Swap ${inputCurrency.symbol} for ${outputCurrency.symbol}` })
  await expect(confirmSwap).toBeVisible()
  await expect(confirmSwap).toBeEnabled()
  await confirmSwap.click()

  // const expectedModalText = page.locator('h1', {
  //   hasText: new RegExp(`(You sold .* ${inputCurrency.symbol} for .* ${outputCurrency.symbol}.)`),
  // })
  // await expect(expectedModalText).toBeVisible()

  // This one kinda did notifications I think?
  const expectedText = new RegExp(`(Swap .* ${inputCurrency.symbol} for .* ${outputCurrency.symbol})`)
  await expect(page.locator('span', { hasText: expectedText }).last()).toContainText(expectedText)

  const makeAnotherSwap = page.locator('[testdata-id=make-another-swap-button]')
  await expect(makeAnotherSwap).toBeVisible()
  await expect(makeAnotherSwap).toBeEnabled()
  await makeAnotherSwap.click()
}

async function handleToken(page: Page, currency: Type, type: InputType) {
  const selectorInfix = `${type === 'INPUT' ? 'from' : 'to'}`

  // Open token list
  const tokenSelector = page.locator(`[testdata-id=swap-${selectorInfix}-button]`)
  await expect(tokenSelector).toBeVisible()
  await expect(tokenSelector).toBeEnabled()
  await tokenSelector.click()

  await page.fill(`[testdata-id=swap-${selectorInfix}-token-selector-address-input]`, currency.symbol as string)
  await page
    .locator(
      `[testdata-id=swap-${selectorInfix}-token-selector-row-${
        currency.isNative ? AddressZero : currency.address.toLowerCase()
      }]`
    )
    .click()
}

async function maxInput(page: Page) {
  const maxButton = page.getByTestId('swap-from-balance-button')
  await expect(maxButton).toBeVisible()
  await expect(maxButton).toBeEnabled()
  await maxButton.click()
}

async function inputAmount(page: Page, amount?: string, useMax?: boolean) {
  if (useMax) {
    await maxInput(page)
  } else if (amount) {
    const input0 = page.locator('[testdata-id="swap-from-input"]')
    await expect(input0).toBeVisible()
    await expect(input0).toBeEnabled()
    await input0.fill(amount)
  }
}

async function switchNetwork(page: Page, chainId: number) {
  const networkSelector = page.getByRole('button', { name: 'Ethereum' })
  await expect(networkSelector).toBeVisible()
  await expect(networkSelector).toBeEnabled()
  await networkSelector.click()

  const networkToSelect = page.locator(`[testdata-id=network-selector-${chainId}]`)
  await expect(networkToSelect).toBeVisible()
  await expect(networkToSelect).toBeEnabled()
  await networkToSelect.click()
}

type InputType = 'INPUT' | 'OUTPUT'
