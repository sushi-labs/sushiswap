import { test } from '@playwright/test'
import { Native, Token, USDC_ADDRESS } from '@sushiswap/currency'

import { createMultipleStreams, createSnapshot, loadSnapshot } from '../../../utils'

let SNAPSHOT_ID = '0x0'
const CHAIN_ID = parseInt(process.env.CHAIN_ID as string)
const RECIPIENT = '0x23defc2ca207e7fbd84ae43b00048fb5cb4db5b2'
const NATIVE_TOKEN = Native.onChain(CHAIN_ID)
const USDC = new Token({
  chainId: CHAIN_ID,
  address: USDC_ADDRESS[CHAIN_ID as keyof typeof USDC_ADDRESS],
  decimals: 18,
  symbol: 'USDC',
  name: 'USDC Stablecoin',
})

test.beforeEach(async () => {
  SNAPSHOT_ID = await createSnapshot(CHAIN_ID)
})
test.afterEach(async () => {
  await loadSnapshot(CHAIN_ID, SNAPSHOT_ID)
})

test('Create multiple streams', async ({ page }) => {
  await createMultipleStreams(page, CHAIN_ID, [
    { chainId: CHAIN_ID, token: NATIVE_TOKEN, amount: '10', recipient: RECIPIENT }, // Add native stream
    { chainId: CHAIN_ID, token: USDC, amount: '0.00001', recipient: RECIPIENT }, // Add usdc stream
  ])
})
