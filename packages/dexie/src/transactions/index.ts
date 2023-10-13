import { db } from '../db'
import type { ChainId } from 'sushi/chain'

type TransactionStatus = 'success' | 'pending' | 'reverted' | 'replaced'

interface Transaction {
  account: `0x${string}`
  chainId: ChainId
  hash: `0x${string}`
  payload: string
  timestamp: number
  status: TransactionStatus
}

const addTransaction = async (transaction: Omit<Transaction, 'status'>) => {
  return db
    .table('transactions')
    .add({ ...transaction, id: transaction.hash, status: 'pending' })
    .then(() => transaction)
}

const editTransactionStatus = async ({
  id,
  status,
}: { id: string; status: TransactionStatus }) => {
  return db
    .table('transactions')
    .update(id, { status })
    .then(() => ({ id, status }))
}

const getTransactions = async (account: `0x${string}` | undefined) =>
  account
    ? await db
        .table('transactions')
        .where('account')
        .equals(account)
        .sortBy('timestamp')
    : []

export {
  addTransaction,
  editTransactionStatus,
  getTransactions,
  type Transaction,
}
