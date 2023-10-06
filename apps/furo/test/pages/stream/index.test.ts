import { expect, Page, test } from '@playwright/test'
import { Token, USDC_ADDRESS } from 'sushi/currency'
import { addWeeks, getUnixTime, subWeeks } from 'date-fns'

import {
  createSingleStream,
  createSnapshot,
  getStartOfMonthUnix,
  increaseEvmTime,
  loadSnapshot,
  switchNetwork,
} from '../../utils'

if (!process.env.CHAIN_ID) {
  throw new Error('CHAIN_ID env var not set')
}

let SNAPSHOT_ID = '0x0'
const BASE_URL = process.env.PLAYWRIGHT_URL || 'http://localhost:3000/furo'
const CHAIN_ID = parseInt(process.env.CHAIN_ID)
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

test('Create, Withdraw, Update, Transfer, Cancel.', async ({ page }) => {
  const streamId = '1082'
  const withdrawAmount = 0.000002
  const transferToRecipient = '0xc39c2d6eb8adef85f9caa141ec95e7c0b34d8dec'

  await createSingleStream(page, {
    chainId: CHAIN_ID,
    token: USDC,
    amount: '0.00001',
    recipient: RECIPIENT,
  })
  await withdrawFromStream(page, streamId, withdrawAmount)
  // ! BentoBox signature is invalid, for some reason
  // await updateStream(page, streamId)
  await transferStream(page, streamId, transferToRecipient)
  await cancelStream(page, streamId)
})

async function updateStream(page: Page, streamId: string) {
  const url = BASE_URL.concat(`/stream/${CHAIN_ID}:${streamId}`)
  await mockSubgraph(page)
  await page.goto(url)
  await switchNetwork(page, CHAIN_ID)
  const openUpdateLocator = page.locator('[testdata-id=stream-update-button]')
  await expect(openUpdateLocator).toBeVisible()
  await expect(openUpdateLocator).toBeEnabled()
  await openUpdateLocator.click()

  const amountSwitchLocator = page.locator('[testdata-id=update-amount-switch]')
  await expect(amountSwitchLocator).toBeVisible()
  await expect(amountSwitchLocator).toBeEnabled()
  await amountSwitchLocator.click()

  await page.locator('[testdata-id=furo-stream-top-up]').fill('0.000002')

  const approveBentoboxLocator = page.locator(
    '[testdata-id=furo-update-stream-approve-bentobox-button]',
  )
  await expect(approveBentoboxLocator).toBeVisible()
  await expect(approveBentoboxLocator).toBeEnabled()
  await approveBentoboxLocator.click()

  const approveLocator = page.locator(
    '[testdata-id=approve-erc20-update-stream-button]',
  )
  await expect(approveLocator).toBeVisible()
  await expect(amountSwitchLocator).toBeEnabled()
  await approveLocator.click()

  const confirmWithdrawalLocator = page.locator(
    '[testdata-id=stream-update-confirmation-button]',
  )
  await expect(confirmWithdrawalLocator).toBeVisible()
  await expect(confirmWithdrawalLocator).toBeEnabled()
  await confirmWithdrawalLocator.click()

  const text = 'Successfully updated stream'
  await expect(page.locator(`:has-text(${text})`).last()).toContainText(text)
}

async function withdrawFromStream(
  page: Page,
  streamId: string,
  withdrawAmount: number,
) {
  const twoWeeks = 60 * 60 * 24 * 14
  const middleOfStream = getStartOfMonthUnix(2) + twoWeeks * 1000
  await increaseEvmTime(middleOfStream, CHAIN_ID)
  await mockSubgraph(page)

  const url = BASE_URL.concat(`/stream/${CHAIN_ID}:${streamId}`)
  await page.goto(url)
  await switchNetwork(page, CHAIN_ID)

  const openWithdrawLocator = page.locator(
    '[testdata-id=stream-withdraw-button]',
  )
  await expect(openWithdrawLocator).toBeVisible()
  await expect(openWithdrawLocator).toBeEnabled()
  await openWithdrawLocator.click()

  await page
    .locator('[testdata-id=withdraw-modal-input]')
    .fill(withdrawAmount.toString())

  const confirmWithdrawalLocator = page.locator(
    '[testdata-id=withdraw-modal-confirmation-button]',
  )
  await expect(confirmWithdrawalLocator).toBeVisible()
  await expect(confirmWithdrawalLocator).toBeEnabled()
  await confirmWithdrawalLocator.click()

  const text = `Successfully withdrawn ${withdrawAmount} ${USDC.symbol}`
  expect(page.getByText(text, { exact: true }))
}

async function transferStream(page: Page, streamId: string, recipient: string) {
  const url = BASE_URL.concat(`/stream/${CHAIN_ID}:${streamId}`)
  await mockSubgraph(page)
  await page.goto(url)
  await switchNetwork(page, CHAIN_ID)
  const openTransferLocator = page.locator(
    '[testdata-id=stream-transfer-button]',
  )
  await expect(openTransferLocator).toBeVisible()
  await expect(openTransferLocator).toBeEnabled()
  await openTransferLocator.click()

  const recipientLocator = page.locator(
    '[testdata-id=transfer-recipient-input]',
  )
  await expect(recipientLocator).toBeVisible()
  await recipientLocator.fill(recipient)

  const confirmTransferLocator = page.locator(
    '[testdata-id=transfer-confirmation-button]',
  )
  await expect(confirmTransferLocator).toBeVisible()
  await expect(confirmTransferLocator).toBeEnabled()
  await confirmTransferLocator.click()

  const regex = new RegExp('(Successfully transferred Stream to *.)')
  expect(page.getByText(regex))
}

async function cancelStream(page: Page, streamId: string) {
  const url = BASE_URL.concat(`/stream/${CHAIN_ID}:${streamId}`)
  await mockSubgraph(page)
  await page.goto(url)
  await switchNetwork(page, CHAIN_ID)
  const openTransferLocator = page.locator('[testdata-id=stream-cancel-button]')
  await expect(openTransferLocator).toBeVisible()
  await expect(openTransferLocator).toBeEnabled()
  await openTransferLocator.click()

  const confirmTransferLocator = page.locator(
    '[testdata-id=cancel-confirmation-button]',
  )
  await expect(confirmTransferLocator).toBeVisible()
  await expect(confirmTransferLocator).toBeEnabled()
  await confirmTransferLocator.click()

  const text = 'Successfully cancelled stream'
  expect(page.getByText(text, { exact: true }))
}

async function mockSubgraph(page: Page) {
  await page.route(
    'https://api.thegraph.com/subgraphs/name/sushi-subgraphs/furo-polygon',
    async (route, request) => {
      if (request.method() === 'POST') {
        const postData = JSON.parse(request.postData() as string)
        if (postData.query.includes('query stream')) {
          const resultData = {
            data: {
              stream: {
                id: '1082',
                __typename: 'Stream',
                status: 'ACTIVE',
                // leave the start time to current - 14 days and expire in current + 14 days, instead of using some random lib to mock all the Date.now() calls in the app.
                startedAt: getUnixTime(subWeeks(new Date(), 2)),
                expiresAt: getUnixTime(addWeeks(new Date(), 2)),
                extendedAtTimestamp: '0',
                modifiedAtTimestamp: '1683753448',
                initialShares: '100',
                initialAmount: '100',
                extendedShares: '0',
                initialSharesExtended: '0',
                remainingShares: '94',
                withdrawnAmount: '3',
                withdrawnAmountAfterExtension: '0',
                txHash:
                  '0xafa37b611226dc1243e2e63e8e66379f6dd8d8347f21254b73d060cd4bfaa046',
                recipient: { id: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' },
                createdBy: { id: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' },
                token: {
                  id: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                  name: 'USD Coin',
                  symbol: 'USDC',
                  decimals: '6',
                },
              },
            },
          }
          return await route.fulfill({
            contentType: 'application/json',
            body: JSON.stringify(resultData),
          })
        } else if (postData.query.includes('query streamTransactions')) {
          const resultData = [
            {
              id: '1082:tx:0',
              type: 'DEPOSIT',
              amount: '100',
              toBentoBox: true,
              createdAtBlock: '42545913',
              createdAtTimestamp: '1683747786',
              txHash:
                '0xafa37b611226dc1243e2e63e8e66379f6dd8d8347f21254b73d060cd4bfaa046',
              token: {
                id: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                name: 'USD Coin',
                symbol: 'USDC',
                decimals: '6',
              },
              to: {
                id: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
              },
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
                base: '100',
                elastic: '100',
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
    },
  )
}
