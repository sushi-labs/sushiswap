import { useContext } from 'react'

import { NotificationCentreContext } from './NotificationCentre'
import { CreateNotificationParams, NotificationType } from './types'

export const useCreateNotification = (type: NotificationType, params: CreateNotificationParams) => {
  const context = useContext(NotificationCentreContext)
  if (!context) {
    throw new Error('Hook can only be used inside Notification Centre Context')
  }

  return context.createNotification(type, params)
}
