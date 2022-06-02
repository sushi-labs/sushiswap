import { ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'

import { KOVAN_STAKING_Incentive as IncentiveDTO, KOVAN_STAKING_Token as TokenDTO } from '../../../.graphclient'
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
