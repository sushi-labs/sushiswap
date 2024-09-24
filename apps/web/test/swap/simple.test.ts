import { test } from 'next/experimental/testmode/playwright.js'
import { Native, USDC, USDT, WBTC } from 'sushi/currency'
import { chainId, nativeAmount } from 'test/constants'
import { SwapPage } from 'test/helpers/swap'
import {
  // createSnapshot,
  interceptAnvil,
  // loadSnapshot,
} from 'test/intercept-anvil'

const url = 'http://localhost:3000/swap'

const native = Native.onChain(chainId)
const wnative = native.wrapped

const usdc = USDC[chainId]
const usdt = USDT[chainId]
const wbtc = WBTC[chainId]
// let snapshot: string

test.beforeAll(async () => {
  // snapshot = await createSnapshot(chainId)
})

test.beforeEach(async ({ page, next }) => {
  page.on('pageerror', (error) => {
    console.error(error)
  })
  // await loadSnapshot(chainId, snapshot)

  await page.route('http://localhost:3000/api/swap', async (route) => {
    await route.fulfill({ json: { maintenance: false } })
  })

  // await page.route(
  //   'http://localhost:3000/api/balance/v0/**/*',
  //   async (route) => {
  //     await route.fulfill({ json: {} })
  //   },
  // )

  // await page.route('http://tokens.sushi.com/v0', async (route) => {
  //   await route.fulfill({
  //     json: [wnative, usdc, usdt, wbtc].map((token) => ({
  //       id: token.id,
  //       chainId: token.chainId,
  //       address: token.address.toLowerCase(),
  //       name: token.name,
  //       symbol: token.symbol,
  //       decimals: token.decimals,
  //     })),
  //   })
  // })

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
//   await page.unrouteAll({ behavior: 'ignoreErrors' })
// })

test('Wrap and unwrap', async ({ page }) => {
  // test.slow()
  const swapPage = new SwapPage(page, chainId)
  await swapPage.goTo(url)
  await swapPage.connect()
  await swapPage.selectNetwork(chainId)
  await swapPage.switchNetwork(chainId)
  await swapPage.mockSwapApi(`test/swap/mock/${chainId}-wrap.json`)
  await swapPage.wrap(native, wnative, nativeAmount)
  await swapPage.mockSwapApi(`test/swap/mock/${chainId}-unwrap.json`)
  await swapPage.wrap(wnative, native, 'max')
})

test('swap Native to USDC, then USDC to NATIVE', async ({ page }) => {
  const swapPage = new SwapPage(page, chainId)
  await swapPage.goTo(url)
  await swapPage.connect()
  await swapPage.selectNetwork(chainId)
  await swapPage.switchNetwork(chainId)
  await swapPage.mockSwapApi(`test/swap/mock/${chainId}-native-to-usdc.json`)
  await swapPage.swap(native, usdc, nativeAmount)

  await swapPage.mockSwapApi(`test/swap/mock/${chainId}-usdc-to-native.json`)
  await swapPage.swap(usdc, native, 'max')
})

test('swap Native to USDT, then USDT to NATIVE', async ({ page }) => {
  const swapPage = new SwapPage(page, chainId)
  await swapPage.goTo(url)
  await swapPage.connect()
  await swapPage.selectNetwork(chainId)
  await swapPage.switchNetwork(chainId)
  await swapPage.mockSwapApi(`test/swap/mock/${chainId}-native-to-usdt.json`)
  await swapPage.swap(native, usdt, nativeAmount)

  await swapPage.mockSwapApi(`test/swap/mock/${chainId}-usdt-to-native.json`)
  await swapPage.swap(usdt, native, 'max')
})

test('Swap Native to WBTC', async ({ page }) => {
  // test.slow()
  const swapPage = new SwapPage(page, chainId)
  await swapPage.goTo(url)
  await swapPage.connect()
  await swapPage.selectNetwork(chainId)
  await swapPage.switchNetwork(chainId)

  await swapPage.mockSwapApi(`test/swap/mock/${chainId}-native-to-wbtc.json`)
  await swapPage.swap(native, wbtc, nativeAmount)
})
