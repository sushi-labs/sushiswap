import { ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'

import { type Transaction as TransactionDTO, type User, Maybe, TransactionType } from '../.graphclient'
import { toToken } from './mapper'

export class Transaction {
  public readonly id: string
  public readonly status: Maybe<TransactionType> | undefined
  public readonly recipient: User
  public readonly token: Token
  public readonly amount: Amount<Token>
  public readonly timestamp: Date
  public readonly toBentoBox: boolean
  public readonly txHash: string

  public constructor(transaction: TransactionDTO, chainId: ChainId) {
    this.id = transaction.id
    // this.status = TransactionType[transaction.type]
    this.status = transaction.type
    this.token = toToken(transaction.token, chainId)
    this.recipient = transaction.to
    this.amount = Amount.fromRawAmount(this.token, JSBI.BigInt(transaction.amount))
    this.timestamp = new Date(parseInt(transaction.createdAtTimestamp) * 1000)
    this.toBentoBox = transaction.toBentoBox
    this.txHash = transaction.txHash
  }
}
