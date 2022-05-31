import { Dappeteer } from '@chainsafe/dappeteer'
import { closeValues } from '@sushiswap/trident-sdk'
import { Browser, Page } from 'puppeteer'

import { ADDRESSES, FUNDING_SOURCE } from './constants/Index'
import { ApprovalHelper } from './helpers/ApprovalHelper'
import { TestHelper } from './helpers/TestHelper'
import { SwapPage } from './pages/swap/SwapPage'

let browser: Browser
let page: Page
let metamask: Dappeteer

let swapPage: SwapPage

require('dotenv').config()

let baseUrl: string = process.env.TEST_BASE_URL || 'http://localhost:3000'
let account2PubKey: string = process.env.TEST_ACCOUNT2_PUB_KEY || ''
let approvalHelper: ApprovalHelper
let depositPercentage = 0.01

const cases = [
  ['ETH', FUNDING_SOURCE.WALLET, 'USDC', FUNDING_SOURCE.WALLET],
  ['WETH', FUNDING_SOURCE.WALLET, 'USDC', FUNDING_SOURCE.WALLET],
  ['USDC', FUNDING_SOURCE.WALLET, 'ETH', FUNDING_SOURCE.WALLET],
  ['USDC', FUNDING_SOURCE.WALLET, 'WETH', FUNDING_SOURCE.WALLET],
  ['ETH', FUNDING_SOURCE.WALLET, 'WETH', FUNDING_SOURCE.WALLET],
  ['WETH', FUNDING_SOURCE.WALLET, 'ETH', FUNDING_SOURCE.WALLET],
]

const currencySelectCases = [
  ['ETH', 'DAI'],
  ['WETH', 'USDC'],
  ['BAT', 'SUSHI'],
]

jest.retryTimes(1)

describe('Swap:', () => {
  beforeAll(async () => {
    ;[metamask, browser, page] = await TestHelper.initDappeteer()
    swapPage = new SwapPage(page, metamask, baseUrl)
    approvalHelper = new ApprovalHelper()

    await page.goto(baseUrl)
    await page.bringToFront()

    await swapPage.connectMetamaskWallet()
    await swapPage.addTokenToMetamask(ADDRESSES.WETH)
    await swapPage.addTokenToMetamask(ADDRESSES.USDC)
    await swapPage.addTokenToMetamask(ADDRESSES.BAT)
  })

  beforeEach(async () => {
    await swapPage.navigateTo()
    await swapPage.blockingWait(2, true)
  })

  afterAll(async () => {
    browser.close()
  })

  test.each(cases)(`Should swap from %p %p to %p %p`, async (inToken, payFrom, outToken, receiveTo) => {
    const payFromWallet = payFrom === FUNDING_SOURCE.WALLET ? true : false
    const receiveToWallet = receiveTo === FUNDING_SOURCE.WALLET ? true : false
    const inputTokenBalanceBefore = await swapPage.getTokenBalance(inToken, payFromWallet)
    const outputTokenBalanceBefore = await swapPage.getTokenBalance(outToken, receiveToWallet)

    if (!(inputTokenBalanceBefore > 0)) throw new Error(`${inToken} wallet balance is 0. Can't execute swap`)

    const swapAmount = (inputTokenBalanceBefore * depositPercentage).toFixed(5)

    await swapPage.setInputToken(inToken)
    await swapPage.setOutputToken(outToken)
    await swapPage.setAmountIn(swapAmount)
    await swapPage.setPayFromWallet(payFromWallet)
    await swapPage.setReceiveToWallet(receiveToWallet)

    const minOutputAmount = await swapPage.getMinOutputAmount()
    await swapPage.confirmSwap(inToken, outToken)

    await swapPage.navigateTo()

    const inputTokenBalanceAfter = await swapPage.getTokenBalance(inToken, payFromWallet)
    const outputTokenBalanceAfter = await swapPage.getTokenBalance(outToken, receiveToWallet)

    const intputTokenBalanceDiff = inputTokenBalanceBefore - inputTokenBalanceAfter
    const outputTokenBalanceDiff = outputTokenBalanceAfter - outputTokenBalanceBefore

    expect(closeValues(intputTokenBalanceDiff, parseFloat(swapAmount), 1e-9)).toBe(true)
    expect(closeValues(outputTokenBalanceDiff, parseFloat(minOutputAmount), 1e-9)).toBe(true)
  })

  test('Should click max button for wallet', async () => {
    await swapPage.setInputToken('USDC')

    const inputTokenBalance = await swapPage.getInputTokenBalance()

    await page.evaluate(() => {
      // @ts-ignore
      document.querySelector('#text-balance-USDC').click()
    })

    const inputTokenAmount = await swapPage.getInputTokenAmount()

    expect(closeValues(parseFloat(inputTokenBalance), parseFloat(inputTokenAmount), 1e-3)).toBe(true)
  })

  test('Should click max button for bento', async () => {
    await swapPage.setPayFromWallet(false)

    await swapPage.setInputToken('USDC')

    const inputTokenBalance = await swapPage.getInputTokenBalance()

    await page.evaluate(() => {
      // @ts-ignore
      document.querySelector('#text-balance-USDC').click()
    })

    const inputTokenAmount = await swapPage.getInputTokenAmount()

    expect(closeValues(parseFloat(inputTokenBalance), parseFloat(inputTokenAmount), 1e-3)).toBe(true)
  })

  test('Should switch currencies', async () => {
    await swapPage.setInputToken('USDC')
    await swapPage.setOutputToken('WETH')

    const selectedInputTokenBefore = await swapPage.getSelectedInputToken()
    const selectedOutputTokenBefore = await swapPage.getSelectedOutputToken()

    expect(selectedInputTokenBefore).toBe('USDC')
    expect(selectedOutputTokenBefore).toBe('WETH')

    await swapPage.clickSwitchCurrenciesButton()

    const selectedInputTokenAfter = await swapPage.getSelectedInputToken()
    const selectedOutputTokenAfter = await swapPage.getSelectedOutputToken()

    expect(selectedInputTokenAfter).toBe('WETH')
    expect(selectedOutputTokenAfter).toBe('USDC')
  })

  test.each(currencySelectCases)(`Should select %p as input and %p as output`, async (inToken, outToken) => {
    await swapPage.setInputToken(inToken)
    await swapPage.setOutputToken(outToken)

    const selectedInputTokenBefore = await swapPage.getSelectedInputToken()
    const selectedOutputTokenBefore = await swapPage.getSelectedOutputToken()

    expect(selectedInputTokenBefore).toBe(inToken)
    expect(selectedOutputTokenBefore).toBe(outToken)
  })

  test('Should invert rate', async () => {
    const inputAmount = 500

    await swapPage.setInputToken('ETH')
    await swapPage.setOutputToken('USDC')

    await swapPage.setAmountIn(inputAmount.toString())

    const outputAmount = await swapPage.getMinOutputAmount()

    const usdcWethRateDisplayed = await swapPage.getExchangeRate()
    const usdcWethRateExpected = parseFloat(outputAmount) / inputAmount
    const usdcWethRate = usdcWethRateDisplayed.split('=')[1].trim().split(' ')[0]

    expect(closeValues(usdcWethRateExpected, parseFloat(usdcWethRate), 1e-3)).toBe(true)

    await swapPage.clickInvertRateButton()
    const wethUsdcRateDispayed = await swapPage.getExchangeRate()
    const wethUsdcRateExpected = inputAmount / parseFloat(outputAmount)
    const wethUsdcRate = wethUsdcRateDispayed.split('=')[1].trim().split(' ')[0]

    expect(closeValues(wethUsdcRateExpected, parseFloat(wethUsdcRate), 1e-3)).toBe(true)
  })

  test('Should change slippage', async () => {
    await swapPage.setSlippage('25.00')

    const slippage = await swapPage.getSlippage()

    expect(slippage).toBe('25.00')
  })

  test.skip('Should swap ETH from wallet to USDC bento with other recipient', async () => {
    const inToken = 'ETH'
    const outToken = 'USDC'

    let recipientBrowser: Browser
    let recipientPage: Page
    let recipientMetamask: Dappeteer
    ;[recipientMetamask, recipientBrowser, recipientPage] = await TestHelper.initDappeteer(
      process.env.TEST_SEED2,
      process.env.TEST_PASS
    )

    try {
      const recipientSwapPage = new SwapPage(recipientPage, recipientMetamask, baseUrl)
      await recipientPage.goto(baseUrl)
      await recipientPage.bringToFront()
      await recipientSwapPage.connectMetamaskWallet()

      await recipientSwapPage.navigateTo()
      const account2BentoBalanceBefore = await recipientSwapPage.getBentoBalance(outToken)

      const tokenWalletBalance = await swapPage.getMetamaskTokenBalance(inToken)
      if (!(tokenWalletBalance > 0))
        throw new Error(`${inToken} wallet balance is 0 or could not be read from Metamask`)

      const swapAmount = (tokenWalletBalance * 0.01).toFixed(5)

      await swapPage.navigateTo()
      await swapPage.toggleExpertMode()
      await swapPage.setRecipient(account2PubKey)
      await swapPage.setInputToken(inToken)
      await swapPage.setOutputToken(outToken)
      await swapPage.setAmountIn(swapAmount)
      await swapPage.setPayFromWallet(true)
      await swapPage.setReceiveToWallet(false)

      const expectedOutputAmount = await swapPage.getMinOutputAmount()
      await swapPage.confirmSwap(inToken, outToken)

      const account2BentoBalanceAfter = await recipientSwapPage.getBentoBalance(outToken)
      expect(account2BentoBalanceAfter !== account2BentoBalanceBefore).toBe(true)

      const account2BalanceDifference = parseFloat(account2BentoBalanceAfter) - parseFloat(account2BentoBalanceBefore)
      expect(closeValues(parseFloat(expectedOutputAmount), account2BalanceDifference, 1e-3)).toBe(true)
    } catch (error) {
      throw error
    } finally {
      await recipientBrowser.close()
    }
  })

  test.skip.each([
    ['USDC', FUNDING_SOURCE.WALLET, 'ETH', FUNDING_SOURCE.BENTO],
    ['USDC', FUNDING_SOURCE.BENTO, 'ETH', FUNDING_SOURCE.BENTO],
  ])(`Should add WETH to Bento when swapping from %p %p to %p %p`, async (inToken, payFrom, outToken, receiveTo) => {
    const tokenWalletBalance = await swapPage.getMetamaskTokenBalance(inToken)
    if (!(tokenWalletBalance > 0)) throw new Error(`${inToken} wallet balance is 0 or could not be read from Metamask`)

    await swapPage.navigateTo()

    const swapAmount = (tokenWalletBalance * 0.01).toFixed(5)
    const payFromWallet = payFrom === FUNDING_SOURCE.WALLET ? true : false
    const receiveToWallet = receiveTo === FUNDING_SOURCE.WALLET ? true : false

    const wethBentoBalanceBefore = await swapPage.getBentoBalance('WETH')

    await swapPage.setInputToken(inToken)
    await swapPage.setOutputToken(outToken)
    await swapPage.setAmountIn(swapAmount)
    await swapPage.setPayFromWallet(payFromWallet)
    await swapPage.setReceiveToWallet(receiveToWallet)

    const expectedOutputAmount = await swapPage.getMinOutputAmount()
    await swapPage.confirmSwap(inToken, outToken)

    await swapPage.navigateTo()
    const wethBentoBalanceAfter = await swapPage.getBentoBalance('WETH')
    expect(wethBentoBalanceAfter !== wethBentoBalanceBefore).toBe(true)

    const wethBalanceDiff = parseFloat(wethBentoBalanceAfter) - parseFloat(wethBentoBalanceBefore)
    expect(closeValues(parseFloat(expectedOutputAmount), wethBalanceDiff, 1e-3)).toBe(true)
  })

  test('Should swap ETH from wallet to USDC wallet with other recipient', async () => {
    const inToken = 'ETH'
    const outToken = 'USDC'

    let recipientBrowser: Browser
    let recipientPage: Page
    let recipientMetamask: Dappeteer
    ;[recipientMetamask, recipientBrowser, recipientPage] = await TestHelper.initDappeteer(
      process.env.TEST_SEED2,
      process.env.TEST_PASS
    )

    try {
      const recipientSwapPage = new SwapPage(recipientPage, recipientMetamask, baseUrl)
      await recipientPage.goto(baseUrl)
      await recipientPage.bringToFront()
      await recipientSwapPage.connectMetamaskWallet()

      await recipientSwapPage.navigateTo()
      const account2BentoBalanceBefore = await recipientSwapPage.getWalletBalance(outToken)

      const tokenWalletBalance = await swapPage.getMetamaskTokenBalance(inToken)
      if (!(tokenWalletBalance > 0))
        throw new Error(`${inToken} wallet balance is 0 or could not be read from Metamask`)

      const swapAmount = (tokenWalletBalance * 0.01).toFixed(5)

      await swapPage.toggleExpertMode()
      await swapPage.setRecipient(account2PubKey)
      await swapPage.setInputToken(inToken)
      await swapPage.setOutputToken(outToken)
      await swapPage.setAmountIn(swapAmount)
      await swapPage.setPayFromWallet(true)
      await swapPage.setReceiveToWallet(true)

      const expectedOutputAmount = await swapPage.getMinOutputAmount()
      await swapPage.confirmSwap(inToken, outToken)

      const account2BentoBalanceAfter = await recipientSwapPage.getWalletBalance(outToken)
      expect(account2BentoBalanceAfter !== account2BentoBalanceBefore).toBe(true)

      const account2BalanceDifference = parseFloat(account2BentoBalanceAfter) - parseFloat(account2BentoBalanceBefore)

      expect(closeValues(parseFloat(expectedOutputAmount), account2BalanceDifference, 1e-3)).toBe(true)
    } catch (error) {
      throw error
    } finally {
      await recipientBrowser.close()
    }
  })

  test('Should reset recipient address when expert mode is disabled', async () => {
    await swapPage.toggleExpertMode() // enable expert mode
    await swapPage.setRecipient('potato')

    const recipientAddressBefore = await swapPage.getRecipient()
    expect(recipientAddressBefore).toBe('potato')
    await swapPage.toggleExpertMode() // disable expert mode

    await page.click('body') // click to dismiss tx settings modal

    await swapPage.toggleExpertMode() // enable expert mode
    const recipientAddressAfter = await swapPage.getRecipient()
    expect(recipientAddressAfter).toBe('')
  })

  test('Should require approval of token when swapping from wallet', async () => {
    await approvalHelper.approveRouter(ADDRESSES.BAT, 0)

    const inToken = 'BAT'
    const outToken = 'ETH'

    const tokenWalletBalance = await swapPage.getMetamaskTokenBalance(inToken)
    if (!(tokenWalletBalance > 0)) throw new Error(`${inToken} wallet balance is 0 or could not be read from Metamask`)

    const swapAmount = (tokenWalletBalance * 0.01).toFixed(5)

    await swapPage.setInputToken(inToken)
    await swapPage.setOutputToken(outToken)
    await swapPage.setAmountIn(swapAmount)
    await swapPage.setPayFromWallet(true)
    await swapPage.setReceiveToWallet(true)

    const requiresApprovalBefore = await swapPage.requiresApproval()
    expect(requiresApprovalBefore).toBe(true)

    await swapPage.approveToken()
    await swapPage.confirmSwap(inToken, outToken)

    await swapPage.navigateTo()
    await swapPage.setInputToken(inToken)
    await swapPage.setOutputToken(outToken)
    await swapPage.setAmountIn(swapAmount)
    await swapPage.setPayFromWallet(true)
    await swapPage.setReceiveToWallet(true)

    const requiresApprovalAfter = await swapPage.requiresApproval()
    expect(requiresApprovalAfter).toBe(false)
  })

  test('Should require approval once when swapping from BentoBox', async () => {
    await approvalHelper.approveRouter(ADDRESSES.USDC, 0)

    const inToken = 'USDC'
    const outToken = 'ETH'

    const tokenWalletBalance = await swapPage.getMetamaskTokenBalance(inToken)
    if (!(tokenWalletBalance > 0)) throw new Error(`${inToken} wallet balance is 0 or could not be read from Metamask`)

    const swapAmount = (tokenWalletBalance * 0.01).toFixed(5)

    await swapPage.setInputToken(inToken)
    await swapPage.setOutputToken(outToken)
    await swapPage.setAmountIn(swapAmount)
    await swapPage.setPayFromWallet(false)
    await swapPage.setReceiveToWallet(true)

    const requiresApprovalBefore = await swapPage.requiresApproval()
    expect(requiresApprovalBefore).toBe(true)

    await swapPage.approveToken()
    await swapPage.confirmSwap(inToken, outToken)

    await swapPage.navigateTo()
    await swapPage.setInputToken(inToken)
    await swapPage.setOutputToken(outToken)
    await swapPage.setAmountIn(swapAmount)
    await swapPage.setPayFromWallet(true)
    await swapPage.setReceiveToWallet(true)

    const requiresApprovalAfter = await swapPage.requiresApproval()
    expect(requiresApprovalAfter).toBe(false)

    await approvalHelper.approveRouter(ADDRESSES.USDC, 2 ^ (256 - 1))
  })

  test.each([['ETH', FUNDING_SOURCE.WALLET, 'USDC', FUNDING_SOURCE.WALLET]])(
    `Should display insufficient balance when not enough %p in %p`,
    async (inToken, payFrom, outToken, receiveTo) => {
      const tokenWalletBalance = await swapPage.getMetamaskTokenBalance(inToken)
      if (!(tokenWalletBalance > 0))
        throw new Error(`${inToken} wallet balance is 0 or could not be read from Metamask`)

      const swapAmount = (tokenWalletBalance * 100).toFixed(5)
      const payFromWallet = payFrom === FUNDING_SOURCE.WALLET ? true : false
      const receiveToWallet = receiveTo === FUNDING_SOURCE.WALLET ? true : false

      await swapPage.setInputToken(inToken)
      await swapPage.setOutputToken(outToken)
      await swapPage.setAmountIn(swapAmount)
      await swapPage.setPayFromWallet(payFromWallet)
      await swapPage.setReceiveToWallet(receiveToWallet)

      const swapButtonText = await swapPage.getSwapButtonText()

      expect(swapButtonText).toBe(`Insufficient Balance`)
    }
  )
})
