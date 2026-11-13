import { NativeAddress } from 'src/lib/constants'
import { Amount } from 'sushi'
import { EvmChainId, EvmNative, USDC, USDT, WBTC } from 'sushi/evm'
import { chainId, nativeAmount } from '../constants'
import { expect, test } from '../fixtures'
import { SwapPage } from '../helpers/swap'

const native = EvmNative.fromChainId(chainId)
const wnative = native.wrap()
const usdc = USDC[chainId]
const usdt = USDT[chainId]
const wbtc = WBTC[chainId]

test('selecting a network and token switches swap modes on the same page', async ({
  page,
  fork,
  mocks,
}, testInfo) => {
  const swapPage = new SwapPage(page, chainId, fork, mocks)
  await swapPage.goTo(`/${chainId}/swap`)
  await expect(page.locator('#swap-to')).toBeVisible()
  const initialUrl = page.url()
  const destination = EvmChainId.BASE

  await page.locator('#swap-to').click()
  await page.getByRole('button', { name: 'More networks' }).click()
  await page.getByPlaceholder('Search network', { exact: true }).fill('Base')
  await page
    .locator(`[testdata-id=network-selector-more-${destination}]`)
    .click()
  await expect(page.getByRole('dialog')).toBeVisible()
  expect(page.url()).toBe(initialUrl)
  await page.screenshot({ path: testInfo.outputPath('network-selector.png') })
  await page
    .locator(`[testdata-id="token-selector-chip-${NativeAddress}"] button`)
    .click()
  await expect
    .poll(() => new URL(page.url()).searchParams.get('chainId1'))
    .toBe(String(destination))
  expect(new URL(page.url()).pathname).toBe(new URL(initialUrl).pathname)

  await page.reload()
  await expect(page.locator('#swap-from')).toBeVisible()
  await expect(page.locator('#swap-to')).toContainText('ETH')
  expect(new URL(page.url()).searchParams.get('chainId0')).toBe(String(chainId))
  expect(new URL(page.url()).searchParams.get('chainId1')).toBe(
    String(destination),
  )

  await page.locator('#swap-from').click()
  await page.locator(`[testdata-id=network-selector-${destination}]`).click()
  await page
    .locator(
      `[testdata-id="token-selector-chip-${USDC[destination].address.toLowerCase()}"] button`,
    )
    .click()
  await expect
    .poll(() => new URL(page.url()).searchParams.get('chainId0'))
    .toBe(String(destination))
  await expect(page.locator('#swap-from')).toContainText('USDC')
  await expect(page.locator('#swap-to')).toContainText('ETH')

  await page.reload()
  await expect(page.locator('#swap-from')).toContainText('USDC')
  await expect(page.locator('#swap-to')).toContainText('ETH')
  expect(new URL(page.url()).searchParams.get('chainId0')).toBe(
    String(destination),
  )
  expect(new URL(page.url()).searchParams.get('chainId1')).toBe(
    String(destination),
  )

  await page.goBack()
  await expect(page.locator('#swap-from')).toContainText(native.symbol)
  expect(new URL(page.url()).searchParams.get('chainId0')).toBe(String(chainId))
  expect(new URL(page.url()).searchParams.get('chainId1')).toBe(
    String(destination),
  )
})

test('Wrap and unwrap', async ({ page, fork, mocks }) => {
  // test.slow()
  const url = `/${chainId}/swap`
  const swapPage = new SwapPage(page, chainId, fork, mocks)
  await swapPage.goTo(url)
  await swapPage.connect()
  await swapPage.switchNetwork(chainId)
  await swapPage.mockSwapApi(`test/swap/mock/${chainId}-wrap.json`)
  await swapPage.wrap(native, wnative, nativeAmount)
  await swapPage.mockSwapApi(`test/swap/mock/${chainId}-unwrap.json`)
  await swapPage.wrap(wnative, native, 'max')
})

test('clearing swap input does not refresh the page', async ({
  page,
  fork,
  mocks,
}) => {
  const url = `/${chainId}/swap`
  const swapPage = new SwapPage(page, chainId, fork, mocks)
  await swapPage.goTo(url)

  const input = page.locator('[testdata-id=swap-from-input]')
  await expect(input).toBeVisible()
  await expect(input).toBeEnabled()

  await input.fill('1')
  await expect(page).toHaveURL(/[?&]swapAmount=1(?:&|$)/)

  await page.evaluate(() => {
    const pageWindow = window as Window & { __swapInputClearMarker?: string }
    pageWindow.__swapInputClearMarker = 'alive'
  })

  await input.press('Backspace')

  await expect(input).toHaveValue('')
  await expect
    .poll(() => new URL(page.url()).searchParams.has('swapAmount'))
    .toBe(false)
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as Window & { __swapInputClearMarker?: string })
            .__swapInputClearMarker,
      ),
    )
    .toBe('alive')
})

test('swap Native to USDC, then USDC to NATIVE', async ({
  page,
  fork,
  mocks,
}) => {
  const url = `/${chainId}/swap`
  const swapPage = new SwapPage(page, chainId, fork, mocks)
  await swapPage.goTo(url)
  await swapPage.connect()
  await swapPage.switchNetwork(chainId)
  await swapPage.mockSwapApi(`test/swap/mock/${chainId}-native-to-usdc.json`)
  await swapPage.swap(native, usdc, nativeAmount)

  await swapPage.mockSwapApi(`test/swap/mock/${chainId}-usdc-to-native.json`)
  await swapPage.swap(usdc, native, new Amount(usdc, 1_000_000n))
})

test('swap Native to USDT, then USDT to NATIVE', async ({
  page,
  fork,
  mocks,
}) => {
  const url = `/${chainId}/swap`
  const swapPage = new SwapPage(page, chainId, fork, mocks)
  await swapPage.goTo(url)
  await swapPage.connect()
  await swapPage.switchNetwork(chainId)
  await swapPage.mockSwapApi(`test/swap/mock/${chainId}-native-to-usdt.json`)
  await swapPage.swap(native, usdt, nativeAmount)

  await swapPage.mockSwapApi(`test/swap/mock/${chainId}-usdt-to-native.json`)
  await swapPage.swap(usdt, native, new Amount(usdt, 1_000_000n))
})

test('Swap Native to WBTC', async ({ page, fork, mocks }) => {
  // test.slow()
  const url = `/${chainId}/swap`
  const swapPage = new SwapPage(page, chainId, fork, mocks)
  await swapPage.goTo(url)
  await swapPage.connect()
  await swapPage.switchNetwork(chainId)

  await swapPage.mockSwapApi(`test/swap/mock/${chainId}-native-to-wbtc.json`)
  await swapPage.swap(native, wbtc, nativeAmount)
})
