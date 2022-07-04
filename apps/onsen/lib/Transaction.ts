import { ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'
import { Maybe, Transaction as TransactionDTO, TransactionType } from '@sushiswap/graph-client'
import { JSBI } from '@sushiswap/math'

import { toToken } from './mapper'

export class Transaction {
  public readonly id: string
  public readonly status: Maybe<TransactionType> | undefined
  public readonly user: string
  public readonly recipient: string
  public readonly token: Token
  public readonly amount: Amount<Token>
  public readonly timestamp: Date
  public readonly toBentoBox: boolean
  public readonly txHash: string

  public constructor(transaction: TransactionDTO, chainId: ChainId) {
    this.id = transaction.id
    this.status = transaction.type
    this.token = toToken(transaction.token, chainId)
    this.user = transaction.user.id
    this.recipient = transaction.to.id
    this.amount = Amount.fromRawAmount(this.token, JSBI.BigInt(transaction.amount))
    this.timestamp = new Date(parseInt(transaction.createdAtTimestamp) * 1000)
    this.toBentoBox = transaction.toBentoBox
    this.txHash = transaction.txHash
  }
}
