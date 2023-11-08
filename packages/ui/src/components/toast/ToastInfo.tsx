import { ResolvedNotification } from '@sushiswap/dexie'
import { FC } from 'react'
import { Chain } from 'sushi/chain'

import { HalfCircleIcon } from '../icons/HalfCircleIcon'
import { ToastContent } from './ToastContent'

interface ToastInfo extends ResolvedNotification {
  onDismiss(): void
}

export const ToastInfo: FC<ToastInfo> = ({
  href,
  chainId,
  txHash,
  summary,
}) => {
  const txUrl = href
    ? href
    : txHash
    ? Chain.from(chainId)?.getTxUrl(txHash)
    : ''
  return (
    <>
      <ToastContent
        href={txUrl}
        icon={<HalfCircleIcon width={18} height={18} className="text-blue" />}
        summary={summary}
      />
    </>
  )
}
