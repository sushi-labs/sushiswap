import { Dappeteer } from '@chainsafe/dappeteer'
import { Page } from 'puppeteer'

import { AddLiquidityPage } from './pools/AddLiquidityPage'
import { CreatePoolPage } from './pools/CreatePoolPage'
import { LiquidityPoolsPage } from './pools/LiquidityPoolsPage'
import { PoolPage } from './pools/PoolPage'
import { RemoveLiquidityPage } from './pools/RemoveLiquidityPage'
import { SwapPage } from './swap/SwapPage'

export class App {
  public SwapPage: SwapPage
  public LiquidityPoolsPage: LiquidityPoolsPage
  public AddLiquidityPage: AddLiquidityPage
  public RemoveLiquidityPage: RemoveLiquidityPage
  public PoolPage: PoolPage
  public CreatePoolPage: CreatePoolPage

  constructor(page: Page, metamask: Dappeteer, baseUrl: string) {
    this.SwapPage = new SwapPage(page, metamask, baseUrl)
    this.LiquidityPoolsPage = new LiquidityPoolsPage(page, metamask, baseUrl)
    this.AddLiquidityPage = new AddLiquidityPage(page, metamask, baseUrl)
    this.RemoveLiquidityPage = new RemoveLiquidityPage(page, metamask, baseUrl)
    this.PoolPage = new PoolPage(page, metamask, baseUrl)
    this.CreatePoolPage = new CreatePoolPage(page, metamask, baseUrl)
  }
}
