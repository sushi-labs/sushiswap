import { AppPage } from '../AppPage'

export class LiquidityPoolsPage extends AppPage {
  protected Route: string = '/trident/pools'

  private CreateNewPoolButtonSelector: string = '#btn-create-new-pool'

  public async clickCreateNewPoolButton(): Promise<void> {
    const createNewPoolButton = await this.Page.waitForSelector(this.CreateNewPoolButtonSelector)
    // @ts-ignore TYPE NEEDS FIXING
    await createNewPoolButton.click()
  }

  public async goToPool(poolName: string): Promise<void> {
    if (!poolName) throw new Error('Pool name is required')

    const poolButton = await this.Page.waitForSelector(`#pool-${poolName}`)

    if (!poolButton) throw new Error(`Pool ${poolName} not found`)
    await poolButton.click()

    await this.Page.waitForSelector(`#pool-title-${poolName}`)
  }
}
