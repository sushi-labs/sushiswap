import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { StorageContext } from '../context'
import { Notification, WithStorageState } from '../types'

type UseNotificationsReturn = [
  Notification[],
  {
    addNotification(notification: Notification): void
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

  const addNotification = useCallback(
    (notification: Notification) => {
      dispatch(actions.addNotification({ account, notification }))
    },
    [actions, dispatch]
  )

  const clearNotifications = useCallback(() => {
    dispatch(actions.clearNotifications({ account }))
  }, [actions, dispatch])

  return [
    notifications || [],
    {
      addNotification,
      clearNotifications,
    },
  ]
}
