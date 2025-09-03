import { test } from 'next/experimental/testmode/playwright.js'
import { getChainById } from 'sushi'
import { EvmNative, USDC, USDT, WBTC } from 'sushi/evm'
import { chainId, nativeAmount } from 'test/constants'
import { AdvancedSwapPage } from 'test/helpers/advanced-swap'
import { interceptAnvil } from 'test/intercept-anvil'

const BASE_URL = 'http://localhost:3000'

const native = EvmNative.fromChainId(chainId)
const wnative = native.wrap()

const usdc = USDC[chainId]
const usdt = USDT[chainId]
const wbtc = WBTC[chainId]

test.beforeEach(async ({ page, next }) => {
  page.on('pageerror', (error) => {
    console.error(error)
  })

  try {
    await page.route(`**/price/v1/${chainId}`, async (route) => {
      await route.fulfill({
        json: {},
      })
    })
  } catch (error) {
    console.error('error mocking token api', error)
  }

  await page.route('http://localhost:3000/api/swap', async (route) => {
    await route.fulfill({ json: { maintenance: false } })
  })

  try {
    await interceptAnvil(page, next)
  } catch (_e) {
    throw new Error('error intercepting anvil')
  }

  next.onFetch(() => {
    return 'continue'
  })
})

// test.afterEach(async ({ page }) => {
// 	await page?.unrouteAll({ behavior: "ignoreErrors" });
// });

test('Wrap and unwrap on advanced swap page', async ({ page }) => {
  const url = `${BASE_URL}/${getChainById(chainId).key}/swap/advanced`
  const swapPage = new AdvancedSwapPage(page, chainId)
  await swapPage.goTo(url)
  await swapPage.connect()
  await swapPage.switchNetwork(chainId)
  await swapPage.mockSwapApi(`test/swap/mock/${chainId}-wrap.json`)
  await swapPage.wrap(native, wnative, nativeAmount)
  await swapPage.mockSwapApi(`test/swap/mock/${chainId}-unwrap.json`)
  await swapPage.wrap(wnative, native, 'max')
})

test('swap Native to USDC, then USDC to NATIVE on advanced swap page', async ({
  page,
}) => {
  const url = BASE_URL.concat(`/${getChainById(chainId).key}/swap/advanced`)
  const swapPage = new AdvancedSwapPage(page, chainId)
  await swapPage.goTo(url)
  await swapPage.connect()
  await swapPage.switchNetwork(chainId)
  await swapPage.mockSwapApi(`test/swap/mock/${chainId}-native-to-usdc.json`)
  await swapPage.swap({
    inputCurrency: native,
    outputCurrency: usdc,
    amount: nativeAmount,
  })

  await swapPage.mockSwapApi(`test/swap/mock/${chainId}-usdc-to-native.json`)
  await swapPage.swap({
    inputCurrency: usdc,
    outputCurrency: native,
    amount: 'max',
  })
})

test('Swap Native to USDC using Quick Select on advanced swap page', async ({
  page,
}) => {
  // test.slow();
  const url = BASE_URL.concat(`/${getChainById(chainId).key}/swap/advanced`)
  const swapPage = new AdvancedSwapPage(page, chainId)
  await swapPage.goTo(url)
  await swapPage.connect()
  await swapPage.switchNetwork(chainId)
  await swapPage.mockSwapApi(`test/swap/mock/${chainId}-native-to-usdc.json`)
  await swapPage.swap({
    inputCurrency: native,
    outputCurrency: usdc,
    amount: nativeAmount,
    shouldUseQuickSelect: true,
  })
})

test('Swap Native to USDT using Quick Select on advanced swap page', async ({
  page,
}) => {
  // test.slow();
  const url = BASE_URL.concat(`/${getChainById(chainId).key}/swap/advanced`)
  const swapPage = new AdvancedSwapPage(page, chainId)
  await swapPage.goTo(url)
  await swapPage.connect()
  await swapPage.switchNetwork(chainId)
  await swapPage.mockSwapApi(`test/swap/mock/${chainId}-native-to-usdt.json`)
  await swapPage.swap({
    inputCurrency: native,
    outputCurrency: usdt,
    amount: nativeAmount,
    shouldUseQuickSelect: true,
  })
})

test('swap Native to USDT, then USDT to NATIVE on advanced swap page', async ({
  page,
}) => {
  const url = BASE_URL.concat(`/${getChainById(chainId).key}/swap/advanced`)
  const swapPage = new AdvancedSwapPage(page, chainId)
  await swapPage.goTo(url)
  await swapPage.connect()
  await swapPage.switchNetwork(chainId)
  await swapPage.mockSwapApi(`test/swap/mock/${chainId}-native-to-usdt.json`)
  await swapPage.swap({
    inputCurrency: native,
    outputCurrency: usdt,
    amount: nativeAmount,
  })
  await swapPage.mockSwapApi(`test/swap/mock/${chainId}-usdt-to-native.json`)
  await swapPage.swap({
    inputCurrency: usdt,
    outputCurrency: native,
    amount: 'max',
  })
})

test('Swap Native to WBTC on advanced swap page', async ({ page }) => {
  const url = BASE_URL.concat(`/${getChainById(chainId).key}/swap/advanced`)
  const swapPage = new AdvancedSwapPage(page, chainId)
  await swapPage.goTo(url)
  await swapPage.connect()
  await swapPage.switchNetwork(chainId)

  await swapPage.mockSwapApi(`test/swap/mock/${chainId}-native-to-wbtc.json`)
  await swapPage.swap({
    inputCurrency: native,
    outputCurrency: wbtc,
    amount: nativeAmount,
  })
})
