import { type Page, expect, test } from '@playwright/test'
import {
  type EvmChainId,
  type EvmCurrency,
  EvmNative,
  getEvmChainById,
} from 'sushi/evm'
import { zeroAddress } from 'viem'

import type { SupportedChainId, XSwapSupportedChainId } from '../../src/config'

type InputType = 'INPUT' | 'OUTPUT'

if (typeof process.env.NEXT_PUBLIC_CHAIN_ID !== 'string') {
  throw new Error('NEXT_PUBLIC_CHAIN_ID not set')
}

if (typeof process.env.NEXT_PUBLIC_DST_CHAIN_ID !== 'string') {
  throw new Error('NEXT_PUBLIC_DST_CHAIN_ID not set')
}

const srcChainId = Number.parseInt(
  process.env.NEXT_PUBLIC_CHAIN_ID,
) as XSwapSupportedChainId & EvmChainId

// TODO: Change to dstChainIds based on paths
const dstChainId = Number.parseInt(
  process.env.NEXT_PUBLIC_DST_CHAIN_ID,
) as XSwapSupportedChainId & EvmChainId

const url = 'http://localhost:3000/cross-chain-swap'

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (error) => {
    console.error(error)
  })

  await page.goto(url)
  await switchNetwork(page, srcChainId)
})

// test.afterEach(async ({ page }) => {
//   await page.unrouteAll({ behavior: 'ignoreErrors' })
// })

test('Bridge Native to Native', async ({ page }) => {
  test.slow()
  await xswap(
    page,
    EvmNative.fromChainId(srcChainId),
    EvmNative.fromChainId(dstChainId),
    '100',
  )
})

test('Bridge Native to USDC', async ({ page }) => {
  test.slow()
  await xswap(
    page,
    EvmNative.fromChainId(srcChainId),
    EvmNative.fromChainId(dstChainId),
    '100',
  )
})

async function xswap(
  page: Page,
  inputCurrency: EvmCurrency,
  outputCurrency: EvmCurrency,
  amount: string,
) {
  await handleToken(page, inputCurrency, 'INPUT')
  await handleToken(page, outputCurrency, 'OUTPUT')
  await inputAmount(page, amount)

  const swapFromBalance = page.locator('[testdata-id=swap-from-balance-button]')
  await expect(swapFromBalance).toBeVisible()
  await expect(swapFromBalance).toBeEnabled()
  const swapFromBalanceBefore = await swapFromBalance.textContent()

  const swapToBalance = page.locator('[testdata-id=swap-to-balance-button]')
  await expect(swapToBalance).toBeVisible()

  await approve(page, inputCurrency)

  const swapButton = page.locator('[testdata-id=swap-button]')
  await expect(swapButton).toBeVisible()

  const priceImpactCheckbox = page.locator(
    '[testdata-id=price-impact-checkbox]',
  )
  while (!(await swapButton.isEnabled())) {
    if (
      (await priceImpactCheckbox.isVisible()) &&
      !(await priceImpactCheckbox.isChecked())
    ) {
      await priceImpactCheckbox.check()
    }
  }

  await swapButton.click()

  const confirmSwap = page.locator('[testdata-id=confirm-swap-button]')
  await expect(confirmSwap).toBeVisible()
  await expect(confirmSwap).toBeEnabled()
  await confirmSwap.click()

  // If this text is duplicated elsewhere it could false positive
  const expectedSwappingText = new RegExp(
    `(Swapping .* ${inputCurrency.symbol}.* to bridge token .* ${outputCurrency.symbol}.*.)`,
  )
  expect(page.getByText(expectedSwappingText)).toBeVisible()

  // If this text is duplicated elsewhere it could false positive
  const expectedSwapText = new RegExp(
    `(Swap .* ${inputCurrency.symbol}.* to bridge token .* ${outputCurrency.symbol}.*.)`,
  )
  expect(page.getByText(expectedSwapText)).toBeVisible()

  // Bridge pending
  await expect(page.getByText('Bridging to destination chain')).toBeVisible()

  await mockLayerZeroApi(page)

  const expectedSwapSuccessText = new RegExp(
    `(You sold .* ${inputCurrency.symbol}.* for .* ${outputCurrency.symbol}.*.)|(Sent .* ${outputCurrency.symbol}.* to .*.)`,
  )
  await expect(page.getByText(expectedSwapSuccessText)).toBeVisible()

  const close = page.locator('[testdata-id=swap-dialog-close-button]', {
    hasText: 'Make another swap',
  })
  await expect(close).toBeVisible()
  await expect(close).toBeEnabled()
  await close.click()

  // Compare against cached balances to ensure there is at least a change...
  await expect(swapFromBalance).not.toHaveText(swapFromBalanceBefore as string)
}

async function approve(page: Page, currency: EvmCurrency) {
  if (currency.type === 'token') {
    const approveButton = page.locator('[testdata-id=approve-erc20-button]', {
      hasText: `Approve ${currency.symbol}`,
    })
    await expect(approveButton).toBeVisible()
    await expect(approveButton).toBeEnabled()
    await approveButton.click()

    const expectedApprovingText = `Approving ${currency.symbol}`
    expect(page.getByText(expectedApprovingText)).toBeVisible()

    const expectedApproveText = `Successfully approved ${currency.symbol}`
    expect(page.getByText(expectedApproveText)).toBeVisible()
  }
}

async function handleNetwork(page: Page, chainId: EvmChainId, type: InputType) {
  const selectorInfix = `${type === 'INPUT' ? 'from' : 'to'}`

  // Open network list
  const networkSelector = page.locator(
    `[testdata-id=network-selector-${selectorInfix}-button]`,
  )
  await expect(networkSelector).toBeVisible()
  await expect(networkSelector).toBeEnabled()
  await networkSelector.click()

  const networkSearch = page.locator('[testdata-id=network-selector-input]')
  await expect(networkSearch).toBeVisible()
  await expect(networkSearch).toBeEnabled()
  await networkSearch.fill(getEvmChainById(chainId).name)

  const networkToSelect = page.locator(
    `[testdata-id=network-selector-${chainId}]`,
  )
  await expect(networkToSelect).toBeVisible()

  await networkToSelect.click()
  await expect(networkSelector).toContainText(getEvmChainById(chainId).name)
}

async function handleToken(page: Page, currency: EvmCurrency, type: InputType) {
  await handleNetwork(page, currency.chainId, type)

  const selectorInfix = `${type === 'INPUT' ? 'from' : 'to'}`

  // Open token list
  const tokenSelector = page.locator(
    `[testdata-id=swap-${selectorInfix}-button]`,
  )
  await expect(tokenSelector).toBeVisible()
  await expect(tokenSelector).toBeEnabled()
  await tokenSelector.click()

  const tokenSearch = page.locator(
    `[testdata-id=swap-${selectorInfix}-token-selector-address-input]`,
  )
  await expect(tokenSearch).toBeVisible()
  await expect(tokenSearch).toBeEnabled()
  await tokenSearch.fill(currency.symbol as string)

  const tokenToSelect = page.locator(
    `[testdata-id=swap-${selectorInfix}-token-selector-row-${
      currency.type === 'native' ? zeroAddress : currency.address.toLowerCase()
    }]`,
  )
  await expect(tokenToSelect).toBeVisible()

  await tokenToSelect.click()
  await expect(tokenSelector).toContainText(currency.symbol as string)
}

async function inputAmount(page: Page, amount: string) {
  const input0 = page.locator('[testdata-id=swap-from-input]')
  // Inputs are not rendered until the trade is found
  await expect(input0).toBeVisible()
  await expect(input0).toBeEnabled()
  await input0.fill(amount)
}

async function switchNetwork(page: Page, chainId: EvmChainId) {
  const networkSelector = page.locator('[testdata-id=network-selector-button]')
  await expect(networkSelector).toBeVisible()
  await expect(networkSelector).toBeEnabled()
  await networkSelector.click()

  const networkToSelect = page.locator(
    `[testdata-id=network-selector-${chainId}]`,
  )
  await expect(networkToSelect).toBeVisible()
  await expect(networkToSelect).toBeEnabled()
  await networkToSelect.click()

  const fromToken = page.locator('[testdata-id=swap-from-button]')
  await expect(fromToken).toHaveText(EvmNative.fromChainId(chainId).symbol)
}

async function mockLayerZeroApi(page: Page) {
  const mockLayerZeroResp = {
    messages: [
      {
        srcUaAddress: zeroAddress,
        dstUaAddress: zeroAddress,
        srcChainId: 1,
        dstChainId: 1,
        srcUaNonce: 0,
        status: 'DELIVERED',
      },
    ],
  }

  await page.route(
    'https://api-mainnet.layerzero-scan.com/tx/*',
    async (route) => {
      await route.fulfill({
        json: mockLayerZeroResp,
      })
    },
  )
}
