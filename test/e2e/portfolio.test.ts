import { Dappeteer } from '@chainsafe/dappeteer'
import { closeValues } from '@sushiswap/trident-sdk'
import { Browser, Page } from 'puppeteer'

import { ADDRESSES } from './constants/Index'
import { BentoHelper } from './helpers/BentoHelper'
import { TestHelper } from './helpers/TestHelper'
import { MyBentoBoxPage } from './pages/balances/MyBentoBoxPage'
import { MyWalletPage } from './pages/balances/MyWalletPage'

let browser: Browser
let page: Page
let metamask: Dappeteer

let myWalletPage: MyWalletPage
let myBentoBoxPage: MyBentoBoxPage
let bentoHelper: BentoHelper

require('dotenv').config()

let baseUrl: string = process.env.TEST_BASE_URL || 'http://localhost:3000'

jest.retryTimes(1)

describe('Balances:', () => {
  beforeAll(async () => {
    ;[metamask, browser, page] = await TestHelper.initDappeteer()
    myWalletPage = new MyWalletPage(page, metamask, baseUrl)
    myBentoBoxPage = new MyBentoBoxPage(page, metamask, baseUrl)
    bentoHelper = new BentoHelper()

    await myWalletPage.addTokenToMetamask(ADDRESSES.WETH)
    await myWalletPage.addTokenToMetamask(ADDRESSES.USDC)
    await myWalletPage.addTokenToMetamask(ADDRESSES.BAT)
    await myWalletPage.addTokenToMetamask(ADDRESSES.USDT)
    await myWalletPage.addTokenToMetamask(ADDRESSES.DAI)
    await myWalletPage.addTokenToMetamask(ADDRESSES.COMP)

    await page.goto(baseUrl)
    await page.bringToFront()

    await myWalletPage.connectMetamaskWallet()
  })

  beforeEach(async () => {})

  afterAll(async () => {
    browser.close()
  })

  test('Should get correct wallet balances', async () => {
    await myWalletPage.navigateTo()
    const appBalances = await myWalletPage.getWalletBalances()

    for (let balance in appBalances) {
      const tokenSymbol = balance.toUpperCase()
      const appBalance = appBalances[balance]
      const mmBalance = await myWalletPage.getMetamaskTokenBalance(tokenSymbol)

      expect(closeValues(appBalance, mmBalance, 1e-5)).toBe(true)
    }
  })

  test('Should get correct BentoBox balances', async () => {
    await myBentoBoxPage.navigateTo()
    const appBalances = await myBentoBoxPage.getBentoBalances()

    for (let balance in appBalances) {
      const tokenSymbol = balance.toUpperCase()
      const appBalance = appBalances[balance]
      const bentoBalance = await bentoHelper.getBentoBalance(tokenSymbol)

      expect(closeValues(appBalance, bentoBalance, 1e-5)).toBe(true)
    }
  })
})
