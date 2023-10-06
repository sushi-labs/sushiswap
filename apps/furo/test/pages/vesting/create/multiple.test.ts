import { test } from '@playwright/test'
import { Native, Token, USDC_ADDRESS } from 'sushi/currency'
import {
  createMultipleVests,
  createSnapshot,
  GradedVestingFrequency,
  loadSnapshot,
} from '../../../utils'

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

test('Create multiple vest', async ({ page }) => {
  await createMultipleVests(page, CHAIN_ID, [
    // Add native vesting
    {
      chainId: CHAIN_ID,
      token: NATIVE_TOKEN,
      startInMonths: 1,
      recipient: RECIPIENT,
      graded: {
        stepAmount: '1',
        steps: 12,
        frequency: GradedVestingFrequency.MONTHLY,
      },
    },
    // Add native vesting with cliff
    {
      chainId: CHAIN_ID,
      token: NATIVE_TOKEN,
      startInMonths: 1,
      recipient: RECIPIENT,
      graded: {
        stepAmount: '1',
        steps: 12,
        frequency: GradedVestingFrequency.MONTHLY,
      },
      cliff: {
        amount: '10',
        cliffEndsInMonths: 3,
      },
    },
    // Add graded usdc vesting
    {
      chainId: CHAIN_ID,
      token: USDC,
      startInMonths: 1,
      recipient: RECIPIENT,
      graded: {
        stepAmount: '0.0001',
        steps: 10,
        frequency: GradedVestingFrequency.BI_WEEKLY,
      },
    },
    // Add usdc vesting with cliff
    {
      chainId: CHAIN_ID,
      token: USDC,
      startInMonths: 1,
      recipient: RECIPIENT,
      graded: {
        stepAmount: '0.0001',
        steps: 10,
        frequency: GradedVestingFrequency.BI_WEEKLY,
      },
      cliff: {
        amount: '0.00001',
        cliffEndsInMonths: 3,
      },
    },
  ])
})
