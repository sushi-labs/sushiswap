import { Amount, Token } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'

import { TransactionType } from './enums'
import { toToken } from './mapper'
import { TransactionRepresentation, UserRepresentation } from './representations'

export class Transaction {
  public readonly id: string
  public readonly status: TransactionType
  public readonly recipient: UserRepresentation
  public readonly token: Token
  public readonly amount: Amount<Token>
  public readonly timestamp: Date
  public readonly toBentoBox: boolean
  public readonly txHash: string

  public constructor(transaction: TransactionRepresentation) {
    this.id = transaction.id
    this.status = TransactionType[transaction.type]
    this.token = toToken(transaction.token)
    this.recipient = transaction.to
    this.amount = Amount.fromRawAmount(this.token, JSBI.BigInt(transaction.amount))
    this.timestamp = new Date(parseInt(transaction.createdAtTimestamp) * 1000)
    this.toBentoBox = transaction.toBentoBox
    this.txHash = transaction.txHash
  }
}
