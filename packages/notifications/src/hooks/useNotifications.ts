'use client'

import { useEffect, useMemo, useState } from 'react'
import { updateEvent } from '../events.js'
import { getNotifications } from '../functions/getNotifications.js'
import { markAsRead } from '../functions/markAsRead.js'
import type { ResolvedNotification } from '../types.js'

export type NotificationType = ResolvedNotification & {
  isRead: boolean
  id: string
}

export const useNotifications = ({
  account,
}: { account: string | `0x${string}` | undefined }) => {
  const [notifications, setNotifications] = useState<
    NotificationType[] | undefined
  >(undefined)

  useEffect(() => {
    const update = () => getNotifications(account).then(setNotifications)
    update()

    addEventListener(updateEvent.type, update)
    return () => removeEventListener(updateEvent.type, update)
  }, [account])

  const groupedNotifications = useMemo(() => {
    if (!notifications) return undefined

    const groups = notifications.reduce(
      (acc, notification) => {
        const group = notification.groupTimestamp
        if (!acc[group]) acc[group] = []
        acc[group]!.push(notification)
        return acc
      },
      {} as Record<string, NotificationType[]>,
    )

    return Object.entries(groups).reduce<Record<string, NotificationType[]>>(
      (acc, [group, list]) => {
        acc[group] = [...list].sort((a, b) => a.timestamp - b.timestamp)
        return acc
      },
      {},
    )
  }, [notifications])

  const transactionNotifications = useMemo(
    () => notifications?.filter((n) => n.type !== 'product') ?? [],
    [notifications],
  )

  const productNotifications = useMemo(
    () => notifications?.filter((n) => n.type === 'product') ?? [],
    [notifications],
  )

  return {
    transactionNotifications,
    productNotifications,
    ungroupedNotifications: notifications,
    groupedNotifications,
    markAsRead,
  }
}
