import { Dappeteer } from '@chainsafe/dappeteer'
import { Page } from 'puppeteer'

import { AppPage } from '../AppPage'
import { AssetBalancesComponent } from './AssetBalancesComponent'

export class MyWalletPage extends AppPage {
  protected Route: string = '/portfolio/wallet'
  private AssetBalances: AssetBalancesComponent

  constructor(page: Page, metamask: Dappeteer, baseUrl: string) {
    super(page, metamask, baseUrl)

    this.AssetBalances = new AssetBalancesComponent(page)
  }

  public async getWalletBalances(): Promise<Record<string, number>> {
    return await this.AssetBalances.getAssetBalances()
  }
}
