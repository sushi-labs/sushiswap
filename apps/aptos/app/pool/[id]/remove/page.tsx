'use client'
import React, { useEffect } from 'react'
import Remove from './remove'
import { useAccount } from 'utils/useAccount'
import Loading from 'app/loading'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import requiredNetworkAlert from 'utils/requiredNetworkAlert'

const Pool = () => {
  const { isLoadingAccount } = useAccount()
  const { network, disconnect } = useWallet()
  useEffect(() => {
    requiredNetworkAlert(network, disconnect)
  }, [network, disconnect])
  return (
    <div>
      {isLoadingAccount && <Loading />}
      <Remove />
    </div>
  )
}

export default Pool
