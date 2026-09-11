import { Amount } from 'sushi'
import { EvmNative, USDC, USDT, WBTC } from 'sushi/evm'
import { chainId, nativeAmount } from '../constants'
import { expect, test } from '../fixtures'
import { SwapPage } from '../helpers/swap'

const native = EvmNative.fromChainId(chainId)
const wnative = native.wrap()
const usdc = USDC[chainId]
const usdt = USDT[chainId]
const wbtc = WBTC[chainId]

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
