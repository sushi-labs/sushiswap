import { Dappeteer } from '@chainsafe/dappeteer'
import { ElementHandle, Page } from 'puppeteer'

export abstract class AppPage {
  public Metamask: Dappeteer

  protected BaseUrl: string
  protected Page: Page
  protected Route: string = ''

  protected WalletConnectSelector: string = '#connect-wallet'
  protected WalletOptionMetamaskSelector: string = '#wallet-option-MetaMask'

  private ci: string = process.env.CI || 'false'

  constructor(page: Page, metamask: Dappeteer, baseUrl: string = '') {
    this.Page = page
    this.BaseUrl = baseUrl
    this.Metamask = metamask
  }

  public async navigateTo(): Promise<Page> {
    await this.bringToFront()
    if (this.BaseUrl && this.Route) {
      await this.Page.goto(this.BaseUrl + this.Route)
    } else {
      console.warn('Page has no URL and cannot be navigated to')
    }
    return this.Page
  }

  public async bringToFront(): Promise<Page> {
    await this.Page.bringToFront()
    return this.Page
  }

  public async evaluateAndClick(btnSelector: string): Promise<void> {
    await this.Page.evaluate((selector) => {
      return document.querySelector(selector).click()
    }, btnSelector)
  }

  public async connectMetamaskWallet(): Promise<void> {
    await await this.blockingWait(1, true)

    const web3Connected = await this.Page.$('#web3-status-connected')
    if (web3Connected) return

    const btnConnectWallet = await this.Page.waitForSelector(this.WalletConnectSelector)
    // @ts-ignore TYPE NEEDS FIXING
    await btnConnectWallet.click()

    const metamaskButton = await this.Page.waitForSelector(this.WalletOptionMetamaskSelector)
    // @ts-ignore TYPE NEEDS FIXING
    await metamaskButton.click()
    await this.Metamask.approve()
    await this.bringToFront()
  }

  public async addTokenToMetamask(tokenAddress: string): Promise<void> {
    await await this.blockingWait(2)
    await this.Metamask.page.bringToFront()

    await this.closeMetamaskWhatsNew()

    const addTokenButton = await this.Metamask.page.waitForSelector('.add-token-button > button')
    // @ts-ignore TYPE NEEDS FIXING
    await addTokenButton.click()

    const addressInput = await this.Metamask.page.waitForSelector('#custom-address')
    // @ts-ignore TYPE NEEDS FIXING
    addressInput.type(tokenAddress)

    await this.Metamask.page.waitForTimeout(4000)

    this.Metamask.page.waitForSelector(`button[data-testid='page-container-footer-next']:not([disabled])`)
    const nextButton = await this.Metamask.page.waitForSelector(`button[data-testid='page-container-footer-next']`)
    // @ts-ignore TYPE NEEDS FIXING
    await nextButton.click()

    const buttons = await this.Metamask.page.$$('footer > button')
    await buttons[1].click()

    await this.Metamask.page.reload()
  }

  public async getMetamaskTokenBalance(tokenSymbol: string): Promise<number> {
    await this.Metamask.page.bringToFront()
    await this.blockingWait(1, true)

    await this.closeMetamaskWhatsNew()

    const assetMenutButton = await this.Metamask.page.waitForSelector(`li[data-testid="home__asset-tab"]`)
    // @ts-ignore TYPE NEEDS FIXING
    await assetMenutButton.click()
    await this.blockingWait(1, true)

    const assetListItems = await this.Metamask.page.$$('.asset-list-item__token-button')

    for (let index = 0; index < assetListItems.length; index++) {
      const assetListItem = assetListItems[index]

      const titleAttributeValue: string = await this.Metamask.page.evaluate(
        (item) => item.getAttribute('title'),
        assetListItem
      )

      if (titleAttributeValue.split(' ')[1].toUpperCase() === tokenSymbol.toUpperCase()) {
        const balance = titleAttributeValue.split(' ')[0]
        this.Page.bringToFront()
        return parseFloat(balance)
      }
    }

    return 0
  }

  public async closeMetamaskWhatsNew(): Promise<void> {
    await this.blockingWait(1, true)
    const closeWhatsNewButton = await this.Metamask.page.$(
      '#popover-content > div > div > section > header > div > button'
    )
    if (closeWhatsNewButton) {
      await closeWhatsNewButton.click()
    }
  }

  public async confirmMetamaskTransaction(): Promise<void> {
    await this.blockingWait(4)

    try {
      await this.Metamask.confirmTransaction()

      // Try to confirm transaction again
      await this.Metamask.confirmTransaction()
      await this.blockingWait(3)

      //Check if we're still at confirm transaction page. When gas estimation takes longer initial confirm does not work
      const mmFooterButtons = await this.Metamask.page.$$('footer > button')
      if (mmFooterButtons && mmFooterButtons[1]) {
        const confirmButton = mmFooterButtons[1]
        await confirmButton.click()
      }
    } catch (error) {}

    await this.blockingWait(1)
    await this.Page.bringToFront()
    await this.blockingWait(1, true)
  }

  // @ts-ignore TYPE NEEDS FIXING
  public async blockingWait(seconds, checkCi: boolean = false): Promise<void> {
    let waitSeconds = seconds

    if (checkCi && this.ci === 'true') {
      waitSeconds = seconds * 2
    }

    var waitTill = new Date(new Date().getTime() + waitSeconds * 1000)
    while (waitTill > new Date()) {}
  }

  protected async getSwitchElement(switchId: string): Promise<ElementHandle<Element>> {
    await this.Page.waitForSelector(switchId)
    const switchElement = await this.Page.$(switchId)

    // @ts-ignore TYPE NEEDS FIXING
    const buttonElement = (await switchElement.$x('..'))[0]
    if (!buttonElement) {
      throw new Error(`Switch with id ${switchId} not found on the page. Check selector is valid.`)
    }

    return buttonElement
  }

  protected async isSwitchChecked(switchId: string): Promise<boolean> {
    let checked: boolean

    const checkedValue = await this.Page.$eval(switchId, (button) => button.getAttribute('aria-checked'))
    checked = checkedValue === 'true'

    return checked
  }
}
