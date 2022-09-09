import { BellIcon, XIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { Button, createToast, Drawer, IconButton, Typography } from '@sushiswap/ui'
import React, { createContext, FC, useCallback, useContext } from 'react'

import { Notification } from './Notification'
import { CreateNotificationParams, NotificationType } from './types'

export const NotificationCentreContext = createContext<ProviderProps | undefined>(undefined)

interface ProviderProps {
  notifications: { data: string }[]
  clearNotifications(): void
  addNotification({ data }: { data: string }): void
  createNotification(type: NotificationType, params: CreateNotificationParams): void
}

export const NotificationCentre: FC<ProviderProps> = ({ notifications, clearNotifications, addNotification }) => {
  const createNotification = useCallback(
    (type: NotificationType, params: CreateNotificationParams) => {
      addNotification({
        data: JSON.stringify({
          type,
          chainId: ChainId.ETHEREUM,
          pending: params.summary.pending,
          completed: params.summary.completed,
          failed: params.summary.failed,
          txHash: params.txHash,
          date: new Date().toISOString(),
        }),
      })

      createToast(params)
    },
    [addNotification]
  )

  return (
    <NotificationCentreContext.Provider
      value={{ notifications, clearNotifications, addNotification, createNotification }}
    >
      <_NotificationCentre />
    </NotificationCentreContext.Provider>
  )
}

const useNotificationCentre = () => {
  const context = useContext(NotificationCentreContext)
  if (!context) {
    throw new Error('Hook can only be used inside Notification Centre Context')
  }

  return context
}

const _NotificationCentre: FC = () => {
  const { notifications, clearNotifications } = useNotificationCentre()

  return (
    <>
      <Drawer.Button className="bg-slate-700 hover:ring-2 ring-slate-600 cursor-pointer h-[36px] w-[36px] flex items-center justify-center rounded-xl">
        <BellIcon width={20} height={20} />
      </Drawer.Button>
      <Drawer.Panel className="relative">
        <div className="flex gap-3 items-baseline mb-2">
          <Typography variant="lg" weight={500} className="text-slate-50">
            Notifications
          </Typography>
          <Button size="sm" variant="empty" className="!px-0" onClick={clearNotifications}>
            Clear
          </Button>
          <div className="absolute right-4 top-4">
            <Drawer.Button>
              <IconButton>
                <XIcon width={20} height={20} />
              </IconButton>
            </Drawer.Button>
          </div>
        </div>
        {notifications.map((el, index) => {
          return <Notification key={index} data={el.data} />
        })}
      </Drawer.Panel>
    </>
  )
}
