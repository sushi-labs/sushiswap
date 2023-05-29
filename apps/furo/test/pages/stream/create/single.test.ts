// import { test } from '@playwright/test'
// import { Native, Token, USDC_ADDRESS } from '@sushiswap/currency'
// import { createSingleStream } from '../../../utils'

// if (!process.env.CHAIN_ID) {
//   throw new Error('CHAIN_ID env var not set')
// }

// const CHAIN_ID = parseInt(process.env.CHAIN_ID)
// const RECIPIENT = '0x23defc2ca207e7fbd84ae43b00048fb5cb4db5b2'

// const NATIVE_TOKEN = Native.onChain(CHAIN_ID)
// const USDC = new Token({
//   chainId: CHAIN_ID,
//   address: USDC_ADDRESS[CHAIN_ID as keyof typeof USDC_ADDRESS],
//   decimals: 18,
//   symbol: 'USDC',
//   name: 'USDC Stablecoin',
// })
// const AMOUNT = '10.0'

// test.describe('Create single stream', () => {
//   test('Native', async ({ page }) => {
//     await createSingleStream(CHAIN_ID, NATIVE_TOKEN, AMOUNT, RECIPIENT, page)
//   })

//   test('USDC', async ({ page }) => {
//     await createSingleStream(CHAIN_ID, USDC, '0.0001', RECIPIENT, page)
//   })
// })
