import { createToast, NotificationData } from '@sushiswap/ui'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { StorageContext } from '../context'
import { Notification, WithStorageState } from '../types'

type UseNotificationsReturn = [
  Notification[],
  {
    createNotification(notification: NotificationData): void
    clearNotifications(): void
  }
]

type UseNotifications = (context: StorageContext, account: string | undefined) => UseNotificationsReturn

export const useNotifications: UseNotifications = (context, account) => {
  const { reducerPath, actions } = context
  const notifications = useSelector((state: WithStorageState) =>
    account ? state[reducerPath].notifications[account] : []
  )
  const dispatch = useDispatch()

  const createNotification = useCallback(
    ({ promise, ...rest }: NotificationData) => {
      createToast({ ...rest, promise })
      dispatch(actions.createNotification({ account, notification: JSON.stringify(rest) }))
    },
    [actions, dispatch]
  )

  const clearNotifications = useCallback(() => {
    dispatch(actions.clearNotifications({ account }))
  }, [actions, dispatch])

  return [
    notifications || [],
    {
      createNotification,
      clearNotifications,
    },
  ]
}
