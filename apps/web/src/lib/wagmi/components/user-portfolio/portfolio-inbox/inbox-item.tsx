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
  | 'addLiquidity'
  | 'removeLiquidity'
  | 'market'
  | 'dca'
  | 'swap'
  | 'xswap'
  | 'limit'
  | 'claimRewards'
  | 'product'
  | 'mint'
  | 'burn'

//@DEV these will change when api is ready, placeholder for now to prepare the UI
const TITLE: Record<TransactionType, string> = {
  addLiquidity: 'Added Liquidity',
  removeLiquidity: 'Removed Liquidity',
  market: 'Market Order Completed',
  swap: 'Market Order Completed',
  xswap: 'Market Order Completed',
  dca: 'DCA Order Completed',
  limit: 'Limit Order Completed',
  claimRewards: 'Rewards Claimed',
  product: 'New Feature Available!',
  mint: 'Liquidity Added',
  burn: 'Liquidity Removed',
}

const ICONS: Record<TransactionType, ReactNode> = {
  addLiquidity: <ArrowDownTrayIcon width={14} height={14} strokeWidth={2} />,
  removeLiquidity: <ArrowUpTrayIcon width={14} height={14} strokeWidth={2} />,
  xswap: <ArrowsRightLeftIcon width={14} height={14} strokeWidth={2} />,
  swap: <ArrowsRightLeftIcon width={14} height={14} strokeWidth={2} />,
  market: <ArrowsRightLeftIcon width={14} height={14} strokeWidth={2} />,
  dca: <ArrowsRightLeftIcon width={14} height={14} strokeWidth={2} />,
  limit: <ArrowsRightLeftIcon width={14} height={14} strokeWidth={2} />,
  claimRewards: <CoinIcon width={14} height={14} strokeWidth={2} />,
  product: <StarIcon width={14} height={14} strokeWidth={2} />,
  mint: <ArrowDownTrayIcon width={14} height={14} strokeWidth={2} />,
  burn: <ArrowUpTrayIcon width={14} height={14} strokeWidth={2} />,
}

export const InboxItem = ({
  type,
  details,
  date,
  isRead,
  markAsRead,
}: {
  type: TransactionType
  details: string
  date: string
  isRead: boolean
  markAsRead: () => Promise<void>
}) => {
  const isProduct = type === 'product'
  return (
    <button
      type="button"
      onClick={async () => {
        if (!isRead) {
          await markAsRead()
        }
      }}
      className={classNames(
        'flex w-full items-center px-1 py-2 gap-x-3 whitespace-nowrap',
        isRead ? 'opacity-70 cursor-default' : 'hover:bg-muted',
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
      <div className="flex text-xs font-medium text-[#6B7280] w-full justify-between items-center gap-x-3">
        <div className="flex flex-col text-left whitespace-normal items-start">
          <div className="text-sm text-muted-foreground">{TITLE[type]}</div>
          <div className="">{details}</div>
        </div>
        <div className="flex-[1_0_20%] flex flex-col text-right">{date}</div>
      </div>
    </button>
  )
}
