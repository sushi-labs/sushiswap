import { Page, expect, test } from '@playwright/test'
import { Token, USDC_ADDRESS } from '@sushiswap/currency'
import {
  addMonths,
  addWeeks,
  getDate,
  getUnixTime,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
  startOfDay,
  startOfMonth,
  subWeeks,
} from 'date-fns'
import { ethers } from 'ethers'
import { createSingleStream, switchNetwork } from '../../utils'

if (!process.env.CHAIN_ID) {
  throw new Error('CHAIN_ID env var not set')
}

const CHAIN_ID = parseInt(process.env.CHAIN_ID)
const RECIPIENT = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

const USDC = new Token({
  chainId: CHAIN_ID,
  address: USDC_ADDRESS[CHAIN_ID as keyof typeof USDC_ADDRESS],
  decimals: 18,
  symbol: 'USDC',
  name: 'USDC Stablecoin',
})

test('Withdraw', async ({ page }) => {
  await createSingleStream(CHAIN_ID, USDC, '0.0001', RECIPIENT, page) // TODO: create fixture for this
  const withdrawAmount = '0.000002'
  const STREAM_ID = '1082'

  const url = (process.env.PLAYWRIGHT_URL as string).concat(`/stream/${CHAIN_ID}:${STREAM_ID}`)
  const twoWeeks = 60 * 60 * 24 * 14
  const middleOfStream = getStartOfMonthUnix(2) + twoWeeks * 1_000
  await increaseEvmTime(middleOfStream)
  await mockSubgraph(page)

  await page.goto(url)
  await switchNetwork(page, CHAIN_ID)

  const openWithdrawLocator = page.locator('[testdata-id=stream-withdraw-button]')
  await expect(openWithdrawLocator).toBeVisible()
  await expect(openWithdrawLocator).toBeEnabled()
  await openWithdrawLocator.click()

  await page.locator('[testdata-id=withdraw-modal-input]').fill(withdrawAmount)

  const confirmWithdrawalLocator = page.locator('[testdata-id=withdraw-modal-confirmation-button]')

  await expect(confirmWithdrawalLocator).toBeVisible()
  await expect(confirmWithdrawalLocator).toBeEnabled()
  await confirmWithdrawalLocator.click()

  const expectedText = `(Successfully withdrawn ${withdrawAmount} ${USDC.symbol})`
  const regex = new RegExp(expectedText)
  await expect(page.locator('span', { hasText: regex }).last()).toContainText(regex)
})

async function mockSubgraph(page: Page) {
  await page.route('https://api.thegraph.com/subgraphs/name/sushi-subgraphs/furo-polygon', async (route, request) => {
    if (request.method() === 'POST') {
      const response = await route.fetch()
      const postData = JSON.parse(request.postData() as string)
      if (postData.query.includes('_0_stream: stream')) {
        const resultData = {
          data: {
            _0_stream: {
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
              txHash: '0xafa37b611226dc1243e2e63e8e66379f6dd8d8347f21254b73d060cd4bfaa046',
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
          response,
          contentType: 'application/json',
          body: JSON.stringify(resultData),
        })
      } else if (postData.query.includes('Transaction_orderBy')) {
        const resultData = [
          {
            id: '1082:tx:0',
            type: 'DEPOSIT',
            amount: '100',
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
            to: {
              id: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
            },
          },
        ]
        return await route.fulfill({
          response,
          contentType: 'application/json',
          body: JSON.stringify(resultData),
        })
      } else if (postData.query.includes('_0_rebase: rebase')) {
        const resultData = {
          data: {
            _0_rebase: {
              id: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
              base: '100',
              elastic: '100',
            },
          },
        }

        return await route.fulfill({
          response,
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

async function increaseEvmTime(unix: number) {
  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545', CHAIN_ID)
  // await provider.send('evm_increaseTime', [unix])
  await provider.send('evm_mine', [unix])
}

function getStartOfMonthUnix(months: number) {
  const currentDate = new Date()
  const nextMonth = addMonths(currentDate, months)
  const firstDayOfMonth = startOfMonth(nextMonth)
  const startOfNextMonth = setMilliseconds(setSeconds(setMinutes(setHours(startOfDay(firstDayOfMonth), 0), 0), 0), 0)
  return getUnixTime(startOfNextMonth)
}
