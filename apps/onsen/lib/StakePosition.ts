import { ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'
import { Stake as StakeDTO } from '@sushiswap/graph-client'

import { TokenType } from './enums'
import { toToken } from './mapper'

export class StakePosition {
  public readonly farmType: TokenType
  public readonly amount: Amount<Token>
  public readonly assets: string[]

  public constructor({ chainId, stake }: { chainId: ChainId; stake: StakeDTO }) {
    this.amount = Amount.fromRawAmount(toToken(stake.token, chainId), stake.liquidity)
    this.farmType = stake.token.type ? (<any>TokenType)[stake.token.type] : TokenType.UNKNOWN // FIXME: any hack?
    this.assets = stake.token.assets ?? []
  }
}
