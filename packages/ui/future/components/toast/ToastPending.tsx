import { Chain } from '@sushiswap/chain'
import { FC } from 'react'

import { Loader } from '../Loader'
import { NotificationData } from './Toast'
import { ToastButtons } from './ToastButtons'
import { ToastContent } from './ToastContent'
import { Dots } from '../Dots'

interface ToastPending extends Omit<NotificationData, 'promise'> {
  onDismiss(): void
}

export const ToastPending: FC<ToastPending> = ({ type, href, chainId, txHash, onDismiss, summary }) => {
  const txUrl = href ? href : Chain.from(chainId)?.getTxUrl(txHash) ?? ''
  return (
    <>
      <ToastContent href={txUrl} summary={<Dots>{summary.pending}</Dots>} />
    </>
  )
}
