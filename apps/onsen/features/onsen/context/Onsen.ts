import { ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'

import { toToken } from './mapper'
import { IncentiveRepresentation, UserRepresentation } from './representations'


export class Incentive {

  public readonly id: string
  public readonly rewardRemaining: Amount<Token>
  public readonly liquidityStaked: Amount<Token>
//   public readonly subscriptions?: Object
  public readonly startTime: Date
  public readonly endTime: Date
  public readonly createdBy: UserRepresentation
  //   public readonly modifiedAtTimestamp: Date
//   public readonly txHash: string

  public constructor({ incentive }: { incentive: IncentiveRepresentation }) {
    this.id = incentive.id
    this.rewardRemaining = Amount.fromRawAmount(toToken(incentive.rewardToken, ChainId.KOVAN), incentive.rewardRemaining) // TODO: pass in active network to constructor
    this.liquidityStaked = Amount.fromRawAmount(toToken(incentive.token, ChainId.KOVAN), incentive.liquidityStaked) // TODO: pass in active network to constructor
    this.startTime = new Date(Number(incentive.timestamp) * 1000)
    this.endTime = new Date(Number(incentive.endTime) * 1000)
    this.createdBy = incentive.creator
    // this.txHash = incentive.txHash
  }

  public get remainingTime(): { days: number; hours: number; minutes: number; seconds: number } | undefined {
    const now = Date.now()
    const interval = this.endTime.getTime() - now
    if (interval > 0) {

      let days = Math.floor(interval / (1000 * 60 * 60 * 24))
      let hours = Math.floor((interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      let minutes = Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60))
      let seconds = Math.floor((interval % (1000 * 60)) / 1000)

      return { days, hours, minutes, seconds }
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

}