// @ts-nocheck

import { test } from 'next/experimental/testmode/playwright'
import { DAI, Native, SUSHI, USDC, USDT, WBTC } from 'sushi/currency'

import { SupportedChainId } from 'src/config'
import { SwapPage } from 'test/helpers/swap'
import { interceptAnvil } from 'test/intercept-anvil'

if (typeof process.env.NEXT_PUBLIC_CHAIN_ID !== 'string') {
  new Error('NEXT_PUBLIC_CHAIN_ID not set')
}

const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID) as SupportedChainId

const url = 'http://localhost:3000/swap'

const native = Native.onChain(chainId)
const wnative = native.wrapped

const usdc = USDC[chainId]
const usdt = USDT[chainId]
const _dai = DAI[chainId]
const _sushi = SUSHI[chainId]
const wbtc = WBTC[chainId]

// test.beforeAll(async () => {
//   console.log('beforeAll swap tests')
// })

test.beforeEach(async ({ page, next }) => {
  page.on('pageerror', (error) => {
    console.error(error)
  })

  await page.route('https://localhost:3000/api/swap', async (route) => {
    await route.fill({ success: true, data: { maintenance: false } })
  })

  await page.route('https://tokens.sushi.com/v0', async (route) => {
    await route.fulfill({
      json: [wnative, usdc, usdt, wbtc].map((token) => ({
        id: token.id,
        chainId: token.chainId,
        address: token.address.toLowerCase(),
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
      })),
    })
  })

  // const url = page.url()
  // console.log('url', url)
  // if (url.includes('https://lb.drpc.org')) {
  //   const newUrl = 'http://127.0.0.1:8545'
  //   console.log("rerouted drpc to anvil ..")
  //   route.continue({ url: newUrl })
  // }

  // next.onFetch((request) => {
  //   if (request.url.includes('https://lb.drpc.org')) {
  //     console.log("rerouted drpc to anvil")
  //     const newUrl = 'http://127.0.0.1:8545'
  //     return fetch(newUrl, request)
  //   }
  // })

  try {
    await interceptAnvil(page, next)
  } catch (error) {
    console.error('error intercepting anvil', error)
  }

  next.onFetch(() => {
    return 'continue'
  })

  // await page.goto(url)
  // await switchNetwork(page, chainId)
})

// test.afterAll(async () => {})
// test.afterEach(async ({ page }) => {})

test('Wrap and unwrap', async ({ page }) => {
  test.slow()
  const swapPage = new SwapPage(page, chainId)
  await swapPage.goTo(url)
  await swapPage.connect()
  await swapPage.switchNetwork(chainId)
  await swapPage.mockWeb3Requests()
  await swapPage.mockSwapApi(`test/swap/mock/${chainId}-wrap.json`)
  await swapPage.wrap(native, wnative, '10')

  await swapPage.mockSwapApi(`test/swap/mock/${chainId}-unwrap.json`)
  await swapPage.wrap(wnative, native, '10')
  // await swapPage.unwrap(wnative, native, '10')
})

// // test('Swap Native to SUSHI, then SUSHI to NATIVE', async ({ page }) => {
// //   test.slow()
// //   await swap(page, native, sushi, '10')
// //   await maxSwap(page, sushi, native)
// // })

// test('Swap Native to USDC, then USDC to NATIVE', async ({ page }) => {
//   test.slow()

//   await swap(page, native, usdc, '100')
//   await maxSwap(page, usdc, native)
// })

// test('Swap Native to USDT, then USDT to NATIVE', async ({ page }) => {
//   test.slow()

//   await swap(page, native, usdt, '100')
//   await maxSwap(page, usdt, native)
// })

// test('Swap Native to USDC, USDC to USDT then USDT to NATIVE', async ({
//   page,
// }) => {
//   test.slow()

//   await swap(page, native, usdc, '100')
//   await maxSwap(page, usdc, usdt)
//   await maxSwap(page, usdt, native)
// })

// // test('Swap Native to USDC, USDC to DAI, DAI to USDT then USDT to NATIVE ', async ({ page }) => {
// //   await swap(page, native, usdc, '100')
// //   await maxSwap(page, usdc, dai)
// //   await maxSwap(page, dai, usdt)
// //   await maxSwap(page, usdt, native)
// // })

// test('Swap Native to WBTC', async ({ page }) => {
//   test.slow()
//   await swap(page, native, wbtc, '1')
// })
