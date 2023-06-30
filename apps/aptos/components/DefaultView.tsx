import { useWallet } from '@aptos-labs/wallet-adapter-react'
import React from 'react'

export const DefaultView = () => {
  const { disconnect } = useWallet()
  return (
    <div onClick={disconnect} className="flex flex-col gap-8 p-4">
      <div className="flex justify-between gap-3">
        <div className="text-sm font-semibold flex items-center gap-1.5 text-gray-700 dark:text-slate-200">
          DefaultView
        </div>
      </div>
    </div>
  )
}
