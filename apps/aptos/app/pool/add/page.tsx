'use client'

import { useWallet } from '@aptos-labs/wallet-adapter-react'
import React, { useEffect } from 'react'
import requiredNetworkAlert from 'utils/requiredNetworkAlert'
import { Add } from '../../../components/Pool/PoolPage'

export default function AddPage() {
  const { network, disconnect } = useWallet()

  useEffect(() => {
    requiredNetworkAlert(network, disconnect)
  }, [network, disconnect])

  return (
    <div className="flex flex-col order-3 gap-[64px] pb-40 sm:order-2">
      <Add />
    </div>
  )
}
