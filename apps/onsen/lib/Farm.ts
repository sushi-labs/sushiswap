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

  public constructor({
    chainId,
    token,
    incentives,
  }: {
    chainId: ChainId
    token: TokenDTO
    incentives: IncentiveDTO[]
  }) {
    this.stakeToken = toToken(token, chainId)
    this.farmType = token.type ? (<any>TokenType)[token.type] : TokenType.UNKNOWN // FIXME: any hack?
    this.incentives = incentives.map((incentive) => new Incentive({ chainId, incentive }))
  }

  public get tvl(): number {
    return Math.max(...this.incentives.map((incentive) => incentive.tvl ?? 0))
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
