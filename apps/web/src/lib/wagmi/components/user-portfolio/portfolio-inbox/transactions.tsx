import { useNotifications } from '@sushiswap/notifications'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { ALLOWED_TYPES } from './all-inbox'
import { InboxItem, type TransactionType } from './inbox-item'

export const Transactions = () => {
  // @ DEV use PortfolioInfoRowSkeleton for loading state
  const { address } = useAccount()
  const { transactionNotifications, markAsRead } = useNotifications({
    account: address,
  })

  const notifications = useMemo(() => {
    if (!transactionNotifications) return []
    return transactionNotifications
      .sort((a, b) => b.timestamp - a.timestamp)
      .filter((notification) =>
        ALLOWED_TYPES.includes(notification.type as TransactionType),
      )
  }, [transactionNotifications])

  return (
    <div className="flex flex-col gap-4">
      {!notifications.length ? (
        <div className="text-sm italic text-center text-muted-foreground">
          You haven&apos;t received any notifications so far.
        </div>
      ) : (
        notifications.map((notification) => (
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
        ))
      )}
    </div>
  )
}
