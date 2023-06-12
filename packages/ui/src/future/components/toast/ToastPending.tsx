import { Chain } from '@sushiswap/chain'
import { FC } from 'react'

import { ToastContent } from './ToastContent'
import { Dots } from '../Dots'
import { ResolvedNotification } from '@sushiswap/dexie'

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
