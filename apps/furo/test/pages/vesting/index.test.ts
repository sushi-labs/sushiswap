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
import {
  GradedVestingFrequency,
  VestingArgs,
  createSingleStream,
  createSingleVest,
  switchNetwork,
  timeout,
} from '../../utils'

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

test.describe('Vest', () => {
  const VEST_ID = '8'
  test('Create', async ({ page }) => {
    test.slow()
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
  })

  test('Withdraw', async ({ page }) => {
    const withdrawAmount = '0.00001'

    // const tenWeeks = 60 * 60 * 24 * 7 * 26 * 1_000
    // const middleOfStream = Number(((tenWeeks)).toFixed())
      const twoWeeks = 60 * 60 * 24 * 14
    const middleOfVest = getStartOfMonthUnix(4) + twoWeeks * 50 * 1000
    await increaseEvmTime(middleOfVest)

    await mockSubgraph(page)

    const url = (process.env.PLAYWRIGHT_URL as string).concat(`/vesting/${CHAIN_ID}:${VEST_ID}`)
    await page.goto(url)
    await switchNetwork(page, CHAIN_ID)

    const openWithdrawLocator = page.locator('[testdata-id=vest-withdraw-button]')
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

  //   test('Update', async ({ page }) => {
  //     const url = (process.env.PLAYWRIGHT_URL as string).concat(`/stream/${CHAIN_ID}:${VEST_ID}`)
  //     await mockSubgraph(page)
  //     await page.goto(url)
  //     await switchNetwork(page, CHAIN_ID)
  //     const openUpdateLocator = page.locator('[testdata-id=stream-update-button]')
  //     await expect(openUpdateLocator).toBeVisible()
  //     await expect(openUpdateLocator).toBeEnabled()
  //     await openUpdateLocator.click()

  //     const amountSwitchLocator = page.locator('[testdata-id=update-amount-switch]')
  //     await expect(amountSwitchLocator).toBeVisible()
  //     await expect(amountSwitchLocator).toBeEnabled()
  //     await amountSwitchLocator.click()

  //     await page.locator('[testdata-id=furo-stream-top-up]').fill('0.0001')

  //     const confirmWithdrawalLocator = page.locator('[testdata-id=stream-update-confirmation-button]')

  //     // approve
  //     const approveLocator = page.locator('[testdata-id=approve-erc20-update-stream]')
  //     await expect(approveLocator).toBeVisible()
  //     await expect(amountSwitchLocator).toBeEnabled()
  //     await approveLocator.click()

  //     await expect(confirmWithdrawalLocator).toBeVisible()
  //     await expect(confirmWithdrawalLocator).toBeEnabled()
  //     await confirmWithdrawalLocator.click()

  //     const expectedText = '(Successfully updated stream)'
  //     const regex = new RegExp(expectedText)
  //     await expect(page.locator('span', { hasText: regex }).last()).toContainText(regex)
  //   });
})

async function mockSubgraph(page: Page) {
  await page.route('https://api.thegraph.com/subgraphs/name/sushi-subgraphs/furo-polygon', async (route, request) => {
    if (request.method() === 'POST') {
      const response = await route.fetch()
      const postData = JSON.parse(request.postData() as string)
      if (postData.query.includes('_0_vesting: vesting')) {
        const resultData = {
          data: {
            _0_vesting: {
              id: '8',
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
          response,
          contentType: 'application/json',
          body: JSON.stringify(resultData),
        })
      } else if (postData.query.includes('Transaction_orderBy')) {
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
          response,
          contentType: 'application/json',
          body: JSON.stringify(resultData),
        })
      } else if (postData.query.includes('_0_rebase: rebase')) {
        const resultData = {
          data: {
            _0_rebase: {
              id: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
              base: '300',
              elastic: '300',
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
