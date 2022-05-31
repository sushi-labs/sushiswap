import { AppPageComponent } from '../AppPageComponent'

export class CurrencySelectComponent extends AppPageComponent {
  // Selectors
  private SelectTokenInputSelector: string = '#txt-select-token'
  private AllCurrenciesListSelector: string = '#all-currencies-list'
  private SelectTokenResultsSelector: string = '.token-'

  public async selectToken(tokenSymbol: string): Promise<void> {
    await this.Page.waitForSelector(this.AllCurrenciesListSelector)
    await this.blockingWait(3)

    const tokenSelector = this.SelectTokenResultsSelector + tokenSymbol

    const tokenButton = await this.Page.$(tokenSelector)

    if (tokenButton) {
      // @ts-ignore TYPE NEEDS FIXING
      await tokenButton.click()
    }
  }
}
