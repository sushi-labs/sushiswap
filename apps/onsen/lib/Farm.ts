import { ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'
import { Incentive as IncentiveDTO, Token as TokenDTO } from '@sushiswap/graph-client'

import { Incentive } from './Incentive'
import { toToken } from './mapper'

export class Farm {
  public readonly stakeToken: Token
  public readonly farmType: string
  public readonly incentives: Incentive[]
  public readonly rewardsPerDay: Record<string, Amount<Token>> = {}

  public constructor({ token, incentives }: { token: TokenDTO; incentives: IncentiveDTO[] }) {
    this.stakeToken = toToken(token, ChainId.KOVAN) // TODO: activeChain
    this.farmType = token.type
    this.incentives = incentives.map((incentive) => new Incentive({ incentive }))
  }
}
