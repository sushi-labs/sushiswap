import { Dappeteer } from '@chainsafe/dappeteer'
import { closeValues, Fee } from '@sushiswap/trident-sdk'
import { Browser, Page } from 'puppeteer'

import { ADDRESSES, FUNDING_SOURCE, POOL_TYPE } from './constants/Index'
import { TestHelper } from './helpers/TestHelper'
import { CreatePoolPage } from './pages/pools/CreatePoolPage'
import { LiquidityPoolsPage } from './pages/pools/LiquidityPoolsPage'
import { SwapPage } from './pages/swap/SwapPage'

let browser: Browser
let page: Page
let metamask: Dappeteer

let swapPage: SwapPage
let liquidityPoolsPage: LiquidityPoolsPage
let createPoolPage: CreatePoolPage
let depositPercentage = 0.2
let swapPercentage = 0.01

require('dotenv').config()

let baseUrl: string = process.env.TEST_BASE_URL || 'http://localhost:3000'

const bentoSwapCases = [
  ['ETH', FUNDING_SOURCE.WALLET, 'USDC', FUNDING_SOURCE.BENTO],
  ['WETH', FUNDING_SOURCE.WALLET, 'USDC', FUNDING_SOURCE.BENTO],
  ['ETH', FUNDING_SOURCE.BENTO, 'USDC', FUNDING_SOURCE.WALLET],
  ['WETH', FUNDING_SOURCE.BENTO, 'ETH', FUNDING_SOURCE.WALLET],
  ['ETH', FUNDING_SOURCE.BENTO, 'USDC', FUNDING_SOURCE.BENTO],
  ['USDC', FUNDING_SOURCE.WALLET, 'WETH', FUNDING_SOURCE.BENTO],
  ['USDC', FUNDING_SOURCE.BENTO, 'WETH', FUNDING_SOURCE.BENTO],
  ['USDC', FUNDING_SOURCE.BENTO, 'ETH', FUNDING_SOURCE.WALLET],
  ['USDC', FUNDING_SOURCE.BENTO, 'WETH', FUNDING_SOURCE.WALLET],
]

jest.retryTimes(1)

describe('Trident Swap:', () => {
  beforeAll(async () => {
    ;[metamask, browser, page] = await TestHelper.initDappeteer()

    swapPage = new SwapPage(page, metamask, baseUrl)
    liquidityPoolsPage = new LiquidityPoolsPage(page, metamask, baseUrl)
    createPoolPage = new CreatePoolPage(page, metamask, baseUrl)

    await page.goto(baseUrl)
    await page.bringToFront()

    await swapPage.connectMetamaskWallet()
    await swapPage.addTokenToMetamask(ADDRESSES.USDT)
  })

  beforeEach(async () => {})

  afterAll(async () => {
    browser.close()
  })

  test.each([['ETH', FUNDING_SOURCE.WALLET, 'USDT', FUNDING_SOURCE.WALLET]])(
    `Complex Path: Should swap from %p %p to %p %p`,
    async (assetA, payFromA, assetB, payFromB) => {
      const payAFromWallet = payFromA === FUNDING_SOURCE.WALLET
      const payBFromWallet = payFromB === FUNDING_SOURCE.WALLET

      await swapPage.navigateTo()

      const assetABalance = await swapPage.getTokenBalance(assetA, payAFromWallet)
      const assetBBalance = await swapPage.getTokenBalance(assetB, payBFromWallet)
      const assetADepositAmount = (assetABalance * depositPercentage).toFixed(5)
      const assetBDepositAmount = (assetBBalance * depositPercentage).toFixed(5)

      await liquidityPoolsPage.navigateTo()
      await liquidityPoolsPage.clickCreateNewPoolButton()
      await createPoolPage.createPool(
        POOL_TYPE.CLASSIC,
        assetA,
        assetB,
        payAFromWallet,
        payBFromWallet,
        assetADepositAmount,
        assetBDepositAmount,
        Fee.LOW
      )

      await liquidityPoolsPage.navigateTo()
      await liquidityPoolsPage.clickCreateNewPoolButton()
      await createPoolPage.createPool(
        POOL_TYPE.CLASSIC,
        assetA,
        assetB,
        payAFromWallet,
        payBFromWallet,
        assetADepositAmount,
        assetBDepositAmount,
        Fee.MEDIUM
      )

      await swapPage.navigateTo()

      const inputTokenBalanceBefore = await swapPage.getTokenBalance(assetA, payAFromWallet)
      const outputTokenBalanceBefore = await swapPage.getTokenBalance(assetB, payBFromWallet)
      if (!(inputTokenBalanceBefore > 0)) throw new Error(`${assetA} wallet balance is 0. Can't execute swap`)

      const swapAmount = (inputTokenBalanceBefore * swapPercentage).toFixed(5)

      await swapPage.setInputToken(assetA)
      await swapPage.setOutputToken(assetB)
      await swapPage.setAmountIn(swapAmount)
      await swapPage.setPayFromWallet(payAFromWallet)
      await swapPage.setReceiveToWallet(payBFromWallet)

      const tradeType = await swapPage.getTradeType()
      expect(tradeType).toBe('trident')

      const minOutputAmount = await swapPage.getMinOutputAmount()

      await swapPage.confirmSwap(assetA, assetB)
      await swapPage.navigateTo()

      const inputTokenBalanceAfter = await swapPage.getTokenBalance(assetA, payAFromWallet)
      const outputTokenBalanceAfter = await swapPage.getTokenBalance(assetB, payBFromWallet)

      const intputTokenBalanceDiff = inputTokenBalanceBefore - inputTokenBalanceAfter
      const outputTokenBalanceDiff = outputTokenBalanceAfter - outputTokenBalanceBefore

      expect(closeValues(intputTokenBalanceDiff, parseFloat(swapAmount), 1e-9)).toBe(true)
      expect(closeValues(outputTokenBalanceDiff, parseFloat(minOutputAmount), 1e-9)).toBe(true)
    }
  )

  test.each([
    ['ETH', FUNDING_SOURCE.WALLET, 'BAT', FUNDING_SOURCE.WALLET, swapPercentage],
    ['ETH', FUNDING_SOURCE.WALLET, 'BAT', FUNDING_SOURCE.WALLET, 0.8],
  ])(`Single Pool: Should swap from %p %p to %p %p`, async (assetA, payFromA, assetB, payFromB, swapPercent) => {
    const payAFromWallet = payFromA === FUNDING_SOURCE.WALLET
    const payBFromWallet = payFromB === FUNDING_SOURCE.WALLET

    await swapPage.navigateTo()

    const assetABalance = await swapPage.getTokenBalance(assetA, payAFromWallet)
    const assetBBalance = await swapPage.getTokenBalance(assetB, payBFromWallet)
    const assetADepositAmount = (assetABalance * depositPercentage).toFixed(5)
    const assetBDepositAmount = (assetBBalance * 0.7).toFixed(5)

    await liquidityPoolsPage.navigateTo()
    await liquidityPoolsPage.clickCreateNewPoolButton()
    await createPoolPage.createPool(
      POOL_TYPE.CLASSIC,
      assetA,
      assetB,
      payAFromWallet,
      payBFromWallet,
      assetADepositAmount,
      assetBDepositAmount,
      Fee.LOW
    )

    await swapPage.navigateTo()

    const inputTokenBalanceBefore = await swapPage.getTokenBalance(assetA, payAFromWallet)
    const outputTokenBalanceBefore = await swapPage.getTokenBalance(assetB, payBFromWallet)
    if (!(inputTokenBalanceBefore > 0)) throw new Error(`${assetA} wallet balance is 0. Can't execute swap`)

    const swapAmount = (inputTokenBalanceBefore * swapPercent).toFixed(5)

    await swapPage.setInputToken(assetA)
    await swapPage.setOutputToken(assetB)
    await swapPage.setAmountIn(swapAmount)
    await swapPage.setPayFromWallet(payAFromWallet)
    await swapPage.setReceiveToWallet(payBFromWallet)

    const tradeType = await swapPage.getTradeType()
    expect(tradeType).toBe('trident')

    const minOutputAmount = await swapPage.getMinOutputAmount()

    await swapPage.confirmSwap(assetA, assetB)
    await swapPage.navigateTo()

    const inputTokenBalanceAfter = await swapPage.getTokenBalance(assetA, payAFromWallet)
    const outputTokenBalanceAfter = await swapPage.getTokenBalance(assetB, payBFromWallet)

    const intputTokenBalanceDiff = inputTokenBalanceBefore - inputTokenBalanceAfter
    const outputTokenBalanceDiff = outputTokenBalanceAfter - outputTokenBalanceBefore

    expect(closeValues(intputTokenBalanceDiff, parseFloat(swapAmount), 1e-9)).toBe(true)
    expect(closeValues(outputTokenBalanceDiff, parseFloat(minOutputAmount), 1e-9)).toBe(true)
  })

  test.each([['BAT', FUNDING_SOURCE.WALLET, 'USDT', FUNDING_SOURCE.WALLET, swapPercentage]])(
    `Single Path: Should swap from %p %p to %p %p`,
    async (assetA, payFromA, assetB, payFromB, swapPercent) => {
      const payAFromWallet = payFromA === FUNDING_SOURCE.WALLET
      const payBFromWallet = payFromB === FUNDING_SOURCE.WALLET

      await swapPage.navigateTo()
      const inputTokenBalanceBefore = await swapPage.getTokenBalance(assetA, payAFromWallet)
      const outputTokenBalanceBefore = await swapPage.getTokenBalance(assetB, payBFromWallet)
      if (!(inputTokenBalanceBefore > 0)) throw new Error(`${assetA} wallet balance is 0. Can't execute swap`)

      const swapAmount = (inputTokenBalanceBefore * swapPercent).toFixed(5)

      await swapPage.setInputToken(assetA)
      await swapPage.setOutputToken(assetB)
      await swapPage.setAmountIn(swapAmount)
      await swapPage.setPayFromWallet(payAFromWallet)
      await swapPage.setReceiveToWallet(payBFromWallet)

      const tradeType = await swapPage.getTradeType()
      expect(tradeType).toBe('trident')

      const minOutputAmount = await swapPage.getMinOutputAmount()

      await swapPage.confirmSwap(assetA, assetB)
      await swapPage.navigateTo()

      const inputTokenBalanceAfter = await swapPage.getTokenBalance(assetA, payAFromWallet)
      const outputTokenBalanceAfter = await swapPage.getTokenBalance(assetB, payBFromWallet)

      const intputTokenBalanceDiff = inputTokenBalanceBefore - inputTokenBalanceAfter
      const outputTokenBalanceDiff = outputTokenBalanceAfter - outputTokenBalanceBefore

      expect(closeValues(intputTokenBalanceDiff, parseFloat(swapAmount), 1e-9)).toBe(true)
      expect(closeValues(outputTokenBalanceDiff, parseFloat(minOutputAmount), 1e-9)).toBe(true)
    }
  )
})
