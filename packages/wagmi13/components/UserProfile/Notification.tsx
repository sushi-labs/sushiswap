import { Disclosure } from '@headlessui/react'
import {
  ArrowDownTrayIcon,
  ArrowRightIcon,
  ArrowsUpDownIcon,
  ArrowUpTrayIcon,
  BanknotesIcon,
  CheckIcon,
  ChevronDownIcon,
  FireIcon,
  LockOpenIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import chains, { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { classNames } from '@sushiswap/ui13'
import { Badge } from '@sushiswap/ui13/components/Badge'
import { Currency as UICurrency } from '@sushiswap/ui13/components/currency'
import { Dots } from '@sushiswap/ui13/components/Dots'
import { ExternalLink } from '@sushiswap/ui13/components/ExternalLink'
import { IconButton } from '@sushiswap/ui13/components/IconButton'
import { NetworkIcon } from '@sushiswap/ui13/components/icons'
import { Loader } from '@sushiswap/ui13/components/Loader'
import { TimeAgo } from '@sushiswap/ui13/components/TimeAgo'
import { NotificationData } from '@sushiswap/ui13/components/toast'
import React, { FC } from 'react'
import { useWaitForTransaction } from 'wagmi'

export const STARGATE_TOKEN = new Token({
  chainId: ChainId.ETHEREUM,
  address: '0xaf5191b0de278c7286d6c7cc6ab6bb8a73ba2cd6',
  decimals: 18,
  symbol: 'STG',
  name: 'StargateToken',
})

export const Notification: FC<{
  data: NotificationData
  showExtra?: boolean
  hideStatus?: boolean
}> = ({ data: notification, showExtra = false, hideStatus = false }) => {
  const { status } = useWaitForTransaction({
    chainId: notification.chainId,
    hash: notification.txHash as `0x${string}`,
  })

  if (!status)
    return (
      <div className="flex items-center gap-5 px-4 pr-8 rounded-2xl min-h-[82px] w-full">
        <div>
          <div className="rounded-full bg-slate-600 h-9 w-9" />
        </div>
        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-col w-full gap-1">
            <div className="bg-slate-500 w-full h-[12px] animate-pulse rounded-full" />
            <div className="bg-slate-500 w-[60px] h-[12px] animate-pulse rounded-full" />
          </div>
          <div className="bg-slate-600 w-[120px] h-[10px] animate-pulse rounded-full" />
        </div>
      </div>
    )

  return (
    <div className="relative hover:opacity-80">
      {showExtra && (
        <Disclosure.Button className="absolute right-3 top-0 bottom-0 z-[100]">
          {({ open }) => (
            <IconButton
              icon={ChevronDownIcon}
              iconProps={{
                width: 20,
                height: 20,
                className: classNames(open ? 'rotate-180' : 'rotate-0', 'rounded-full transition-all delay-200'),
              }}
              as="div"
            />
          )}
        </Disclosure.Button>
      )}
      <ExternalLink
        href={notification.href ? notification.href : chains[notification.chainId].getTxUrl(notification.txHash)}
        className="!no-underline"
      >
        <div
          className={classNames(
            showExtra ? 'pr-10' : 'pr-4',
            'relative cursor-pointer flex items-center gap-5 rounded-2xl px-4 py-3'
          )}
        >
          <Badge badgeContent={<NetworkIcon chainId={notification.chainId} width={18} height={18} />}>
            <div className="p-2 bg-slate-600 rounded-full h-[36px] w-[36px] flex justify-center items-center">
              {!hideStatus &&
                (status === 'loading' ? (
                  <Loader size={18} />
                ) : status === 'error' ? (
                  <XMarkIcon width={20} height={20} className="text-red-400" />
                ) : (
                  <></>
                ))}
              {(status === 'success' || notification.summary.info) && notification.type === 'send' && (
                <ArrowRightIcon width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'stargate' && (
                <UICurrency.Icon currency={STARGATE_TOKEN} width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'swap' && (
                <ArrowsUpDownIcon width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'approval' && (
                <LockOpenIcon width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'mint' && (
                <PlusIcon width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'burn' && (
                <FireIcon width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'enterBar' && (
                <ArrowDownTrayIcon width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'transferStream' && (
                <ArrowRightIcon width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'transferVesting' && (
                <ArrowRightIcon width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'createMultipleStream' && (
                <CheckIcon width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'createMultipleVesting' && (
                <CheckIcon width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'cancelStream' && (
                <CheckIcon width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'createVesting' && (
                <CheckIcon width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'createStream' && (
                <CheckIcon width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'updateStream' && (
                <ArrowDownTrayIcon width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'withdrawStream' && (
                <ArrowUpTrayIcon width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'withdrawVesting' && (
                <ArrowUpTrayIcon width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'leaveBar' && (
                <ArrowUpTrayIcon width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'claimRewards' && (
                <BanknotesIcon width={20} height={20} />
              )}
            </div>
          </Badge>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium items-center whitespace-normal text-slate-50">
                {notification.summary.info ? (
                  notification.summary.info
                ) : ['loading'].includes(status) ? (
                  <Dots>{notification.summary.pending}</Dots>
                ) : status === 'error' ? (
                  notification.summary.failed
                ) : (
                  notification.summary.completed
                )}
              </span>
            </div>
            <span className="text-xs text-slate-500">
              <TimeAgo date={new Date(notification.timestamp)} />
            </span>
          </div>
        </div>
      </ExternalLink>
    </div>
  )
}
