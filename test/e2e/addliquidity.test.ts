import { Dappeteer } from '@chainsafe/dappeteer'
import { closeValues } from '@sushiswap/trident-sdk'
import { Browser, Page } from 'puppeteer'

import { ADDRESSES } from './constants/Index'
import { TestHelper } from './helpers/TestHelper'
import { AddLiquidityPage } from './pages/pools/AddLiquidityPage'
import { LiquidityPoolsPage } from './pages/pools/LiquidityPoolsPage'
import { PoolPage } from './pages/pools/PoolPage'

require('dotenv').config()

let baseUrl: string = process.env.TEST_BASE_URL || 'http://localhost:3000'

let browser: Browser
let page: Page
let metamask: Dappeteer

let liquidityPoolsPage: LiquidityPoolsPage
let poolPage: PoolPage
let addLiquidityPage: AddLiquidityPage

let depositPercentage = 0.01

async function initPages() {
  liquidityPoolsPage = new LiquidityPoolsPage(page, metamask, baseUrl)
  poolPage = new PoolPage(page, metamask)
  addLiquidityPage = new AddLiquidityPage(page, metamask)
}

async function importTokens() {
  await liquidityPoolsPage.addTokenToMetamask(ADDRESSES.USDC)
}

function round(input: number): number {
  return parseFloat(input.toFixed(5))
}

jest.retryTimes(1)

describe('Add Liquidity:', () => {
  beforeAll(async () => {
    ;[metamask, browser, page] = await TestHelper.initDappeteer()
    await initPages()
    await importTokens()
  })

  afterAll(async () => {
    browser.close()
  })

  test('Should deposit USDC from wallet in unequal amounts', async () => {
    const targetPoolName = 'USDC-WETH'

    await liquidityPoolsPage.navigateTo()
    await liquidityPoolsPage.connectMetamaskWallet()
    await liquidityPoolsPage.goToPool(targetPoolName)

    const positionBeforeDeposit = await poolPage.getPoolPosition()
    expect(positionBeforeDeposit.assetA).toEqual('USDC')
    expect(positionBeforeDeposit.assetB).toEqual('WETH')

    const poolLink = page.url()
    await poolPage.clickAddLiquidityButton()

    const usdcWalletBalanceBefore = await addLiquidityPage.getAssetABalance(true)
    const usdcDepositAmount = round(usdcWalletBalanceBefore * depositPercentage)

    await addLiquidityPage.setFixedRatio(false)
    await addLiquidityPage.setAssetAFundFromWallet(true)
    await addLiquidityPage.setAssetADepositAmount(usdcDepositAmount)

    const minLiquidityOutput = await addLiquidityPage.getMinReceivedAmount()

    await addLiquidityPage.confirmDeposit()

    await page.goto(poolLink)
    await page.waitForSelector(`#pool-title-${targetPoolName}`)

    const positionAfterDeposit = await poolPage.getPoolPosition()
    expect(positionAfterDeposit.assetA).toEqual('USDC')
    expect(positionAfterDeposit.assetB).toEqual('WETH')

    await poolPage.clickAddLiquidityButton()
    const usdcWalletBalanceAfter = await addLiquidityPage.getAssetABalance(true)

    const usdcBalanceDiff = usdcWalletBalanceBefore - usdcWalletBalanceAfter
    // @ts-ignore TYPE NEEDS FIXING
    const slpAmountDiff = positionAfterDeposit.slpAmount - positionBeforeDeposit.slpAmount

    expect(closeValues(usdcBalanceDiff, usdcDepositAmount, 1e-9)).toBe(true)
    expect(closeValues(slpAmountDiff, minLiquidityOutput, 1e-9)).toBe(true)
  })

  test('Should deposit ETH from wallet in unequal amounts', async () => {
    const targetPoolName = 'USDC-WETH'

    await liquidityPoolsPage.navigateTo()
    await liquidityPoolsPage.connectMetamaskWallet()
    await liquidityPoolsPage.goToPool(targetPoolName)

    const positionBeforeDeposit = await poolPage.getPoolPosition()
    expect(positionBeforeDeposit.assetA).toEqual('USDC')
    expect(positionBeforeDeposit.assetB).toEqual('WETH')

    const poolLink = page.url()
    await poolPage.clickAddLiquidityButton()

    const ethWalletBalanceBefore = await addLiquidityPage.getAssetBBalance(true)
    const ethDepositAmount = round(ethWalletBalanceBefore * depositPercentage)

    await addLiquidityPage.setFixedRatio(false)
    await addLiquidityPage.setAssetBFundFromWallet(true)
    await addLiquidityPage.setAssetBDepositAmount(ethDepositAmount)

    const minLiquidityOutput = await addLiquidityPage.getMinReceivedAmount()

    await addLiquidityPage.confirmDeposit()

    await page.goto(poolLink)
    await page.waitForSelector(`#pool-title-${targetPoolName}`)

    const positionAfterDeposit = await poolPage.getPoolPosition()
    expect(positionAfterDeposit.assetA).toEqual('USDC')
    expect(positionAfterDeposit.assetB).toEqual('WETH')

    await poolPage.clickAddLiquidityButton()
    const ethWalletBalanceAfter = await addLiquidityPage.getAssetBBalance(true)

    const ethBalanceDiff = ethWalletBalanceBefore - ethWalletBalanceAfter
    // @ts-ignore TYPE NEEDS FIXING
    const slpAmountDiff = positionAfterDeposit.slpAmount - positionBeforeDeposit.slpAmount

    expect(closeValues(ethBalanceDiff, ethDepositAmount, 1e-9)).toBe(true)
    expect(closeValues(slpAmountDiff, minLiquidityOutput, 1e-9)).toBe(true)
  })

  test('Should deposit ETH from bento in unequal amounts', async () => {
    const targetPoolName = 'USDC-WETH'

    await liquidityPoolsPage.navigateTo()
    await liquidityPoolsPage.connectMetamaskWallet()
    await liquidityPoolsPage.goToPool(targetPoolName)

    const positionBeforeDeposit = await poolPage.getPoolPosition()
    expect(positionBeforeDeposit.assetA).toEqual('USDC')
    expect(positionBeforeDeposit.assetB).toEqual('WETH')

    const poolLink = page.url()
    await poolPage.clickAddLiquidityButton()

    const ethBalanceBefore = await addLiquidityPage.getAssetBBalance(false)
    const ethDepositAmount = round(ethBalanceBefore * depositPercentage)

    await addLiquidityPage.setFixedRatio(false)
    await addLiquidityPage.setAssetBFundFromWallet(false)
    await addLiquidityPage.setAssetBDepositAmount(ethDepositAmount)

    const minLiquidityOutput = await addLiquidityPage.getMinReceivedAmount()

    await addLiquidityPage.confirmDeposit()

    await page.goto(poolLink)
    await page.waitForSelector(`#pool-title-${targetPoolName}`)

    const positionAfterDeposit = await poolPage.getPoolPosition()
    expect(positionAfterDeposit.assetA).toEqual('USDC')
    expect(positionAfterDeposit.assetB).toEqual('WETH')

    await poolPage.clickAddLiquidityButton()
    const ethBalanceAfter = await addLiquidityPage.getAssetBBalance(false)

    const ethBalanceDiff = ethBalanceBefore - ethBalanceAfter
    // @ts-ignore TYPE NEEDS FIXING
    const slpAmountDiff = positionAfterDeposit.slpAmount - positionBeforeDeposit.slpAmount

    expect(closeValues(ethBalanceDiff, ethDepositAmount, 1e-9)).toBe(true)
    expect(closeValues(slpAmountDiff, minLiquidityOutput, 1e-9)).toBe(true)
  })

  test('Should deposit ETH from wallet & USDC from wallet in unequal amounts', async () => {
    const targetPoolName = 'USDC-WETH'

    await liquidityPoolsPage.navigateTo()
    await liquidityPoolsPage.connectMetamaskWallet()
    await liquidityPoolsPage.goToPool(targetPoolName)

    const positionBeforeDeposit = await poolPage.getPoolPosition()
    expect(positionBeforeDeposit.assetA).toEqual('USDC')
    expect(positionBeforeDeposit.assetB).toEqual('WETH')
    const poolLink = page.url()

    await poolPage.clickAddLiquidityButton()

    const assetAWalletBalanceBefore = await addLiquidityPage.getAssetABalance(true)
    const assetBWalletBalanceBefore = await addLiquidityPage.getAssetBBalance(true)

    const assetADepositAmount = round(assetAWalletBalanceBefore * depositPercentage)
    const assetBDepositAmount = round(assetBWalletBalanceBefore * depositPercentage)

    await addLiquidityPage.setFixedRatio(false)
    await addLiquidityPage.setAssetAFundFromWallet(true)
    await addLiquidityPage.setAssetBFundFromWallet(true)

    await addLiquidityPage.setAssetBDepositAmount(assetBDepositAmount)
    await addLiquidityPage.setAssetADepositAmount(assetADepositAmount)

    const minLiquidityOutput = await addLiquidityPage.getMinReceivedAmount()

    await addLiquidityPage.confirmDeposit()

    await page.goto(poolLink)
    await page.waitForSelector(`#pool-title-${targetPoolName}`)

    const positionAfterDeposit = await poolPage.getPoolPosition()
    expect(positionAfterDeposit.assetA).toEqual('USDC')
    expect(positionAfterDeposit.assetB).toEqual('WETH')

    await poolPage.clickAddLiquidityButton()
    const assetAWalletBalanceAfter = await addLiquidityPage.getAssetABalance(true)
    const assetBWalletBalanceAfter = await addLiquidityPage.getAssetBBalance(true)

    const assetABalanceDiff = assetAWalletBalanceBefore - assetAWalletBalanceAfter
    const assetBBalanceDiff = assetBWalletBalanceBefore - assetBWalletBalanceAfter
    // @ts-ignore TYPE NEEDS FIXING
    const slpAmountDiff = positionAfterDeposit.slpAmount - positionBeforeDeposit.slpAmount

    expect(closeValues(assetABalanceDiff, assetADepositAmount, 1e-9)).toBe(true)
    expect(closeValues(assetBBalanceDiff, assetBDepositAmount, 1e-9)).toBe(true)
    expect(closeValues(slpAmountDiff, minLiquidityOutput, 1e-9)).toBe(true)
  })

  test('Should deposit ETH from wallet & USDC from bento in unequal amounts', async () => {
    const targetPoolName = 'USDC-WETH'
    // AssetA = USDC, AssetB = WETH

    await liquidityPoolsPage.navigateTo()
    await liquidityPoolsPage.connectMetamaskWallet()
    await liquidityPoolsPage.goToPool(targetPoolName)

    const positionBeforeDeposit = await poolPage.getPoolPosition()
    expect(positionBeforeDeposit.assetA).toEqual('USDC')
    expect(positionBeforeDeposit.assetB).toEqual('WETH')
    const poolLink = page.url()

    await poolPage.clickAddLiquidityButton()

    const usdcBentoBalanceBefore = await addLiquidityPage.getAssetABalance(false)
    const ethWalletBalanceBefore = await addLiquidityPage.getAssetBBalance(true)

    const usdcDepositAmount = round(usdcBentoBalanceBefore * depositPercentage)
    const ethDepositAmount = round(ethWalletBalanceBefore * depositPercentage)

    await addLiquidityPage.setFixedRatio(false)
    await addLiquidityPage.setAssetAFundFromWallet(false)
    await addLiquidityPage.setAssetBFundFromWallet(true)

    await addLiquidityPage.setAssetBDepositAmount(ethDepositAmount)
    await addLiquidityPage.setAssetADepositAmount(usdcDepositAmount)

    const minLiquidityOutput = await addLiquidityPage.getMinReceivedAmount()

    await addLiquidityPage.confirmDeposit()

    await page.goto(poolLink)
    await page.waitForSelector(`#pool-title-${targetPoolName}`)

    const positionAfterDeposit = await poolPage.getPoolPosition()
    expect(positionAfterDeposit.assetA).toEqual('USDC')
    expect(positionAfterDeposit.assetB).toEqual('WETH')

    await poolPage.clickAddLiquidityButton()
    const usdcBentoBalanceAfter = await addLiquidityPage.getAssetABalance(false)
    const ethWalletBalanceAfter = await addLiquidityPage.getAssetBBalance(true)

    const assetABalanceDiff = usdcBentoBalanceBefore - usdcBentoBalanceAfter
    const assetBBalanceDiff = ethWalletBalanceBefore - ethWalletBalanceAfter
    // @ts-ignore TYPE NEEDS FIXING
    const slpAmountDiff = positionAfterDeposit.slpAmount - positionBeforeDeposit.slpAmount

    expect(closeValues(assetABalanceDiff, usdcDepositAmount, 1e-9)).toBe(true)
    expect(closeValues(assetBBalanceDiff, ethDepositAmount, 1e-9)).toBe(true)
    expect(closeValues(slpAmountDiff, minLiquidityOutput, 1e-9)).toBe(true)
  })

  test('Should deposit ETH from bento & USDC from wallet in unequal amounts', async () => {
    const targetPoolName = 'USDC-WETH'
    // AssetA = USDC, AssetB = WETH

    await liquidityPoolsPage.navigateTo()
    await liquidityPoolsPage.connectMetamaskWallet()
    await liquidityPoolsPage.goToPool(targetPoolName)

    const positionBeforeDeposit = await poolPage.getPoolPosition()
    expect(positionBeforeDeposit.assetA).toEqual('USDC')
    expect(positionBeforeDeposit.assetB).toEqual('WETH')
    const poolLink = page.url()

    await poolPage.clickAddLiquidityButton()

    const usdcWalletBalanceBefore = await addLiquidityPage.getAssetABalance(true)
    const ethBentoBalanceBefore = await addLiquidityPage.getAssetBBalance(false)

    const usdcDepositAmount = round(usdcWalletBalanceBefore * depositPercentage)
    const ethDepositAmount = round(ethBentoBalanceBefore * depositPercentage)

    await addLiquidityPage.setFixedRatio(false)
    await addLiquidityPage.setAssetAFundFromWallet(true)
    await addLiquidityPage.setAssetBFundFromWallet(false)

    await addLiquidityPage.setAssetBDepositAmount(ethDepositAmount)
    await addLiquidityPage.setAssetADepositAmount(usdcDepositAmount)

    const minLiquidityOutput = await addLiquidityPage.getMinReceivedAmount()

    await addLiquidityPage.confirmDeposit()

    await page.goto(poolLink)
    await page.waitForSelector(`#pool-title-${targetPoolName}`)

    const positionAfterDeposit = await poolPage.getPoolPosition()
    expect(positionAfterDeposit.assetA).toEqual('USDC')
    expect(positionAfterDeposit.assetB).toEqual('WETH')

    await poolPage.clickAddLiquidityButton()
    const usdcWalletBalanceAfter = await addLiquidityPage.getAssetABalance(true)
    const ethBentoBalanceAfter = await addLiquidityPage.getAssetBBalance(false)

    const usdcBalanceDiff = usdcWalletBalanceBefore - usdcWalletBalanceAfter
    const ethBalanceDiff = ethBentoBalanceBefore - ethBentoBalanceAfter
    // @ts-ignore TYPE NEEDS FIXING
    const slpAmountDiff = positionAfterDeposit.slpAmount - positionBeforeDeposit.slpAmount

    expect(closeValues(usdcBalanceDiff, usdcDepositAmount, 1e-9)).toBe(true)
    expect(closeValues(ethBalanceDiff, ethDepositAmount, 1e-9)).toBe(true)
    expect(closeValues(slpAmountDiff, minLiquidityOutput, 1e-9)).toBe(true)
  })

  test('Should deposit ETH from bento & USDC from bento in unequal amounts', async () => {
    const targetPoolName = 'USDC-WETH'
    // AssetA: USDC
    // AssetB: WETH

    await liquidityPoolsPage.navigateTo()
    await liquidityPoolsPage.connectMetamaskWallet()
    await liquidityPoolsPage.goToPool(targetPoolName)

    const positionBeforeDeposit = await poolPage.getPoolPosition()
    expect(positionBeforeDeposit.assetA).toEqual('USDC')
    expect(positionBeforeDeposit.assetB).toEqual('WETH')

    const poolLink = page.url()

    await poolPage.clickAddLiquidityButton()

    const usdcBentoBalanceBefore = await addLiquidityPage.getAssetABalance(false)
    const ethBentoBalanceBefore = await addLiquidityPage.getAssetBBalance(false)

    const usdcDepositAmount = round(usdcBentoBalanceBefore * depositPercentage)
    const ethDepositAmount = round(ethBentoBalanceBefore * depositPercentage)

    await addLiquidityPage.setFixedRatio(false)
    await addLiquidityPage.setAssetAFundFromWallet(false)
    await addLiquidityPage.setAssetBFundFromWallet(false)

    await addLiquidityPage.setAssetBDepositAmount(ethDepositAmount)
    await addLiquidityPage.setAssetADepositAmount(usdcDepositAmount)

    const minLiquidityOutput = await addLiquidityPage.getMinReceivedAmount()

    await addLiquidityPage.confirmDeposit()

    await page.goto(poolLink)
    await page.waitForSelector(`#pool-title-${targetPoolName}`)

    const positionAfterDeposit = await poolPage.getPoolPosition()
    expect(positionAfterDeposit.assetA).toEqual('USDC')
    expect(positionAfterDeposit.assetB).toEqual('WETH')

    await poolPage.clickAddLiquidityButton()
    const usdcBentoBalanceAfter = await addLiquidityPage.getAssetABalance(false)
    const ethBentoBalanceAfter = await addLiquidityPage.getAssetBBalance(false)

    const usdcBalanceDiff = usdcBentoBalanceBefore - usdcBentoBalanceAfter
    const ethBalanceDiff = ethBentoBalanceBefore - ethBentoBalanceAfter
    // @ts-ignore TYPE NEEDS FIXING
    const slpAmountDiff = positionAfterDeposit.slpAmount - positionBeforeDeposit.slpAmount

    expect(closeValues(usdcBalanceDiff, usdcDepositAmount, 1e-9)).toBe(true)
    expect(closeValues(ethBalanceDiff, ethDepositAmount, 1e-9)).toBe(true)
    expect(closeValues(slpAmountDiff, minLiquidityOutput, 1e-9)).toBe(true)
  })

  test('Should deposit ETH from bento & USDC from bento in equal amounts', async () => {
    const targetPoolName = 'USDC-WETH'

    await liquidityPoolsPage.navigateTo()
    await liquidityPoolsPage.connectMetamaskWallet()
    await liquidityPoolsPage.goToPool(targetPoolName)

    const positionBeforeDeposit = await poolPage.getPoolPosition()
    expect(positionBeforeDeposit.assetA).toEqual('USDC')
    expect(positionBeforeDeposit.assetB).toEqual('WETH')
    const poolLink = page.url()

    await poolPage.clickAddLiquidityButton()

    const assetABentoBalanceBefore = await addLiquidityPage.getAssetABalance(false)
    const assetBBentoBalanceBefore = await addLiquidityPage.getAssetBBalance(false)

    const assetADepositAmount = round(assetABentoBalanceBefore * depositPercentage)

    await addLiquidityPage.setFixedRatio(true)
    await addLiquidityPage.setAssetAFundFromWallet(false)
    await addLiquidityPage.setAssetBFundFromWallet(false)

    await addLiquidityPage.setAssetADepositAmount(assetADepositAmount)

    const assetBDepositAmount = await addLiquidityPage.getAssetBDepositAmount()

    const minLiquidityOutput = await addLiquidityPage.getMinReceivedAmount()

    await addLiquidityPage.confirmDeposit()

    await page.goto(poolLink)
    await page.waitForSelector(`#pool-title-${targetPoolName}`)

    const positionAfterDeposit = await poolPage.getPoolPosition()
    expect(positionAfterDeposit.assetA).toEqual('USDC')
    expect(positionAfterDeposit.assetB).toEqual('WETH')

    await poolPage.clickAddLiquidityButton()
    const assetABentoBalanceAfter = await addLiquidityPage.getAssetABalance(false)
    const assetBBentoBalanceAfter = await addLiquidityPage.getAssetBBalance(false)

    const assetABalanceDiff = assetABentoBalanceBefore - assetABentoBalanceAfter
    const assetBBalanceDiff = assetBBentoBalanceBefore - assetBBentoBalanceAfter
    // @ts-ignore TYPE NEEDS FIXING
    const slpAmountDiff = positionAfterDeposit.slpAmount - positionBeforeDeposit.slpAmount

    expect(closeValues(assetABalanceDiff, assetADepositAmount, 1e-9)).toBe(true)
    expect(closeValues(assetBBalanceDiff, assetBDepositAmount, 1e-9)).toBe(true)
    expect(closeValues(slpAmountDiff, minLiquidityOutput, 1e-9)).toBe(true)
  })

  test('Should deposit ETH from wallet & USDC from wallet in equal amounts', async () => {
    const targetPoolName = 'USDC-WETH'
    // AssetA: USDC
    // AssetB: WETH

    await liquidityPoolsPage.navigateTo()
    await liquidityPoolsPage.connectMetamaskWallet()
    await liquidityPoolsPage.goToPool(targetPoolName)

    const positionBeforeDeposit = await poolPage.getPoolPosition()
    expect(positionBeforeDeposit.assetA).toEqual('USDC')
    expect(positionBeforeDeposit.assetB).toEqual('WETH')

    const poolLink = page.url()

    await poolPage.clickAddLiquidityButton()

    const usdcWalletBalanceBefore = await addLiquidityPage.getAssetABalance(true)
    const ethWalletBalanceBefore = await addLiquidityPage.getAssetBBalance(true)

    const ethDepositAmount = round(ethWalletBalanceBefore * depositPercentage)

    await addLiquidityPage.setFixedRatio(true)
    await addLiquidityPage.setAssetAFundFromWallet(true)
    await addLiquidityPage.setAssetBFundFromWallet(true)

    await addLiquidityPage.setAssetBDepositAmount(ethDepositAmount)

    const usdcDepositAmount = await addLiquidityPage.getAssetADepositAmount()

    const minLiquidityOutput = await addLiquidityPage.getMinReceivedAmount()

    await addLiquidityPage.confirmDeposit()

    await page.goto(poolLink)
    await page.waitForSelector(`#pool-title-${targetPoolName}`)

    const positionAfterDeposit = await poolPage.getPoolPosition()
    expect(positionAfterDeposit.assetA).toEqual('USDC')
    expect(positionAfterDeposit.assetB).toEqual('WETH')

    await poolPage.clickAddLiquidityButton()
    const usdcWalletBalanceAfter = await addLiquidityPage.getAssetABalance(true)
    const ethWalletBalanceAfter = await addLiquidityPage.getAssetBBalance(true)

    const usdcBalanceDiff = usdcWalletBalanceBefore - usdcWalletBalanceAfter
    const ethBalanceDiff = ethWalletBalanceBefore - ethWalletBalanceAfter
    // @ts-ignore TYPE NEEDS FIXING
    const slpAmountDiff = positionAfterDeposit.slpAmount - positionBeforeDeposit.slpAmount

    expect(closeValues(usdcBalanceDiff, usdcDepositAmount, 1e-9)).toBe(true)
    expect(closeValues(ethBalanceDiff, ethDepositAmount, 1e-9)).toBe(true)
    expect(closeValues(slpAmountDiff, minLiquidityOutput, 1e-9)).toBe(true)
  })
})
