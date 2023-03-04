import { TransactionReceipt } from '@ethersproject/providers'
import { ReactNode } from 'react'

export interface CreateNotificationParams {
  summary: {
    pending: ReactNode | Array<ReactNode>
    completed: ReactNode | Array<ReactNode>
    failed: ReactNode | Array<ReactNode>
  }
  href: string
  txHash: string
  promise: Promise<TransactionReceipt>
}

export type NotificationType = 'swap' | 'mint' | 'burn'
