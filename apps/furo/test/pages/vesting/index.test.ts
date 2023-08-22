import { expect, Page, test } from '@playwright/test'
import { Token, USDC_ADDRESS } from '@sushiswap/currency'
import { addWeeks, getUnixTime, subWeeks } from 'date-fns'

import {
  createSingleVest,
  createSnapshot,
  getStartOfMonthUnix,
  GradedVestingFrequency,
  increaseEvmTime,
  loadSnapshot,
  switchNetwork,
  VestingArgs,
} from '../../utils'

if (!process.env.CHAIN_ID) {
  throw new Error('CHAIN_ID env var not set')
}

let SNAPSHOT_ID = '0x0'
const BASE_URL = process.env.PLAYWRIGHT_URL || 'http://localhost:3000/furo'
const CHAIN_ID = parseInt(process.env.CHAIN_ID)
const VEST_ID = '100'
const RECIPIENT = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

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

test.describe('Vest', () => {
  test('Create, Withdraw, Transfer, cancel', async ({ page }) => {
    const args: VestingArgs = {
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
    }
    await createSingleVest(page, args)

    const twoWeeks = 60 * 60 * 24 * 14
    const middleOfVest = getStartOfMonthUnix(4) + twoWeeks * 50 * 1000 // FIXME: Might want to change this, the x50 multiplier is just to make sure the vest has ended..
    await increaseEvmTime(middleOfVest, CHAIN_ID)

    await withdrawVest(page)
    await transferVest(page, '0xc39c2d6eb8adef85f9caa141ec95e7c0b34d8dec')
    await cancelVest(page)
  })
})
async function withdrawVest(page: Page) {
  await mockSubgraph(page)

  const url = BASE_URL.concat(`/vesting/${CHAIN_ID}:${VEST_ID}`)
  await page.goto(url)
  await switchNetwork(page, CHAIN_ID)

  const openWithdrawLocator = page.locator('[testdata-id=vest-withdraw-button]')
  await expect(openWithdrawLocator).toBeVisible()
  await expect(openWithdrawLocator).toBeEnabled()
  await openWithdrawLocator.click()

  const confirmWithdrawalLocator = page.locator('[testdata-id=withdraw-modal-confirmation-button]')
  await expect(confirmWithdrawalLocator).toBeVisible()
  await expect(confirmWithdrawalLocator).toBeEnabled()
  await confirmWithdrawalLocator.click()

  const regex = new RegExp(`(Successfully withdrawn .* ${USDC.symbol})`)
  expect(page.getByText(regex))
}

async function transferVest(page: Page, recipient: string) {
  const url = BASE_URL.concat(`/vesting/${CHAIN_ID}:${VEST_ID}`)
  await mockSubgraph(page)
  await page.goto(url)
  await switchNetwork(page, CHAIN_ID)
  const openTransferLocator = page.locator('[testdata-id=vest-transfer-button]')
  await expect(openTransferLocator).toBeVisible()
  await expect(openTransferLocator).toBeEnabled()
  await openTransferLocator.click()

  const recipientLocator = page.locator('[testdata-id=transfer-recipient-input]')
  await expect(recipientLocator).toBeVisible()
  await recipientLocator.fill(recipient)

  const confirmTransferLocator = page.locator('[testdata-id=transfer-confirmation-button]')
  await expect(confirmTransferLocator).toBeVisible()
  await expect(confirmTransferLocator).toBeEnabled()
  await confirmTransferLocator.click()

  const regex = new RegExp('(Successfully transferred Vest to *.)')
  expect(page.getByText(regex))
}

async function cancelVest(page: Page) {
  const url = BASE_URL.concat(`/vesting/${CHAIN_ID}:${VEST_ID}`)
  await mockSubgraph(page)
  await page.goto(url)
  await switchNetwork(page, CHAIN_ID)
  const openTransferLocator = page.locator('[testdata-id=vest-cancel-button]')
  await expect(openTransferLocator).toBeVisible()
  await expect(openTransferLocator).toBeEnabled()
  await openTransferLocator.click()

  const confirmTransferLocator = page.locator('[testdata-id=cancel-confirmation-button]')
  await expect(confirmTransferLocator).toBeVisible()
  await expect(confirmTransferLocator).toBeEnabled()
  await confirmTransferLocator.click()

  const text = 'Successfully cancelled vest'
  expect(page.getByText(text))
}
async function mockSubgraph(page: Page) {
  await page.route('https://api.thegraph.com/subgraphs/name/sushi-subgraphs/furo-polygon', async (route, request) => {
    if (request.method() === 'POST') {
      const postData = JSON.parse(request.postData() as string)
      if (postData.query.includes('query vesting')) {
        const resultData = {
          data: {
            vesting: {
              id: '100',
              __typename: 'Vesting',
              status: 'ACTIVE',
              steps: '10',
              startedAt: getUnixTime(subWeeks(new Date(), 22)),
              expiresAt: getUnixTime(addWeeks(new Date(), 10)),
              modifiedAtTimestamp: '1657432153',
              cliffDuration: '7890000',
              stepDuration: '604800',
              stepShares: '10',
              cliffShares: '100',
              initialShares: '300',
              initialAmount: '300',
              remainingShares: '150',
              withdrawnAmount: '0',
              fromBentoBox: false,
              txHash: '0xe66ba9d9af0deaed7029ae16dbf6c735310f82dc7f4fe29e2ed7fa0cc213aec1',
              token: {
                id: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                name: 'USD Coin (PoS)',
                symbol: 'USDC',
                decimals: '6',
              },
              recipient: { id: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' },
              createdBy: { id: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' },
            },
          },
        }
        return await route.fulfill({
          contentType: 'application/json',
          body: JSON.stringify(resultData),
        })
      } else if (postData.query.includes('query vestingTransactions')) {
        const resultData = [
          {
            id: '1082:tx:0',
            type: 'DEPOSIT',
            amount: '3000',
            toBentoBox: true,
            createdAtBlock: '42545913',
            createdAtTimestamp: '1683747786',
            txHash: '0xafa37b611226dc1243e2e63e8e66379f6dd8d8347f21254b73d060cd4bfaa046',
            token: {
              id: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
              name: 'USD Coin',
              symbol: 'USDC',
              decimals: '6',
            },
            to: { id: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' },
          },
        ]
        return await route.fulfill({
          contentType: 'application/json',
          body: JSON.stringify(resultData),
        })
      } else if (postData.query.includes('query bentoBoxRebase')) {
        const resultData = {
          data: {
            rebase: {
              id: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
              base: '300',
              elastic: '300',
            },
          },
        }

        return await route.fulfill({
          contentType: 'application/json',
          body: JSON.stringify(resultData),
        })
      } else {
        return await route.continue()
      }
    } else {
      return await route.continue()
    }
  })
}
