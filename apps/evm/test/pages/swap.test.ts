import { DAI, Native, SUSHI, USDC, USDT, WBTC } from '@sushiswap/currency'

import { SupportedChainId } from '../../config'

type InputType = 'INPUT' | 'OUTPUT'

// eslint-disable-next-line turbo/no-undeclared-env-vars
if (!process.env.CHAIN_ID) throw new Error('CHAIN_ID env var not set')

// eslint-disable-next-line turbo/no-undeclared-env-vars
const chainId = Number(process.env.CHAIN_ID) as SupportedChainId

const url = 'http://localhost:3000/swap'

const native = Native.onChain(chainId)
const wnative = native.wrapped

const usdc = USDC[chainId]
const usdt = USDT[chainId]
const dai = DAI[chainId]
const sushi = SUSHI[chainId]
const wbtc = WBTC[chainId]

// test.beforeAll(async () => {})

// test.beforeEach(async ({ page }) => {
//   page.on('pageerror', (error) => {
//     console.error(error)
//   })
//   // We cam reset the fork easily
//   // const client = createTestClient({ mode: 'anvil', chain: foundry, transport: http() })
//   // await client.reset({ blockNumber: 42259027n })
//   await page.goto(url)
//   await switchNetwork(page, chainId)
// })

// test.afterAll(async () => {})
// test.afterEach(async ({ page }) => {})

// test('Wrap and unwrap', async ({ page }) => {
//   await wrap(page, native, wnative, '10')
//   await wrap(page, wnative, native, '10')
// })
//
// test('Swap Native to SUSHI, then SUSHI to NATIVE', async ({ page }) => {
//   await swap(page, native, sushi, '100')
//   await maxSwap(page, sushi, native)
// })
//
// test('Swap Native to USDC, USDC to USDT then USDT to NATIVE', async ({ page }) => {
//   await swap(page, native, usdc, '100')
//   await maxSwap(page, usdc, usdt)
//   await maxSwap(page, usdt, native)
// })

// test('Swap Native to USDC, USDC to DAI, DAI to USDT then USDT to NATIVE ', async ({ page }) => {
//   await swap(page, native, usdc, '100')
//   await maxSwap(page, usdc, dai)
//   await maxSwap(page, dai, usdt)
//   await maxSwap(page, usdt, native)
// })

// test('Swap Native to WBTC', async ({ page }) => {
//   await swap(page, native, wbtc, '100')
// })
