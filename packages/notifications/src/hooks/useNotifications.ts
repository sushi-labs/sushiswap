'use client'

import { useEffect, useMemo, useState } from 'react'
import { updateEvent } from '../events.js'
import { getNotifications } from '../functions/getNotifications.js'
import { markAsRead } from '../functions/markAsRead.js'
import type { ResolvedNotification } from '../types.js'

type NotificationType = ResolvedNotification & { isRead: boolean; id: string }

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
    return () => {
      removeEventListener(updateEvent.type, update)
    }
  }, [account])

  const groupedNotifications = useMemo(() => {
    if (!notifications) {
      return undefined
    }

    const groups = notifications?.reduce(
      (groups, notification) => {
        const group = notification.groupTimestamp

        if (!groups[group]) {
          groups[group] = []
        }

        groups[group]!.push(notification)

        return groups
      },
      {} as Record<string, NotificationType[]>,
    )

    return Object.entries(groups).reduce<Record<string, NotificationType[]>>(
      (acc, cur) => {
        acc[cur[0]] = [...cur[1]].sort((a, b) => a.timestamp - b.timestamp)
        return acc
      },
      {},
    )
  }, [notifications])

  return {
    groupedNotifications,
    ungroupedNotifications: notifications,
    markAsRead: markAsRead,
  }
}
