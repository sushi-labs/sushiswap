import { Disclosure } from '@headlessui/react'
import { SwitchHorizontalIcon } from '@heroicons/react/outline'
import { CheckCircleIcon, ChevronDownIcon, XCircleIcon } from '@heroicons/react/solid'
import chains from '@sushiswap/chain'
import {
  Badge,
  classNames,
  Dots,
  IconButton,
  Link,
  Loader,
  NetworkIcon,
  NotificationData,
  TimeAgo,
  Typography,
} from '@sushiswap/ui'
import React, { FC } from 'react'
import { useWaitForTransaction } from 'wagmi'

export const Notification: FC<{ data: string; showExtra?: boolean; hideStatus?: boolean }> = ({
  data,
  showExtra = false,
  hideStatus = false,
}) => {
  const notification: NotificationData = JSON.parse(data)
  const { status, isLoading } = useWaitForTransaction({
    chainId: notification.chainId,
    hash: notification.txHash,
  })

  if (isLoading)
    return (
      <div className="flex items-center gap-5 px-4 pr-8 bg-white bg-opacity-[0.06] rounded-2xl min-h-[82px] w-full">
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
    <div className="relative hover:opacity-80">
      {showExtra && (
        <Disclosure.Button className="absolute right-3 top-0 bottom-0 z-[100]">
          {({ open }) => {
            return (
              <IconButton>
                <ChevronDownIcon
                  width={20}
                  height={20}
                  className={classNames(open ? 'rotate-180' : 'rotate-0', 'rounded-full transition-all delay-200')}
                />
              </IconButton>
            )
          }}
        </Disclosure.Button>
      )}
      <Link.External href={chains[notification.chainId].getTxUrl(notification.txHash)} className="!no-underline">
        <div className="relative cursor-pointer flex items-center gap-5 rounded-2xl px-4 py-3 pr-8">
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
                  <Dots>{notification.summary.pending}</Dots>
                ) : status === 'error' ? (
                  notification.summary.failed
                ) : (
                  notification.summary.completed
                )}
              </Typography>
              {!hideStatus && (
                <div className="absolute -right-1 -top-1">
                  {['loading'].includes(status) ? (
                    <Loader size={15} />
                  ) : status === 'error' ? (
                    <XCircleIcon className="currentColor text-red" width={18} height={18} />
                  ) : (
                    <CheckCircleIcon className="currentColor text-green" width={18} height={18} />
                  )}
                </div>
              )}
            </div>
            <Typography variant="xs" className="text-slate-500">
              <TimeAgo date={new Date(notification.timestamp)} />
            </Typography>
          </div>
        </div>
      </Link.External>
    </div>
  )
}
