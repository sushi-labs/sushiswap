import { useNotifications } from '@sushiswap/notifications'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { InboxItem } from './inbox-item'

export const Product = () => {
  const { address } = useAccount()
  const { productNotifications, markAsRead } = useNotifications({
    account: address,
  })

  const notifications = useMemo(() => {
    if (!productNotifications) return []
    return productNotifications.sort((a, b) => b.timestamp - a.timestamp)
  }, [productNotifications])

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
            type="product"
            details={notification.summary}
            date={new Date(notification.timestamp).toLocaleDateString()}
            isRead={notification.isRead}
            markAsRead={() =>
              markAsRead({ account: address, ids: notification.id })
            }
          />
        ))
      )}
    </div>
  )
}
