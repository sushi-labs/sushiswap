import { Chain } from '@sushiswap/chain'
import { FC } from 'react'

import { HalfCircleIcon } from '../icons'
import { NotificationData } from './index'
import { ToastButtons } from './ToastButtons'
import { ToastContent } from './ToastContent'

interface ToastInfo extends Omit<NotificationData, 'promise'> {
  onDismiss(): void
}

export const ToastInfo: FC<ToastInfo> = ({ href, chainId, txHash, onDismiss, summary }) => {
  const txUrl = href ? href : Chain.from(chainId)?.getTxUrl(txHash) ?? ''
  return (
    <>
      <ToastContent
        href={txUrl}
        icon={<HalfCircleIcon width={18} height={18} className="text-blue" />}
        summary={summary?.info}
      />
      <ToastButtons href={txUrl} onDismiss={onDismiss} />
    </>
  )
}
