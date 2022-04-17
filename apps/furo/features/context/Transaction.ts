import { BigNumber } from 'ethers'
import { Furo } from './Furo'
import { StreamRepresentation, TokenRepresentation, TransactionRepresentation, TransactionType, UserRepresentation } from './representations'

export class Transaction {
  public readonly id: string
  public readonly status: TransactionType
  public readonly recipient: UserRepresentation
  public readonly token: TokenRepresentation
  public readonly amount: BigNumber
  public readonly timestamp: Date
  public readonly toBentoBox: boolean

  public constructor({ transaction }: { transaction: TransactionRepresentation }) {
    this.id = transaction.id
    this.status = TransactionType[transaction.type]
    this.token = transaction.token
    this.recipient = transaction.to
    this.amount = BigNumber.from(transaction.amount)
    this.timestamp = new Date(parseInt(transaction.createdAtTimestamp) * 1000)
    this.toBentoBox = transaction.toBentoBox
  }
}
