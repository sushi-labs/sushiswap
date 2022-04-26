import { BigNumber } from 'ethers'
import { TransactionType } from './enums'
import { TokenRepresentation, TransactionRepresentation, UserRepresentation } from './representations'
import { ChainId, CurrencyAmount, Token } from '@sushiswap/core-sdk'

export class Transaction {
  public readonly id: string
  public readonly status: TransactionType
  public readonly recipient: UserRepresentation
  public readonly token: Token
  public readonly amount: CurrencyAmount<Token>
  public readonly timestamp: Date
  public readonly toBentoBox: boolean

  public constructor(transaction: TransactionRepresentation) {
    this.id = transaction.id
    this.status = TransactionType[transaction.type]
    this.token = new Token(
      // TODO make dynamic
      ChainId.ETHEREUM,
      transaction.token.id,
      Number(transaction.token.decimals),
      transaction.token.symbol,
      transaction.token.name,
    )
    this.recipient = transaction.to
    this.amount = CurrencyAmount.fromRawAmount(this.token, BigNumber.from(transaction.amount))
    this.timestamp = new Date(parseInt(transaction.createdAtTimestamp) * 1000)
    this.toBentoBox = transaction.toBentoBox
  }
}
