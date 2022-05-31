import { Dappeteer, launch, LaunchOptions, setupMetamask } from '@chainsafe/dappeteer'
import puppeteer, { Browser, Page } from 'puppeteer'

import { App } from '../pages/App'

export class TestHelper {
  public static async init(): Promise<App> {
    const [metamask, browser, page] = await this.initDappeteer()
    const app = new App(page, metamask, process.env.TEST_BASE_URL || 'http://localhost:3000')
    return app
  }

  public static async initDappeteer(
    seedPhrase: string = '',
    password: string = ''
  ): Promise<[Dappeteer, Browser, Page]> {
    let seed: string
    let pass: string

    if (seedPhrase !== '' && password !== '') {
      seed = seedPhrase
      pass = password
    } else {
      seed = process.env.TEST_SEED || 'seed seed seed'
      pass = process.env.TEST_PASS || 'password'
    }

    const browser = await this.getBrowser()
    const metamask = await this.getMetamask(browser, seed, pass)
    const page = await this.getPage(browser)

    return [metamask, browser, page]
  }

  private static async getMetamask(browser: Browser, seed: string, pass: string): Promise<Dappeteer> {
    let metamask: Dappeteer

    try {
      metamask = await setupMetamask(browser, { seed: seed, password: pass })
      await metamask.switchNetwork('kovan')

      if (process.env.CI === 'true') {
        await metamask.page.setDefaultTimeout(60000)
      } else {
        await metamask.page.setDefaultTimeout(20000)
      }
    } catch (error) {
      console.log('Error occurred setting up metamask')
      throw error
    }

    return metamask
  }

  private static async getBrowser(): Promise<Browser> {
    let browser: Browser
    let options: LaunchOptions = {
      metamaskVersion: 'v10.1.1',
      headless: false,
      defaultViewport: null,
      args: ['--no-sandbox'],
    }

    if (process.env.CI === 'true') {
      options.slowMo = 3
      options.executablePath = process.env.TEST_PUPPETEER_EXEC_PATH
    }

    try {
      browser = await launch(puppeteer, options)
    } catch (error) {
      console.log('Error occurred launching Puppeteer')
      throw error
    }

    return browser
  }

  private static async getPage(browser: Browser): Promise<Page> {
    let page: Page

    try {
      page = await browser.newPage()

      await page.setDefaultTimeout(180000)

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36'
      )
    } catch (error) {
      console.log('Error occurred creating new page')
      throw error
    }

    return page
  }
}
