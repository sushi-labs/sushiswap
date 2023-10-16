import { ReactNode } from 'react'
import { TransactionReceipt } from 'viem'

export interface CreateNotificationParams {
  summary: {
    pending: ReactNode | ReactNode[]
    completed: ReactNode | ReactNode[]
    failed: ReactNode | ReactNode[]
  }
  href: string
  txHash: string
  promise: Promise<TransactionReceipt>
}

export type NotificationType = 'swap' | 'mint' | 'burn'
