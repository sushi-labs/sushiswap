import { HalfCircleIcon } from '@sushiswap/ui/icons/HalfCircleIcon'
import type { FC } from 'react'
import { getChainById } from 'sushi'

import type { ResolvedNotification } from '../../types'
import { ToastContent } from './toast-content'

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
      ? getChainById(chainId).getTransactionUrl(txHash as `0x${string}`)
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
