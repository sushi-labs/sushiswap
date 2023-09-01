import { ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'

import { Maybe, streamTransactionsQuery, TransactionType, vestingTransactionsQuery } from '../.graphclient'
import { toToken } from './mapper'

export class Transaction {
  public readonly id: string
  public readonly status: Maybe<TransactionType> | undefined
  public readonly token: Token
  public readonly amount: Amount<Token>
  public readonly timestamp: Date
  public readonly toBentoBox: boolean
  public readonly txHash: string

  public constructor(
    transaction: streamTransactionsQuery['transactions'][0] | vestingTransactionsQuery['transactions'][0],
    chainId: ChainId
  ) {
    this.id = transaction.id
    this.status = transaction.type
    this.token = toToken(transaction.token, chainId)
    this.amount = Amount.fromRawAmount(this.token, BigInt(transaction.amount))
    this.timestamp = new Date(parseInt(transaction.createdAtTimestamp) * 1000)
    this.toBentoBox = transaction.toBentoBox
    this.txHash = transaction.txHash
  }
}
