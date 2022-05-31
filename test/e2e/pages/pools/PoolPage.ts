import { ILiquidityInfo } from '../../interfaces/ILiquidityInfo'
import { AppPage } from '../AppPage'
export class PoolPage extends AppPage {
  private DepositButtonSelector: string = '#btn-deposit > a'
  private AddLiquidityButtonSelector: string = '#btn-add-stake-liquidity > a'
  private RemoveLiquidityButtonSelector: string = '#btn-remove-liquidity > a'

  private PositionSlpSelector: string = '#my-position-header > div.flex.flex-col.text-right > div'
  private Position0Selector: string = '#my-position-0'
  private Position1Selector: string = '#my-position-1'

  public async clickAddLiquidityButton(): Promise<void> {
    const depositButton = await this.Page.$(this.DepositButtonSelector)
    const addLiquidityButton = await this.Page.$(this.AddLiquidityButtonSelector)

    if (depositButton) {
      await this.evaluateAndClick(this.DepositButtonSelector)
    } else if (addLiquidityButton) {
      await this.evaluateAndClick(this.AddLiquidityButtonSelector)
    } else {
      throw new Error('No button found')
    }
    await this.Page.waitForNavigation()
  }

  public async clickRemoveLiquidityButton(): Promise<void> {
    const removeLiquidityButton = await this.Page.waitForSelector(this.RemoveLiquidityButtonSelector)

    if (removeLiquidityButton) {
      await this.evaluateAndClick(this.RemoveLiquidityButtonSelector)
    } else {
      throw new Error('No button found')
    }

    await this.Page.waitForNavigation()
  }

  public async getPoolPosition(): Promise<ILiquidityInfo> {
    let poolPosition: ILiquidityInfo = {
      assetA: '',
      assetB: '',
      amountA: 0,
      amountB: 0,
      slpAmount: 0,
    }

    const position0Element = await this.Page.waitForSelector(this.Position0Selector)
    const position0Text = await this.Page.evaluate((element) => element.textContent, position0Element)
    const position1Element = await this.Page.waitForSelector(this.Position1Selector)
    const position1Text = await this.Page.evaluate((element) => element.textContent, position1Element)
    const positionSlpElements = await this.Page.$$(this.PositionSlpSelector)
    const positionSlpText = await this.Page.evaluate((element) => element.textContent, positionSlpElements[1])

    poolPosition.assetA = position0Text.split(' ')[1].split('$')[0]
    poolPosition.amountA = parseFloat(position0Text.split(' ')[0])
    poolPosition.assetB = position1Text.split(' ')[1].split('$')[0]
    poolPosition.amountB = parseFloat(position1Text.split(' ')[0])
    poolPosition.slpAmount = parseFloat(positionSlpText.split(' ')[0])

    return poolPosition
  }
}
