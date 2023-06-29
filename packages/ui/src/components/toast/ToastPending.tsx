import { Chain } from '@sushiswap/chain'
import { ResolvedNotification } from '@sushiswap/dexie'
import { FC } from 'react'

import { Dots } from '../dots'
import { ToastContent } from './ToastContent'

interface ToastPending extends ResolvedNotification {
  onDismiss(): void
}

export const ToastPending: FC<ToastPending> = ({ type, href, chainId, txHash, onDismiss, summary }) => {
  const txUrl = href ? href : txHash ? Chain.from(chainId)?.getTxUrl(txHash) : ''
  return (
    <>
      <ToastContent href={txUrl} summary={<Dots>{summary}</Dots>} />
    </>
  )
}
