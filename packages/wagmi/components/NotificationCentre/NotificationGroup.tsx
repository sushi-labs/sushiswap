import { Disclosure } from '@headlessui/react'
import { FC } from 'react'

import { Notification } from './Notification'

interface NotificationGroupProps {
  notifications: string[]
}

export const NotificationGroup: FC<NotificationGroupProps> = ({ notifications }) => {
  return (
    <Disclosure>
      <div className="relative bg-white bg-opacity-[0.06] rounded-xl">
        {notifications.length > 1 && <div className="absolute left-[33px] top-5 bottom-5 w-0.5 bg-slate-600" />}
        <Notification data={notifications[0]} showExtra={notifications.length > 1} />
        {notifications.length > 1 && (
          <Disclosure.Panel>
            {notifications.map((el, idx) => (
              <Notification key={idx} data={el} hideStatus />
            ))}
          </Disclosure.Panel>
        )}
      </div>
    </Disclosure>
  )
}
