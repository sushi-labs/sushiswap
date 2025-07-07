import { useNotifications } from '@sushiswap/notifications'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { ALLOWED_TYPES } from './all-inbox'
import { InboxItem, type TransactionType } from './inbox-item'

export const Product = () => {
  const { address } = useAccount()
  const { productNotifications, markAsRead } = useNotifications({
    account: address,
  })
  // @ DEV use PortfolioInfoRowSkeleton for loading state

  const notifications = useMemo(() => {
    if (!productNotifications) return []
    return productNotifications
      .sort((a, b) => b.timestamp - a.timestamp)
      .filter((notification) =>
        ALLOWED_TYPES.includes(notification.type as TransactionType),
      )
  }, [productNotifications])

  return (
    <div className="flex flex-col gap-4">
      {/* <div className="text-sm italic text-center text-muted-foreground">You haven&apos;t received any notifications so far.</div> */}
      {/* <InboxItem
        type="product"
        details="Give Sushi's new swap update a try."
        date={new Date(Date.now()).toLocaleDateString()}
        isRead={false}
        markAsRead={async () => {
          // Implement mark as read logic here
        }}
      /> */}

      {notifications.map((notification) => (
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
      ))}
    </div>
  )
}
