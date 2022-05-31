import { Dappeteer } from '@chainsafe/dappeteer'
import { closeValues } from '@sushiswap/trident-sdk'
import { Browser, Page } from 'puppeteer'

import { FUNDING_SOURCE, RATIO } from './constants/Index'
import { TestHelper } from './helpers/TestHelper'
import { AddLiquidityPage } from './pages/pools/AddLiquidityPage'
import { LiquidityPoolsPage } from './pages/pools/LiquidityPoolsPage'
import { PoolPage } from './pages/pools/PoolPage'
import { RemoveLiquidityPage } from './pages/pools/RemoveLiquidityPage'

require('dotenv').config()

let baseUrl: string = process.env.TEST_BASE_URL || 'http://localhost:3000'

let browser: Browser
let page: Page
let metamask: Dappeteer

let liquidityPoolsPage: LiquidityPoolsPage
let removeLiquidityPage: RemoveLiquidityPage
let addLiquidityPage: AddLiquidityPage
let poolPage: PoolPage

async function initPages() {
  liquidityPoolsPage = new LiquidityPoolsPage(page, metamask, baseUrl)
  poolPage = new PoolPage(page, metamask)
  addLiquidityPage = new AddLiquidityPage(page, metamask)
  removeLiquidityPage = new RemoveLiquidityPage(page, metamask)
}

jest.retryTimes(1)

describe('Remove Liquidity:', () => {
  beforeAll(async () => {
    ;[metamask, browser, page] = await TestHelper.initDappeteer()
    await initPages()
  })

  afterAll(async () => {
    browser.close()
  })

  test.each([
    [25, RATIO.EQUAL, FUNDING_SOURCE.BENTO],
    [25, RATIO.EQUAL, FUNDING_SOURCE.WALLET],
  ])(`Remove %p percent in %p amounts and withdraw to %p`, async (removePercent, ratio, receiveTo) => {
    const targetPoolName = 'USDC-WETH'
    const fixedRatio = ratio === RATIO.EQUAL
    const withdrawToWallet = receiveTo === FUNDING_SOURCE.WALLET
    // USDC: Asset A
    // WETH: Asset B

    await liquidityPoolsPage.navigateTo()
    await liquidityPoolsPage.connectMetamaskWallet()
    await liquidityPoolsPage.goToPool(targetPoolName)

    const poolLink = page.url()

    // Get position & balances before
    const positionBeforeWithdraw = await poolPage.getPoolPosition()
    expect(positionBeforeWithdraw.assetA).toEqual('USDC')
    expect(positionBeforeWithdraw.assetB).toEqual('WETH')
    expect(positionBeforeWithdraw.amountA || positionBeforeWithdraw.amountB).toBeGreaterThan(0)

    await poolPage.clickAddLiquidityButton()

    const usdcBalanceBefore = await addLiquidityPage.getAssetABalance(withdrawToWallet)
    const ethBalanceBefore = await addLiquidityPage.getAssetBBalance(withdrawToWallet)

    // Set up page before confirm
    await liquidityPoolsPage.navigateTo()
    await liquidityPoolsPage.goToPool(targetPoolName)
    await poolPage.clickRemoveLiquidityButton()

    await removeLiquidityPage.setRemovePercent(removePercent)
    await removeLiquidityPage.setFixedRatio(fixedRatio)
    await removeLiquidityPage.setWithdrawToWallet(withdrawToWallet)

    const minLiquidityOutput = await removeLiquidityPage.getMinLiquidityOutput(targetPoolName)

    await removeLiquidityPage.confirmWithdrawal()

    await page.goto(poolLink)
    await page.waitForSelector(`#pool-title-${targetPoolName}`)

    // Get position & balances after
    const positionAfterDeposit = await poolPage.getPoolPosition()
    expect(positionAfterDeposit.assetA).toEqual('USDC')
    expect(positionAfterDeposit.assetB).toEqual('WETH')

    await poolPage.clickAddLiquidityButton()

    const usdcBalanceAfter = await addLiquidityPage.getAssetABalance(withdrawToWallet)
    const ethBalanceAfter = await addLiquidityPage.getAssetBBalance(withdrawToWallet)

    const usdcBalanceDiff = usdcBalanceAfter - usdcBalanceBefore
    const ethBalanceDiff = ethBalanceAfter - ethBalanceBefore

    expect(closeValues(usdcBalanceDiff, minLiquidityOutput.amountA, 1e-9)).toBe(true)
    expect(closeValues(ethBalanceDiff, minLiquidityOutput.amountB, 1e-9)).toBe(true)
  })
})
