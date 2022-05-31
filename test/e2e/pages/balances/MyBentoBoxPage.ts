import { Dappeteer } from '@chainsafe/dappeteer'
import { Page } from 'puppeteer'

import { AppPage } from '../AppPage'
import { AssetBalancesComponent } from './AssetBalancesComponent'

export class MyBentoBoxPage extends AppPage {
  protected Route: string = '/portfolio/bentobox'
  private AssetBalances: AssetBalancesComponent

  constructor(page: Page, metamask: Dappeteer, baseUrl: string) {
    super(page, metamask, baseUrl)

    this.AssetBalances = new AssetBalancesComponent(page)
  }

  public async getBentoBalances(): Promise<Record<string, number>> {
    return await this.AssetBalances.getAssetBalances()
  }
}
