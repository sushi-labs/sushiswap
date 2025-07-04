import { useNotifications } from '@sushiswap/notifications'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { ALLOWED_TYPES } from './all-inbox'
import { InboxItem, type TransactionType } from './inbox-item'

export const Transactions = () => {
  const { address } = useAccount()
  const { ungroupedNotifications, markAsRead } = useNotifications({
    account: address,
  })

  const notifications = useMemo(() => {
    if (!ungroupedNotifications) return []
    return ungroupedNotifications
      .sort((a, b) => b.timestamp - a.timestamp)
      .filter((notification) =>
        ALLOWED_TYPES.includes(notification.type as TransactionType),
      )
  }, [ungroupedNotifications])

  return (
    <div className="flex flex-col gap-4">
      {!notifications.length ? (
        <div className="text-center text-sm italic text-muted-foreground">
          You haven&apos;t received any notifications so far.
        </div>
      ) : (
        notifications.map((notification, idx) => (
          <InboxItem
            key={`txns-${idx}`}
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
