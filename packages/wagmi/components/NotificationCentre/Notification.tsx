import { SwitchHorizontalIcon } from '@heroicons/react/outline'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid'
import chains, { ChainId } from '@sushiswap/chain'
import { Badge, Dots, Link, Loader, NetworkIcon, TimeAgo, Typography } from '@sushiswap/ui'
import React, { FC } from 'react'
import { useWaitForTransaction } from 'wagmi'

interface NotificationInterface {
  type: string
  chainId: ChainId.ETHEREUM
  pending: string
  completed: string
  failed: string
  txHash: string
  date: string
}

export const Notification: FC<{ data: string }> = ({ data }) => {
  const notification: NotificationInterface = JSON.parse(data)
  const { status, isLoading } = useWaitForTransaction({
    chainId: notification.chainId,
    hash: notification.txHash,
  })

  if (isLoading)
    return (
      <div className="flex items-center gap-5 px-4 pr-8 bg-slate-800 rounded-2xl min-h-[82px] w-full">
        <div>
          <div className="rounded-full bg-slate-700 animate-pulse h-9 w-9" />
        </div>
        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-col gap-1 w-full">
            <div className="bg-slate-600 w-full h-[12px] rounded-full" />
            <div className="bg-slate-600 w-[60px] h-[12px] rounded-full" />
          </div>
          <div className="bg-slate-700 w-[120px] h-[10px] rounded-full" />
        </div>
      </div>
    )

  return (
    <Link.External href={chains[notification.chainId].getTxUrl(notification.txHash)} className="!no-underline">
      <div className="relative hover:bg-slate-700 cursor-pointer flex items-center gap-5 bg-slate-800 rounded-2xl px-4 py-3 pr-8">
        {notification.type === 'swap' && (
          <Badge badgeContent={<NetworkIcon chainId={notification.chainId} width={18} height={18} />}>
            <div className="p-2 bg-slate-600 rounded-full">
              <SwitchHorizontalIcon width={20} height={20} />
            </div>
          </Badge>
        )}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <Typography variant="sm" weight={500} className="text-slate-50 whitespace-normal">
              {['loading'].includes(status) ? (
                <Dots>{notification.pending}</Dots>
              ) : status === 'error' ? (
                notification.failed
              ) : (
                notification.completed
              )}
            </Typography>
            <div className="absolute right-2 top-2">
              {['loading'].includes(status) ? (
                <Loader size={15} />
              ) : status === 'error' ? (
                <XCircleIcon className="currentColor text-red" width={18} height={18} />
              ) : (
                <CheckCircleIcon className="currentColor text-green" width={18} height={18} />
              )}
            </div>
          </div>
          <Typography variant="xs" className="text-slate-500">
            <TimeAgo date={new Date(notification.date)} />
          </Typography>
        </div>
      </div>
    </Link.External>
  )
}
