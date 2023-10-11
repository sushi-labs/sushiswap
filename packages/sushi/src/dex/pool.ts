import { Amount, Token } from '../currency'

import { Fee } from './fee'

export abstract class Pool {
  public abstract readonly liquidityToken: Token

  // Swap gas cost, could be different depending on source & dest,
  // wallet->wallet, bento->wallet/wallet->bento, bento->bento

  // wallet->wallet: ???
  // bento->wallet/wallet->bento: ???
  // bento->bento: ???
  public abstract readonly swapGasCost: bigint

  // Minimum pool liquidity, typically 1000
  public abstract readonly minLiquidity: bigint

  public abstract get chainId(): number

  public abstract get fee(): Fee

  public abstract get assets(): Token[]

  public abstract get reserves(): Amount<Token>[]

  public abstract getLiquidityMinted(
    totalSupply: Amount<Token>,
    tokenAmountA: Amount<Token>,
    tokenAmountB: Amount<Token>,
  ): Amount<Token>

  public abstract getLiquidityValue(
    token: Token,
    totalSupply: Amount<Token>,
    liquidity: Amount<Token>,
  ): Amount<Token>

  public abstract involvesToken(token: Token): boolean
}
