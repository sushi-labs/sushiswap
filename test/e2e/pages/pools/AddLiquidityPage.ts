import { ElementHandle } from 'puppeteer'

import { AppPage } from '../AppPage'

export class AddLiquidityPage extends AppPage {
  private ConfirmDepositButtonSelector: string = '#btn-ConfirmDeposit'
  private ModalConfirmDepositButtonSelector: string = '#btn-modal-confirm-deposit'
  private TxStatusDivSelector: string = 'div-tx-status'
  private ApproveButtonSelector: string = '#btn-approve'
  private FixedRatioCheckboxSelector: string = '#chk-fixed-ratio-deposit'

  // Transaction Details Selctors
  private MinReceivedSelector: string = '#text-liquidity-minted'

  // Asset input selectors
  private SpendFromWalletASelector: string = '.switch-spend-from-wallet-a'
  private SpendFromWalletBSelector: string = '.switch-spend-from-wallet-b'
  private AssetInputALabelSelector: string = '#asset-input-a'
  private AssetInputBLabelSelector: string = '#asset-input-b'
  private AssetInputABalanceSelector: string = '#asset-input-a-balance'
  private AssetInputBBalanceSelector: string = '#asset-input-b-balance'

  public async addLiquidity(
    t0Amount: string,
    spendFromWalletA: boolean = true,
    spendFromWalletB: boolean = true,
    t1Amount: string = '',
    fixedRatio: boolean = false
  ): Promise<void> {
    await this.setFixedRatio(fixedRatio)

    await this.setAssetADepositAmount(parseFloat(t0Amount))
    await this.setAssetBDepositAmount(parseFloat(t1Amount))

    await this.setAssetAFundFromWallet(spendFromWalletA)
    await this.setAssetBFundFromWallet(spendFromWalletB)

    await this.confirmDeposit()
  }

  public async confirmDeposit(): Promise<void> {
    await this.blockingWait(1, true)
    const approveButton = await this.Page.$(this.ApproveButtonSelector)
    if (approveButton) {
      await approveButton.click()
      await this.Metamask.confirmTransaction()
      await this.Metamask.page.waitForTimeout(1000)
      await this.bringToFront()
    }

    const confirmDepositButton = await this.Page.waitForSelector(this.ConfirmDepositButtonSelector)
    // @ts-ignore TYPE NEEDS FIXING
    await confirmDepositButton.click()

    const modalConfirmDepositButton = await this.Page.waitForSelector(this.ModalConfirmDepositButtonSelector)
    // @ts-ignore TYPE NEEDS FIXING
    await modalConfirmDepositButton.click()

    await this.confirmMetamaskTransaction()

    await this.Page.waitForXPath(`//div[@id='${this.TxStatusDivSelector}' and contains(., 'Success')]`)

    await this.blockingWait(5)
  }

  public async getAssetABalance(fromWallet: boolean = true): Promise<number> {
    return await this.getAssetBalance(this.SpendFromWalletASelector, this.AssetInputABalanceSelector, fromWallet)
  }

  public async getAssetBBalance(fromWallet: boolean = true): Promise<number> {
    return await this.getAssetBalance(this.SpendFromWalletBSelector, this.AssetInputBBalanceSelector, fromWallet)
  }

  public async setFixedRatio(fixedRatio: boolean): Promise<void> {
    await this.blockingWait(1, true)
    const fixedRatioCheckbox = await this.getFixedRatioCheckbox()

    if (fixedRatio && !(await this.isFixedRatioChecked())) {
      await fixedRatioCheckbox.click()
    } else if (!fixedRatio && (await this.isFixedRatioChecked())) {
      await fixedRatioCheckbox.click()
    }
  }

  public async setAssetADepositAmount(depositAmount: number): Promise<void> {
    await this.blockingWait(1, true)
    const inputs = await this.Page.$$('input[type=text]')
    if (inputs.length !== 2) throw new Error('Expected 2 text inputs on add liquidity page')

    await inputs[0].type(depositAmount.toString())
  }

  public async setAssetBDepositAmount(depositAmount: number): Promise<void> {
    await this.blockingWait(1, true)
    const inputs = await this.Page.$$('input[type=text]')
    if (inputs.length !== 2) throw new Error('Expected 2 text inputs on add liquidity page')

    await inputs[1].type(depositAmount.toString())
  }

  public async setAssetAFundFromWallet(fromWallet: boolean = true): Promise<void> {
    await this.setFundingSource(this.SpendFromWalletASelector, fromWallet)
  }

  public async setAssetBFundFromWallet(fromWallet: boolean = true): Promise<void> {
    await this.setFundingSource(this.SpendFromWalletBSelector, fromWallet)
  }

  public async getAssetBDepositAmount(): Promise<number> {
    await this.blockingWait(1, true)
    const inputs = await this.Page.$$('input[type=text]')

    const assetBInput = inputs[1]

    const depositAmount = (await (await assetBInput.getProperty('value')).jsonValue()) as string
    return parseFloat(depositAmount)
  }

  public async getAssetADepositAmount(): Promise<number> {
    await this.blockingWait(1, true)
    const inputs = await this.Page.$$('input[type=text]')

    const assetBInput = inputs[0]

    const depositAmount = (await (await assetBInput.getProperty('value')).jsonValue()) as string
    return parseFloat(depositAmount)
  }

  public async getMinReceivedAmount(): Promise<number> {
    await this.Page.waitForSelector(this.MinReceivedSelector)
    const minReceivedText = await this.Page.$eval(this.MinReceivedSelector, (el) => el.textContent)

    if (minReceivedText) {
      const balance = minReceivedText.split(' ')[0]
      return parseFloat(balance)
    }

    return 0
  }

  private async setFundingSource(switchSelector: string, fromWallet: boolean = true): Promise<void> {
    const isSpendFromWalletAChecked = await this.isSwitchChecked(switchSelector)
    const spendFromWalletASwitch = await this.getSwitchElement(switchSelector)
    if (fromWallet && !isSpendFromWalletAChecked) {
      await spendFromWalletASwitch.click()
    } else if (!fromWallet && isSpendFromWalletAChecked) {
      await spendFromWalletASwitch.click()
    }
  }

  private async getAssetBalance(
    spendFromSwitchSelector: string,
    balanceSelector: string,
    fromWallet: boolean = true
  ): Promise<number> {
    await this.blockingWait(5, true)

    const isSpendFromWalletChecked = await this.isSwitchChecked(spendFromSwitchSelector)
    const spendFromWalletSwitch = await this.getSwitchElement(spendFromSwitchSelector)
    if (fromWallet && !isSpendFromWalletChecked) {
      await spendFromWalletSwitch.click()
    } else if (!fromWallet && isSpendFromWalletChecked) {
      await spendFromWalletSwitch.click()
    }

    await this.Page.waitForSelector(balanceSelector)
    const assetBalanceText = await this.Page.$eval(balanceSelector, (el) => el.textContent)

    if (assetBalanceText) {
      const balance = assetBalanceText.split(' ')[0]
      return parseFloat(balance)
    }

    return 0
  }

  private async getFixedRatioCheckbox(): Promise<ElementHandle<Element>> {
    await this.Page.waitForSelector(this.FixedRatioCheckboxSelector)
    const fixedRateCheckbox = await this.Page.$(this.FixedRatioCheckboxSelector)

    // @ts-ignore TYPE NEEDS FIXING
    return fixedRateCheckbox
  }

  private async isFixedRatioChecked(): Promise<boolean> {
    let fixedRatioChecked: boolean

    const fixedRatioCheckbox = await this.getFixedRatioCheckbox()
    fixedRatioChecked = (await (await fixedRatioCheckbox.getProperty('checked')).jsonValue()) as boolean

    return fixedRatioChecked
  }
}
