'use client'

import {
  type NotificationType,
  getNotifications,
} from '@sushiswap/notifications'
import { addNotification } from '@sushiswap/notifications'
import { useEffect } from 'react'

export const ProductNotificationLoader = ({
  account,
}: { account: `0x${string}` }) => {
  useEffect(() => {
    const syncProductNotifications = async () => {
      const existing = await getNotifications(account)
      const existingProductIds = new Set(
        existing.filter((n) => n.type === 'product').map((n) => n.id),
      )

      const missing = PRODUCT_NOTIFICATIONS.filter(
        (p) => !existingProductIds.has(p.id),
      )

      for (const noti of missing) {
        await addNotification({
          ...noti,
          account,
        })
      }
    }

    if (account) {
      syncProductNotifications()
    }
  }, [account])

  return null
}

const PRODUCT_NOTIFICATIONS: NotificationType[] = [
  {
    isRead: false,
    id: 'product-new-advanced-swap',
    type: 'product',
    account: undefined,
    summary: "Give Sushi's new swap update a try.",
    timestamp: Date.now(),
    groupTimestamp: Date.now(),
    href: 'https://sushi.com/ethereum/swap/advanced',
    chainId: 1,
  },
]
