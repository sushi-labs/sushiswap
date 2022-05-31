import { Dappeteer } from '@chainsafe/dappeteer'
import { Page } from 'puppeteer'

import { AppPage } from '../AppPage'
import { CurrencySelectComponent } from '../shared/CurrencySelectComponent'

export class CreatePoolPage extends AppPage {
  // Page components
  private CurrencySelectModal: CurrencySelectComponent

  // Page selectors
  private ClassicContinueButtonSelector: string = '#btn-classic-continue'
  private ClassicWithdrawFromSelector: string = '.switch-classic-withdraw-from-'
  private PoolTypeButtonSelector: string = '#pool-select-'
  private TokenSelectTriggerSelector: string = '.token-select-trigger'
  private TokenAmountInputSelector: string = '.swap-panel-input input'
  private FeeTierSelector: string = '#fee-tier-'
  private ApproveButtonSelector: string = '#btn-approve'
  private ReviewConfirmButtonSelector: string = '#btn-review-confirm'
  private ConfirmCreationButtonSelector: string = '#btn-confirm-pool-creation'
  private SuccessIconSelector: string = '#pool-creation-success'

  constructor(page: Page, metamask: Dappeteer, baseUrl: string) {
    super(page, metamask, baseUrl)

    this.CurrencySelectModal = new CurrencySelectComponent(page)
  }

  public async createPool(
    poolType: string,
    assetA: string,
    assetB: string,
    payAssetAFromWallet: boolean,
    payAssetBFromWallet: boolean,
    amountInA: string,
    amountInB: string,
    fee: number
  ): Promise<void> {
    // await this.setPoolType(poolType)
    // await this.clickContinueButton()
    await this.setAssetA(assetA, payAssetAFromWallet)
    await this.setAssetB(assetB, payAssetBFromWallet)
    await this.setAssetAAmountIn(amountInA)
    await this.setAssetBAmountIn(amountInB)
    await this.setPoolFee(fee)
    await this.confirmCreate()
  }

  public async setAssetA(symbol: string, payFromWallet: boolean): Promise<void> {
    await this.setAsset(symbol, 0)
    await this.setAssetPayFromWallet(payFromWallet, 0)
  }

  public async setAssetB(symbol: string, payFromWallet: boolean): Promise<void> {
    await this.setAsset(symbol, 1)
    await this.setAssetPayFromWallet(payFromWallet, 1)
  }

  private async setAssetPayFromWallet(payFromWallet: boolean, assetIndex: number): Promise<void> {
    const selector = this.ClassicWithdrawFromSelector + assetIndex

    await this.Page.waitForSelector(selector)
    const isSelectorChecked = await this.isSwitchChecked(selector)
    const switchElement = await this.getSwitchElement(selector)
    if (payFromWallet && !isSelectorChecked) {
      await switchElement.click()
    } else if (!payFromWallet && isSelectorChecked) {
      await switchElement.click()
    }
  }

  private async setAsset(symbol: string, assetIndex: number): Promise<void> {
    await this.Page.waitForSelector(this.TokenSelectTriggerSelector)

    const tokenSelectTriggers = await this.Page.$$(this.TokenSelectTriggerSelector)
    if (tokenSelectTriggers.length > 1) {
      await tokenSelectTriggers[assetIndex].click()
    } else {
      await tokenSelectTriggers[0].click()
    }

    await this.CurrencySelectModal.selectToken(symbol)
  }

  public async setAssetAAmountIn(amountIn: string): Promise<void> {
    await this.setAssetAmountIn(amountIn, 0)
  }

  public async setAssetBAmountIn(amountIn: string): Promise<void> {
    await this.setAssetAmountIn(amountIn, 1)
  }

  public async setPoolFee(fee: number): Promise<void> {
    const feeTierButton = await this.Page.waitForSelector(this.FeeTierSelector + fee)
    // @ts-ignore TYPE NEEDS FIXING
    await feeTierButton.click()
  }

  public async setPoolType(poolType: string): Promise<void> {
    const poolTypeButton = await this.Page.waitForSelector(this.PoolTypeButtonSelector + poolType)
    // @ts-ignore TYPE NEEDS FIXING
    await poolTypeButton.click()
  }

  public async clickContinueButton(): Promise<void> {
    const continueButton = await this.Page.waitForSelector(this.ClassicContinueButtonSelector)
    // @ts-ignore TYPE NEEDS FIXING
    await continueButton.click()
  }

  public async confirmCreate(): Promise<void> {
    await this.blockingWait(3, true)
    let approveButton = await this.Page.$(this.ApproveButtonSelector)
    while (approveButton) {
      await approveButton.click()
      await this.Metamask.confirmTransaction()
      await this.bringToFront()
      await this.blockingWait(3, true)
      approveButton = await this.Page.$(this.ApproveButtonSelector)
    }

    const btnReviewConfirm = await this.Page.waitForSelector(this.ReviewConfirmButtonSelector)

    const confirmButtonText = await this.Page.$eval(this.ReviewConfirmButtonSelector, (el) => el.textContent)
    if (confirmButtonText === 'Pool already exists') {
      return
    }

    // @ts-ignore TYPE NEEDS FIXING
    await btnReviewConfirm.click()

    const btnConfirmCreation = await this.Page.waitForSelector(this.ConfirmCreationButtonSelector)
    // @ts-ignore TYPE NEEDS FIXING
    await btnConfirmCreation.click()

    await this.confirmMetamaskTransaction()
    await this.Page.waitForSelector(this.SuccessIconSelector)
  }

  private async setAssetAmountIn(amountIn: string, assetIndex: number): Promise<void> {
    await this.Page.waitForSelector(this.TokenAmountInputSelector)
    const tokenAmountInputs = await this.Page.$$(this.TokenAmountInputSelector)
    await tokenAmountInputs[assetIndex].type(amountIn)
  }
}
