import { createReducer } from '@reduxjs/toolkit'
import { PrivateTxState, PrivateTxStatus } from 'app/entities/SushiGuard'
import ms from 'ms.macro'

import { updateVersion } from '../global/actions'
import {
  addTransaction,
  checkedTransaction,
  clearAllTransactions,
  finalizeTransaction,
  SerializableTransactionReceipt,
  updatePrivateTxStatus,
} from './actions'

const now = () => new Date().getTime()

export interface TransactionDetails {
  hash: string
  receipt?: SerializableTransactionReceipt
  lastCheckedBlockNumber?: number
  addedTime: number
  confirmedTime?: number
  from: string
  summary?: string
  claim?: { recipient: string }
  approval?: { tokenAddress: string; spender: string }
  privateTx?: {
    state: PrivateTxState
    status?: PrivateTxStatus
  }
}

export interface TransactionState {
  [chainId: number]: {
    [txHash: string]: TransactionDetails
  }
}

export const initialState: TransactionState = {}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateVersion, (transactions) => {})
    .addCase(addTransaction, (transactions, { payload: { chainId, from, hash, summary, privateTx = false } }) => {
      if (transactions[chainId]?.[hash]) {
        throw Error('Attempted to add existing transaction.')
      }
      const txs = transactions[chainId] ?? {}
      txs[hash] = {
        hash,
        summary,
        from,
        addedTime: now(),
        ...(privateTx ? { privateTx: { state: PrivateTxState.CHECKING, status: undefined } } : {}),
      }
      transactions[chainId] = txs
    })
    .addCase(clearAllTransactions, (transactions, { payload: { chainId } }) => {
      if (!transactions[chainId]) return
      transactions[chainId] = {}
    })
    .addCase(checkedTransaction, (transactions, { payload: { chainId, hash, blockNumber } }) => {
      const tx = transactions[chainId]?.[hash]
      if (!tx) {
        return
      }
      if (!tx.lastCheckedBlockNumber) {
        tx.lastCheckedBlockNumber = blockNumber
      } else {
        tx.lastCheckedBlockNumber = Math.max(blockNumber, tx.lastCheckedBlockNumber)
      }
    })
    .addCase(finalizeTransaction, (transactions, { payload: { hash, chainId, receipt } }) => {
      const tx = transactions[chainId]?.[hash]
      if (!tx) {
        return
      }
      tx.receipt = receipt
      tx.confirmedTime = now()
    })
    .addCase(updatePrivateTxStatus, (transactions, { payload: { chainId, hash, blockNumber, status } }) => {
      const tx = transactions[chainId]?.[hash]
      if (!tx) return
      if (!tx.privateTx) throw new Error('Invalid update private tx call to a non private tx')

      const prevState = tx.privateTx?.state
      const minutesEllapsed = (new Date().getTime() - tx.addedTime) / ms`1m`

      // If previous state was a definitive one, we skip processing new events
      if (
        prevState &&
        (prevState === PrivateTxState.OK ||
          prevState === PrivateTxState.INDETERMINATE ||
          prevState === PrivateTxState.ERROR)
      )
        return

      // derive new private tx state from latest received status
      let state = PrivateTxState.CHECKING

      // OK - Relay received the Tx && all downstream miners accepted without complains && tx mined sucessfully
      if (status.receivedAt && status.relayedAt && !status.relayFailure && status.minedAt) state = PrivateTxState.OK

      // ERROR
      if (
        status.receivedAt &&
        status.relayFailure &&
        status.relayResponses &&
        Object.values(status.relayResponses).reduceRight((prev, current) => {
          if (prev) return prev
          if (current.error || current.response.error) return true
          return false
        }, false)
      )
        state = PrivateTxState.ERROR

      // INDETERMINATE
      if (status.receivedAt && status.relayedAt && status.relayFailure && status.minedAt)
        state = PrivateTxState.INDETERMINATE

      // If more than 30 minutes have passed, better to mark this TX as indeterminate
      // and ignore future updates as it probably has failed
      if (minutesEllapsed > 30) state = PrivateTxState.INDETERMINATE

      // update new state
      tx.lastCheckedBlockNumber = blockNumber
      tx.privateTx = { state, status }
    })
)
