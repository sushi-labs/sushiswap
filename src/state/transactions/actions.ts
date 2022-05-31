import { createAction } from '@reduxjs/toolkit'
import { ChainId } from '@sushiswap/core-sdk'
import { PrivateTxStatus } from 'app/entities/SushiGuard'

export interface SerializableTransactionReceipt {
  to: string
  from: string
  contractAddress: string
  transactionIndex: number
  blockHash: string
  transactionHash: string
  blockNumber: number
  status?: number
}

export const addTransaction = createAction<{
  chainId: ChainId
  hash: string
  from: string
  approval?: { tokenAddress: string; spender: string }
  claim?: { recipient: string }
  summary?: string
  privateTx?: boolean
}>('transactions/addTransaction')
export const clearAllTransactions = createAction<{ chainId: number }>('transactions/clearAllTransactions')
export const finalizeTransaction = createAction<{
  chainId: number
  hash: string
  receipt: SerializableTransactionReceipt
}>('transactions/finalizeTransaction')
export const checkedTransaction = createAction<{
  chainId: number
  hash: string
  blockNumber: number
}>('transactions/checkedTransaction')
export const updatePrivateTxStatus = createAction<{
  chainId: ChainId
  hash: string
  blockNumber: number
  status: PrivateTxStatus
}>('transactions/updatePrivateTxStatus')
