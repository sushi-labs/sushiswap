import { FC } from 'react'
import { Transaction } from './context/types'

interface Props {
  transactions: Transaction[]
}
const TransactionHistory: FC<Props> = (props) => {
  const transactions = props.transactions
  return (
    <>
      <h2 className="py-4 text-2xl font-bold">Transactions</h2>
      <div>
        {transactions.length ? (
          Object.values(transactions).map((transaction) => (
            <div key={transaction.id}>
              {transaction.type} {``}
              {transaction.amount} {``} {transaction.token.symbol} {``}
              {transaction.to.id} {``}
              {new Date(parseInt(transaction.createdAtTimestamp) * 1000).toLocaleString()} {``}
            </div>
          ))
        ) : (
          <div>
            <i>No transactions found..</i>
          </div>
        )}
      </div>
    </>
  )
}
export default TransactionHistory
