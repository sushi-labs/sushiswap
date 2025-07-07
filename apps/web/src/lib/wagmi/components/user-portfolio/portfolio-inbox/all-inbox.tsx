import { useNotifications } from '@sushiswap/notifications'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { InboxItem, type TransactionType } from './inbox-item'

export const ALLOWED_TYPES: TransactionType[] = [
  'addLiquidity',
  'removeLiquidity',
  'market',
  'dca',
  'swap',
  'xswap',
  'limit',
  'claimRewards',
  'product',
]

export const AllInbox = () => {
  // @ DEV use PortfolioInfoRowSkeleton for loading state
  const { address } = useAccount()
  const { groupedNotifications, markAsRead } = useNotifications({
    account: address,
  })

  const notifications = useMemo(() => {
    if (!groupedNotifications) return []
    return Object.entries(groupedNotifications)
      .flatMap(
        ([, groupNotifications]) =>
          groupNotifications[groupNotifications.length - 1],
      )
      .sort((a, b) => b.timestamp - a.timestamp)
      .filter((notification) =>
        ALLOWED_TYPES.includes(notification.type as TransactionType),
      )
  }, [groupedNotifications])

  return (
    <div className="flex flex-col gap-4">
      {!notifications.length ? (
        <div className="text-sm italic text-center text-muted-foreground">
          You haven&apos;t received any notifications so far.
        </div>
      ) : (
        <>
          {notifications.map((notification) => (
            <InboxItem
              key={notification.id}
              type={notification.type as TransactionType}
              details={notification.summary}
              date={new Date(notification.timestamp).toLocaleDateString()}
              isRead={notification.isRead}
              markAsRead={async () =>
                await markAsRead({ account: address, ids: notification.id })
              }
            />
          ))}
        </>
      )}
    </div>
  )
}
