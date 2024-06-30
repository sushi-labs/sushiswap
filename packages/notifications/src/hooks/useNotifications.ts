'use client'

import { useEffect, useMemo, useState } from 'react'

import { updateCounter } from '../database.js'
import { getNotifications } from '../functions/getNotifications.js'
import type { ResolvedNotification } from '../types.js'

export const useNotifications = ({
  account,
}: { account: string | `0x${string}` | undefined }) => {
  const [notifications, setNotifications] = useState<
    ResolvedNotification[] | undefined
  >(undefined)

  // biome-ignore lint/correctness/useExhaustiveDependencies: Updates handled manually by `updateCounter`
  useEffect(() => {
    getNotifications(account).then(setNotifications)
  }, [account, updateCounter])

  return useMemo(() => {
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
      {} as Record<string, ResolvedNotification[]>,
    )

    return Object.entries(groups).reduce<
      Record<string, ResolvedNotification[]>
    >((acc, cur) => {
      acc[cur[0]] = [...cur[1]].sort((a, b) => b.timestamp - a.timestamp)
      return acc
    }, {})
  }, [notifications])
}
