import { ArrowLeftIcon } from '@heroicons/react/24/solid'
import { useClearNotifications, useNotifications } from '@sushiswap/react-query/src/hooks/notifications'
import { Button } from '@sushiswap/ui13/components/button'
import { List } from '@sushiswap/ui13/components/list/List'
import React, { Dispatch, FC, SetStateAction } from 'react'

import { ProfileView } from './index'
import { NotificationGroup } from './NotificationGroup'

interface TransactionsProps {
  address: `0x${string}`
  setView: Dispatch<SetStateAction<ProfileView>>
}

export const TransactionsView: FC<TransactionsProps> = ({ setView, address }) => {
  const { data: notifications } = useNotifications({ account: address })
  const { mutate: clearNotifications } = useClearNotifications({
    account: address,
  })

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-3">
        <ArrowLeftIcon
          onClick={() => setView(ProfileView.Default)}
          strokeWidth={3}
          width={20}
          height={20}
          className="cursor-pointer"
        />
        <Button onClick={() => clearNotifications()} variant="empty" size="sm" className="!px-2">
          Clear all
        </Button>
      </div>
      <List>
        <List.Label>Transactions</List.Label>
        <List.Control className="bg-gray-100 dark:bg-slate-700">
          <div className="flex flex-col gap-3 max-h-[300px] scroll">
            {notifications ? (
              Object.entries(notifications)
                .reverse()
                .map(([, notifications], index) => {
                  return <NotificationGroup key={index} notifications={notifications} />
                })
            ) : (
              <p className="text-xs text-slate-500 text-center py-10">Your transactions will appear here</p>
            )}
          </div>
        </List.Control>
      </List>
    </div>
  )
}
