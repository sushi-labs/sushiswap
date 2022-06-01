import { Amount, Token } from '@sushiswap/currency'

import { Incentive } from './Incentive'
import { TokenRepresentation } from './representations'
import { TokenType } from './types'

export class Farm {
  public readonly tokenType: string
  public readonly incentives: Incentive[]
  public readonly rewardsPerDay: Record<string, Amount<Token>> = {}

  public constructor({ stakeToken }: { stakeToken: TokenRepresentation }) {
    this.tokenType = stakeToken?.type ? (<any>TokenType)[stakeToken?.type] : TokenType.UNKNOWN // FIXME: any hack?
    this.incentives = stakeToken.incentives?.map((incentive) => new Incentive({ incentive })) ?? []
    this.incentives?.forEach((incentive) => {
      const address = incentive.rewardRemaining.currency.address
      this.rewardsPerDay[address]
        ? this.rewardsPerDay[address].add(incentive.rewardRemaining)
        : (this.rewardsPerDay[address] = incentive.rewardRemaining)
    })
  }
}
