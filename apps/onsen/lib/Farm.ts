import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { Incentive as IncentiveDTO, Token as TokenDTO } from '@sushiswap/graph-client'

import { TokenType } from './enums'
import { Incentive } from './Incentive'
import { toToken } from './mapper'

export class Farm {
  public readonly stakeToken: Token
  public readonly farmType: TokenType
  public readonly incentives: Incentive[]

  public constructor({ token, incentives }: { token: TokenDTO; incentives: IncentiveDTO[] }) {
    this.stakeToken = toToken(token, ChainId.KOVAN) // TODO: activeChain
    this.farmType = incentives[0].stakeToken?.type
      ? (<any>TokenType)[incentives[0].stakeToken?.type]
      : TokenType.UNKNOWN // FIXME: any hack?
    this.incentives = incentives.map((incentive) => new Incentive({ incentive }))
  }

  public get tvl(): number {
    return this.incentives.reduce((acc, cur) => (acc += cur.tvl ?? 0), 0)
  }

  public get totalRewardInUsd(): number {
    return this.incentives.reduce(
      (acc, cur) => (cur.price ? acc + cur.price * Number(cur.rewardsRemaining.toExact()) : acc),
      0
    )
  }

  public get apr(): string | undefined {
    if (!this.tvl || !this.totalRewardInUsd) {
      return undefined
    }
    return ((this.totalRewardInUsd / this.tvl) * 100).toString()
  }
}
