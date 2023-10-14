import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { Button } from '@sushiswap/ui/components/button'
import React, { Dispatch, FC, SetStateAction } from 'react'

import { ProfileView } from './index'
import { useClearNotifications } from '@sushiswap/dexie'
import { IconButton } from '@sushiswap/ui/components/iconbutton'
import { useTransactions } from '../../hooks'

interface TransactionsProps {
  address: `0x${string}`
  setView: Dispatch<SetStateAction<ProfileView>>
}

export const TransactionsView: FC<TransactionsProps> = ({
  setView,
  address,
}) => {
  const { data: transactions } = useTransactions({ account: address })
  const clearNotifications = useClearNotifications({ account: address })

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <IconButton
          size="sm"
          onClick={() => setView(ProfileView.Default)}
          icon={ArrowLeftIcon}
          name="Back"
        />
        <Button
          onClick={() => clearNotifications()}
          variant="ghost"
          size="sm"
          className="!px-2"
        >
          Clear all
        </Button>
      </div>
      {transactions?.map((el) => (
        <div>{el.timestamp}</div>
      ))}
    </>
  )
}
