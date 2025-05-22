import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline'
import { classNames } from '@sushiswap/ui'
import { CoinIcon } from '@sushiswap/ui/icons/CoinIcon'
import { StarIcon } from '@sushiswap/ui/icons/StarIcon'
import type { ReactNode } from 'react'

//@DEV these will change when api is ready, placeholder for now to prepare the UI
export type TransactionType =
  | 'add-liquidity'
  | 'remove-liquidity'
  | 'market'
  | 'dca'
  | 'limit'
  | 'reward-claimed'
  | 'product'

//@DEV these will change when api is ready, placeholder for now to prepare the UI
const TITLE: Record<TransactionType, string> = {
  'add-liquidity': 'Added Liquidity',
  'remove-liquidity': 'Removed Liquidity',
  market: 'Market Order Completed',
  dca: 'DCA Order Completed',
  limit: 'Limit Order Completed',
  'reward-claimed': 'Rewards Claimed',
  product: 'New Feature Available!',
}

const ICONS: Record<TransactionType, ReactNode> = {
  'add-liquidity': <ArrowDownTrayIcon width={14} height={14} strokeWidth={2} />,
  'remove-liquidity': (
    <ArrowUpTrayIcon width={14} height={14} strokeWidth={2} />
  ),
  market: <ArrowsRightLeftIcon width={14} height={14} strokeWidth={2} />,
  dca: <ArrowsRightLeftIcon width={14} height={14} strokeWidth={2} />,
  limit: <ArrowsRightLeftIcon width={14} height={14} strokeWidth={2} />,
  'reward-claimed': <CoinIcon width={14} height={14} strokeWidth={2} />,
  product: <StarIcon width={14} height={14} strokeWidth={2} />,
}

export const InboxItem = ({
  type,
  details,
  date,
  isRead,
}: {
  type: TransactionType
  details: string
  date: string
  isRead?: boolean
}) => {
  const isProduct = type === 'product'
  return (
    <div
      className={classNames(
        'flex w-full items-center hover:bg-muted px-1 py-2 gap-x-3 whitespace-nowrap',
        isRead ? 'opacity-70' : '',
      )}
    >
      <div className="shrink-0 relative rounded-full">
        {!isRead ? (
          <div className="h-2 w-2 rounded-full bg-red-100 absolute right-0 top-[1px]" />
        ) : null}
        <div
          className={classNames(
            'h-8 w-8 flex items-center justify-center rounded-full',
            isProduct
              ? 'bg-gradient-to-r from-[#3b83f614] to-[#ec489a15]'
              : 'bg-[#0000001F] dark:bg-[#FFFFFF1F]',
          )}
        >
          {ICONS[type] ? ICONS[type] : null}
        </div>
      </div>
      <div className="flex text-xs font-medium  text-[#6B7280] w-full justify-between items-center gap-x-3 overflow-hidden">
        <div className="flex flex-col overflow-hidden">
          <div className="text-sm text-muted-foreground">{TITLE[type]}</div>
          <div>{details}</div>
        </div>
        <div className="flex-[1_0_20%] flex flex-col overflow-hidden text-right">
          {date}
        </div>
      </div>
    </div>
  )
}
