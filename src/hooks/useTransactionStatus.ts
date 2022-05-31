import { isTxPending } from 'app/functions/transactions'
import { isTransactionRecent, useAllTransactions } from 'app/state/transactions/hooks'
import { TransactionDetails } from 'app/state/transactions/reducer'
import { useEffect, useMemo, useState } from 'react'

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

const useTransactionStatus = () => {
  const [pendingTXStatus, setPendingTXStatus] = useState<any>(false)

  // Determine if change in transactions, if so, run query again
  const allTransactions = useAllTransactions()
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])
  const pending = sortedRecentTransactions.filter(isTxPending).map((tx) => tx.hash)
  const hasPendingTransactions = !!pending.length

  useEffect(() => {
    setPendingTXStatus(hasPendingTransactions)
  }, [hasPendingTransactions])

  return pendingTXStatus
}

export default useTransactionStatus
