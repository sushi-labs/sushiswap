import { BellIcon, XIcon } from '@heroicons/react/solid'
import { Button, Drawer, IconButton, Typography } from '@sushiswap/ui'
import React, { createContext, FC } from 'react'

import { Notification } from './Notification'
import { CreateNotificationParams, NotificationType } from './types'

export const NotificationCentreContext = createContext<ProviderProps | undefined>(undefined)

interface ProviderProps {
  notifications: { data: string }[]
  clearNotifications(): void
  createNotification(type: NotificationType, params: CreateNotificationParams): void
}

export const NotificationCentre: FC<Omit<ProviderProps, 'createNotification'>> = ({
  notifications,
  clearNotifications,
}) => {
  return (
    <Drawer.Root>
      <Drawer.Button className="bg-slate-700 hover:ring-2 ring-slate-600 cursor-pointer h-[36px] w-[36px] flex items-center justify-center rounded-xl">
        <BellIcon width={20} height={20} />
      </Drawer.Button>
      <Drawer.Panel>
        <div className="flex gap-3 items-center mb-2 h-[54px] border-b border-slate-200/5">
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
    </Drawer.Root>
  )
}
