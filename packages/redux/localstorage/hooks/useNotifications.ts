import { createToast, NotificationData } from '@sushiswap/ui'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { StorageContext } from '../context'
import { WithStorageState } from '../types'

type UseNotificationsReturn = [
  Record<number, string[]>,
  {
    createNotification(notification: NotificationData): void
    clearNotifications(): void
  }
]

type UseNotifications = (context: StorageContext, account: string | undefined) => UseNotificationsReturn

export const useNotifications: UseNotifications = (context, account) => {
  const { reducerPath, actions } = context
  const dispatch = useDispatch()
  const notifications = useSelector((state: WithStorageState) =>
    account ? state[reducerPath].notifications[account] : {}
  )

  const createNotification = useCallback(
    ({ promise, ...rest }: NotificationData) => {
      const { timestamp } = rest
      createToast({ ...rest, promise })
      dispatch(actions.createNotification({ account, notification: JSON.stringify(rest), timestamp }))
    },
    [account, actions, dispatch]
  )

  const clearNotifications = useCallback(() => {
    dispatch(actions.clearNotifications({ account }))
  }, [account, actions, dispatch])

  return [
    notifications || {},
    {
      createNotification,
      clearNotifications,
    },
  ]
}
