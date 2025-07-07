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
    id: 'product-x-chain',
    type: 'product',
    account: '__product__',
    summary: 'SushiSwap now supports X chain!',
    timestamp: Date.parse('2025-07-01T00:00:00Z'),
    groupTimestamp: Date.parse('2025-07-01T00:00:00Z'),
    href: '/chains/x',
    chainId: 1,
  },
  {
    isRead: false,
    id: 'product-y-chain',
    type: 'product',
    account: '__product__',
    summary: 'SushiSwap now supports Y chain!',
    timestamp: Date.parse('2025-07-03T00:00:00Z'),
    groupTimestamp: Date.parse('2025-07-03T00:00:00Z'),
    href: '/chains/y',
    chainId: 1,
  },
  {
    isRead: false,
    id: 'product-z-chain',
    type: 'product',
    account: '__product__',
    summary: 'SushiSwap now supports Z chain!',
    timestamp: Date.parse('2025-07-05T00:00:00Z'),
    groupTimestamp: Date.parse('2025-07-05T00:00:00Z'),
    href: '/chains/z',
    chainId: 1,
  },
]
