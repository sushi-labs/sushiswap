'use client'

import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { useClearNotifications, useNotifications } from '@sushiswap/react-query/src/hooks/notifications'
import { Button } from '@sushiswap/ui13/components/button'
import { IconButton } from '@sushiswap/ui13/components/IconButton'
import React, { Dispatch, FC, SetStateAction } from 'react'

import { ProfileView } from './index'
import { NotificationGroup } from './NotificationGroup'

interface TransactionsProps {
  address: `0x${string}`
  setView: Dispatch<SetStateAction<ProfileView>>
}

export const TransactionsView: FC<TransactionsProps> = ({ setView, address }) => {
  const { data: notifications } = useNotifications({ account: address })
  const { mutate: clearNotifications } = useClearNotifications({ account: address })

  return (
    <div className="">
      <div className="grid grid-cols-3 items-center h-12 border-b border-slate-200/20 px-2">
        <div className="flex items-center">
          <IconButton onClick={() => setView(ProfileView.Default)}>
            <ChevronLeftIcon width={24} height={24} className="text-slate-400" />
          </IconButton>
        </div>
        <p className="font-semibold text-slate-400">Transactions</p>
        <div className="flex items-end justify-end">
          <Button onClick={() => clearNotifications()} variant="empty" size="sm" className="!p-0">
            Clear all
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-3 max-h-[300px] scroll">
        {notifications ? (
          Object.entries(notifications)
            .reverse()
            .map(([, notifications], index) => {
              return <NotificationGroup key={index} notifications={notifications} />
            })
        ) : (
          <p className="text-sm text-slate-500 text-center py-5">Your transactions will appear here</p>
        )}
      </div>
    </div>
  )
}
